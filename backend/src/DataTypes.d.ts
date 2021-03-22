import { firestore } from 'firebase-admin';

export type Member = IdolMember;

export type DBTeam = {
  uuid: string;
  name: string;
  leaders: firestore.DocumentReference[];
  members: firestore.DocumentReference[];
};

export type Team = {
  uuid: string;
  name: string;
  leaders: Member[];
  members: Member[];
};
