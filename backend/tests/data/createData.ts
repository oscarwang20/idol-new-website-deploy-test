import { faker } from '@faker-js/faker';
import { TeamEventAttendance, TeamEvent } from '../../src/DataTypes';

/** Get random number in range [`a`,`b`], inclusive. */
const getRandomInt = (a, b) => {
  const min = Math.ceil(a);
  const max = Math.floor(b);
  return Math.floor(Math.random() * (max - min + 1) + min);
};

/** Get year string. Ex. "2023" */
const fakeYear = (): string => {
  const year = faker.date.future().getFullYear();
  return year.toString();
};

/** Get list of 1 to 3 fake subteams. */
const fakeSubteams = (): string[] => {
  // 1 to 3 length of random words
  const length = getRandomInt(0, 3);
  const subteams = [];
  /* eslint-disable no-plusplus */
  for (let i = 0; i < length; i++) {
    subteams.push(faker.lorem.word());
  }

  return subteams;
};

const fakeRoleObject = () => {
  const roles: Role[] = ['lead', 'tpm', 'pm', 'developer', 'designer', 'business'];
  const role_descriptions: RoleDescription[] = [
    'Lead',
    'Technical PM',
    'Product Manager',
    'Developer',
    'Designer',
    'Business Analyst'
  ];

  // pick one item at random from each list
  const role = roles[Math.floor(Math.random() * roles.length)];
  const roleDescription = role_descriptions[Math.floor(Math.random() * role_descriptions.length)];
  return { role, roleDescription };
};

/** Create fake Idol member */
export const fakeIdolMember = (): IdolMember => {
  const member = {
    netid: 'test123', // to easily be able to find fake members if needed
    email: faker.internet.email(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    pronouns: faker.hacker.noun(),
    graduation: fakeYear(),
    major: faker.lorem.word(),
    hometown: faker.address.city(),
    about: faker.lorem.paragraph(),
    subteams: fakeSubteams(),
    ...fakeRoleObject()
  };
  return member;
};

/** Create a fake TeamEventAttendace object. */
export const fakeTeamEventAttendance = (): TeamEventAttendance => {
  const TEA = {
    member: fakeIdolMember(),
    hoursAttended: getRandomInt(1, 5),
    image: null
  };
  return TEA;
};

/** Create a fake TeamEvent object. */
export const fakeTeamEvent = (): TeamEvent => {
  const TE = {
    name: 'testteamevent', // to easily be able to tell fake TeamEvents if needed
    date: faker.date.past().toLocaleDateString(),
    numCredits: getRandomInt(1, 3).toString(),
    hasHours: getRandomInt(0, 1) === 0,
    requests: [fakeTeamEventAttendance()],
    attendees: [],
    uuid: faker.datatype.uuid()
  };
  return TE;
};