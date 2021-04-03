import admin from 'firebase-admin';
import { DBTeam } from './DataTypes';

require('dotenv').config();

const useProdDb: boolean = JSON.parse(process.env.USE_PROD_DB as string);

const prodServiceAccount = require('../resources/idol-b6c68-firebase-adminsdk-h4e6t-40e4bd5536.json');
const devServiceAccount = require('../resources/cornelldti-idol-firebase-adminsdk-ifi28-9aaca97159.json');

const serviceAccount = useProdDb ? prodServiceAccount : devServiceAccount;

const configureAccount = (sa) => {
  const configAcc = sa;
  let parsedPK;
  try {
    parsedPK = useProdDb
      ? JSON.parse(process.env.FIREBASE_PRIVATE_KEY as string)
      : JSON.parse(process.env.FIREBASE_DEV_PRIVATE_KEY as string);
  } catch (err) {
    parsedPK = useProdDb
      ? process.env.FIREBASE_PRIVATE_KEY
      : process.env.FIREBASE_DEV_PRIVATE_KEY;
  }
  configAcc.private_key = parsedPK;
  configAcc.private_key_id = useProdDb
    ? process.env.FIREBASE_PRIVATE_KEY_ID
    : process.env.FIREBASE_DEV_PRIVATE_KEY_ID;
  return configAcc;
};

export const app = admin.initializeApp({
  credential: admin.credential.cert(configureAccount(serviceAccount)),
  databaseURL: 'https://idol-b6c68.firebaseio.com',
  storageBucket: useProdDb
    ? 'gs://idol-b6c68.appspot.com'
    : 'gs://cornelldti-idol.appspot.com'
});

export const bucket = admin.storage().bucket();
export const db = admin.firestore();

export const memberCollection: admin.firestore.CollectionReference<IdolMember> = db
  .collection('members')
  .withConverter({
    fromFirestore(snapshot): IdolMember {
      return snapshot.data() as IdolMember;
    },
    toFirestore(userData: IdolMember) {
      return userData;
    }
  });

export const teamCollection: admin.firestore.CollectionReference<DBTeam> = db
  .collection('teams')
  .withConverter({
    fromFirestore(snapshot): DBTeam {
      return snapshot.data() as DBTeam;
    },
    toFirestore(userData: DBTeam) {
      return userData;
    }
  });

export const adminCollection: admin.firestore.CollectionReference = db.collection(
  'admins'
);
