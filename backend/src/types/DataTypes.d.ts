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
  receiver: string;
  message: string;
  isAnon: boolean;
  timestamp: number;
  hidden: boolean;
  uuid: string;
};

export type Shoutout = {
  giver: IdolMember;
  receiver: string;
  message: string;
  isAnon: boolean;
  timestamp: number;
  hidden: boolean;
  uuid: string;
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

export type DBTeamEventAttendance = {
  member: firestore.DocumentReference;
  hoursAttended?: number;
  image: string;
};

export type DBTeamEvent = {
  name: string;
  date: string;
  numCredits: string;
  hasHours: boolean;
  requests: DBTeamEventAttendance[];
  attendees: DBTeamEventAttendance[];
  uuid: string;
  isCommunity: boolean;
};

export type DBCandidateDeciderRating = {
  readonly reviewer: firestore.DocumentReference;
  readonly rating: Rating;
};

export type DBCandidateDeciderComment = {
  readonly reviewer: firestore.DocumentReference;
  readonly comment: string;
};

export type DBCandidateDeciderCandidate = {
  readonly responses: string[];
  readonly id: number;
  ratings: DBCandidateDeciderRating[];
  comments: DBCandidateDeciderComment[];
};

export type DBCandidateDeciderInstance = {
  readonly name: string;
  readonly headers: string[];
  readonly candidates: DBCandidateDeciderCandidate[];
  readonly uuid: string;
  readonly authorizedMembers: firestore.DocumentReference[];
  readonly authorizedRoles: Role[];
  isOpen: boolean;
};

export type DBDevPortfolio = {
  name: string;
  deadline: number;
  earliestValidDate: number;
  submissions: DBDevPortfolioSubmission[];
  lateDeadline: number | null;
  readonly uuid: string;
};

export type DBDevPortfolioSubmission = {
  member: firestore.DocumentReference;
  openedPRs: PullRequestSubmission[];
  reviewedPRs: PullRequestSubmission[];
  status: SubmissionStatus;
};

export type DevPortfolioSubmissionRequestLog = {
  timestamp: string;
  email: string;
  body: {
    submission: DBDevPortfolioSubmission;
    uuid: string;
  };
};
