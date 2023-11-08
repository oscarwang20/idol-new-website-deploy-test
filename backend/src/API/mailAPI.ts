import axios, { AxiosResponse } from 'axios';
import { Request } from 'express';
import getEmailTransporter from '../nodemailer';
import { isProd } from '../api';
import AdminsDao from '../dao/AdminsDao';
import PermissionsManager from '../utils/permissionsManager';
import { PermissionError } from '../utils/errors';
import { getAllTeamEvents, getTeamEventAttendanceByUser } from './teamEventsAPI';

export const sendMail = async (
  to: string,
  subject: string,
  text: string,
  user: IdolMember
): Promise<unknown> => {
  if (!(await PermissionsManager.isAdmin(user)))
    throw new PermissionError('User does not have permission to send automated emails.');

  const mailOptions = {
    from: 'dti.idol.github.bot@gmail.com',
    to,
    subject: `IDOL Notifs: ${subject}`,
    text
  };
  const transporter = await getEmailTransporter();
  const info = await transporter
    .sendMail(mailOptions)
    .then((info) => info)
    .catch((error) => ({ error }));
  return info;
};

const getSendMailURL = (req: Request): string => {
  if (isProd) {
    return `https://${req.hostname}/.netlify/functions/api/sendMail`;
  }
  return 'http://localhost:9000/.netlify/functions/api/sendMail';
};

const emailAdmins = async (req: Request, subject: string, text: string) => {
  const url = getSendMailURL(req);
  const adminEmails = await AdminsDao.getAllAdminEmails();
  const idToken = req.headers['auth-token'] as string;
  const requestBody = {
    subject,
    text
  };

  return adminEmails.map(async (email) => {
    axios.post(url, { ...requestBody, to: email }, { headers: { 'auth-token': idToken } });
  });
};

const emailMember = async (req: Request, member: IdolMember, subject: string, text: string) => {
  const url = getSendMailURL(req);
  const idToken = req.headers['auth-token'] as string;
  const requestBody = {
    subject,
    text
  };

  return axios.post(
    url,
    { ...requestBody, to: member.email },
    { headers: { 'auth-token': idToken } }
  );
};

export const sendMemberUpdateNotifications = async (req: Request): Promise<Promise<void>[]> => {
  const subject = 'IDOL Member Profile Change';
  const text =
    'Hey! A DTI member has updated their profile on IDOL. Please visit https://idol.cornelldti.org/admin/member-review to review the changes.';
  return emailAdmins(req, subject, text);
};

export const sendTECReminder = async (req: Request, member: IdolMember): Promise<AxiosResponse> => {
  const subject = 'TEC Reminder';
  const allEvents = getAllTeamEvents(req.body);
  const futureEvents = (await allEvents).filter((event) => {
    const eventDate = new Date(event.date);
    const todayDate = new Date();
    return eventDate >= todayDate;
  });
  const memberEvents = getTeamEventAttendanceByUser(member);
  let approvedCount = 0;
  let pendingCount = 0;
  (await memberEvents).forEach((event) => {
    if (event.status === 'approved') {
      approvedCount += 1;
    }
    if (event.status === 'pending') {
      pendingCount += 1;
    }
  });

  const text =
    `Hey! You currently have ${approvedCount} team event credits approved and ${pendingCount} team event credits pending this semester. ` +
    `This is a reminder to get at least ${
      member.role === 'lead' ? '6' : '3'
    } team events credits by the end of the semester.\n` +
    `\n${
      futureEvents.length === 0
        ? 'There are currently no upcoming team events, but check IDOL soon for updates.'
        : 'Here is a list of upcoming team events you can participate in:'
    } \n` +
    `${(await futureEvents)
      .map(
        (event) =>
          `${event.name} on ${event.date} (${event.numCredits} ${
            Number(event.numCredits) !== 1 ? 'credits' : 'credit'
          })\n`
      )
      .join('')}`;
  return emailMember(req, member, subject, text);
};
