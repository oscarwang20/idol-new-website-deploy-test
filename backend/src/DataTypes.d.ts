import { firestore } from 'firebase-admin';

export type Team = {
  uuid: string;
  name: string;
  leaders: IdolMember[];
  members: IdolMember[];
  formerMembers: IdolMember[];
};

export type DBShoutout = {
  giver: firestore.DocumentReference;
  receiver: firestore.DocumentReference;
  message: string;
  isAnon: boolean;
};

export type Shoutout =
  | {
      giver: IdolMember;
      receiver: IdolMember;
      message: string;
      isAnon: false;
    }
  | {
      receiver: IdolMember;
      message: string;
      isAnon: true;
    };

export type DBSignInForm = {
  users: { signedInAt: number; user: firestore.DocumentReference }[];
  createdAt: number;
  expireAt: number;
  id: string;
};

export type SignInForm = {
  users: { signedInAt: number; user: IdolMember }[];
  createdAt: number;
  expireAt: number;
  id: string;
};

export type DBTeamEvent = {
  name: string;
  date: string;
  numCredits: string;
  hasHours: boolean;
  membersPending: firestore.DocumentReference[];
  membersApproved: firestore.DocumentReference[];
  uuid: string;
};

export type TeamEvent = {
  name: string;
  date: string;
  numCredits: string;
  hasHours: boolean;
  membersPending: IdolMember[];
  membersApproved: IdolMember[];
  uuid: string;
};
