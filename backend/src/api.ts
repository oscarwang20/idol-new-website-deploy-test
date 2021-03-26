import express, { RequestHandler, Request, Response } from 'express';
import serverless from 'serverless-http';
import cors from 'cors';
import session, { MemoryStore } from 'express-session';
import bodyParser from 'body-parser';
import admin from 'firebase-admin';
import { db as database, app as adminApp } from './firebase';
import {
  allMembers,
  getMember,
  setMember,
  deleteMember,
  updateMember
} from './memberAPI';
import { getMemberImage, setMemberImage, allMemberImages } from './imageAPI';
import { allTeams, setTeam, deleteTeam } from './teamAPI';
import { allRoles } from './permissions';
import { HandlerError } from './errors';

// Constants and configurations
const app = express();
const router = express.Router();
const db = database;
const PORT = process.env.PORT || 9000;
const isProd: boolean = JSON.parse(process.env.IS_PROD as string);
const allowAllOrigins = false;
export const enforceSession = true;
// eslint-disable-next-line no-nested-ternary
const allowedOrigins = allowAllOrigins
  ? [/.*/]
  : isProd
  ? [/https:\/\/idol\.cornelldti\.org/, /.*--cornelldti-idol\.netlify\.app/]
  : [/http:\/\/localhost:3000/];

// Middleware
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true
  })
);
app.use(bodyParser.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    resave: true,
    saveUninitialized: true,
    store: new MemoryStore(),
    cookie: {
      secure: !!isProd,
      maxAge: 3600000
    }
  })
);

// eslint-disable-next-line no-console
const sessionErrCb = (err) => console.error(err);

// Check valid session
const checkLoggedIn = (req: Request, res: Response): boolean => {
  if (!enforceSession) {
    return true;
  }
  if (req.session?.isLoggedIn) {
    return true;
  }
  // Session expired
  res.status(440).json({ error: 'Not logged in!' });
  return false;
};

const loginCheckedHandler = (
  handler: (req: Request) => Promise<Record<string, unknown>>
): RequestHandler => async (req: Request, res: Response): Promise<void> => {
  if (!checkLoggedIn(req, res)) return;
  try {
    res.status(200).send(await handler(req));
  } catch (error) {
    if (error instanceof HandlerError) {
      res.status(error.errorCode).send({ error: error.reason });
      return;
    }
    res
      .status(500)
      .send({ error: `Failed to handle the request due to ${error}.` });
  }
};

const loginCheckedGet = (
  path: string,
  handler: (req: Request) => Promise<Record<string, unknown>>
) => router.get(path, loginCheckedHandler(handler));

const loginCheckedPost = (
  path: string,
  handler: (req: Request) => Promise<Record<string, unknown>>
) => router.post(path, loginCheckedHandler(handler));

const loginCheckedDelete = (
  path: string,
  handler: (req: Request) => Promise<Record<string, unknown>>
) => router.delete(path, loginCheckedHandler(handler));

// Login
router.post('/login', async (req: Request, res: Response) => {
  const members = await db
    .collection('members')
    .get()
    .then((vals) => vals.docs.map((doc) => doc.data()));
  const { auth_token } = req.body;
  admin
    .auth(adminApp)
    .verifyIdToken(auth_token)
    .then((decoded) => {
      const foundMember = members.find((val) => val.email === decoded.email);
      if (!foundMember) {
        res.json({ isLoggedIn: false });
        return;
      }
      const session = req.session as Express.Session;
      session.isLoggedIn = true;
      session.email = foundMember.email;
      session.save((err) => {
        if (err) sessionErrCb(err);
        res.json({ isLoggedIn: true });
      });
    });
});

// Logout
router.post('/logout', (req: Request, res: Response) => {
  const session = req.session as Express.Session;
  session.isLoggedIn = false;
  session.destroy((err) => {
    if (err) sessionErrCb(err);
    res.json({ isLoggedIn: false });
  });
});

// Roles
router.get('/allRoles', (_, res) => res.status(200).json({ roles: allRoles }));

// Members
router.get('/allMembers', async (_, res) => {
  const members = await allMembers();
  res.status(200).json({ members });
});
loginCheckedGet('/getMember/:email', async (req) => ({
  member: await getMember(req)
}));
loginCheckedPost('/setMember', async (req) => ({
  member: await setMember(req)
}));
loginCheckedDelete('/deleteMember/:email', async (req) => {
  await deleteMember(req);
  return {};
});
loginCheckedPost('/updateMember', async (req) => ({
  member: await updateMember(req)
}));

// Teams
loginCheckedGet('/allTeams', async (_) => ({ teams: await allTeams() }));
loginCheckedPost('/setTeam', async (req) => ({ team: await setTeam(req) }));
loginCheckedPost('/deleteTeam', async (req) => ({
  team: await deleteTeam(req)
}));

// Images
loginCheckedGet('/getMemberImage', async (req) => ({
  url: await getMemberImage(req)
}));
loginCheckedGet('/getImageSignedURL', async (req) => ({
  url: await setMemberImage(req)
}));
router.get('/allMemberImages', async (_, res) => {
  const images = await allMemberImages();
  res.status(200).json({ images });
});

app.use('/.netlify/functions/api', router);

// Startup local server if not production (prod is serverless)
if (!isProd) {
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`IDOL backend listening on port: ${PORT}`);
  });
}

export const handler = serverless(app);
