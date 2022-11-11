import MembersDao from '../src/dao/MembersDao';
import ShoutoutsDao from '../src/dao/ShoutoutsDao';
import { db } from '../src/firebase';
import { fakeIdolMember } from './data/createData';

const shoutoutData = {
  mu1: fakeIdolMember()
};

const mockShoutout1 = {
  giver: shoutoutData.mu1,
  receiver: 'Fake Idol Member',
  message: 'Mock Shoutout',
  isAnon: false,
  timestamp: Date.now(),
  hidden: false,
  uuid: 'xyz'
};

/* Adding mock users for testing sign-ins */
beforeAll(async () => {
  await MembersDao.setMember(shoutoutData.mu1.email, shoutoutData.mu1);
});

/* Cleanup database after running tests */
afterAll(async () => {
  Promise.all(
    Object.keys(shoutoutData).map(async (netid) => {
      const mockUser = shoutoutData[netid];
      await MembersDao.deleteMember(mockUser.email);
      return mockUser;
    })
  );
  const mockShoutouts = db.collection('shoutouts').where('message', '==', 'Mock Shoutout');
  await mockShoutouts.get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      doc.ref.delete();
    });
  });
});

test('Send shoutout', async () => {
  await ShoutoutsDao.setShoutout(mockShoutout1);
  const allShoutouts = await ShoutoutsDao.getAllShoutouts();
  expect(allShoutouts).toContainEqual(mockShoutout1);
});

test('Get sent shoutout', async () => {
  const shoutoutsSent = await ShoutoutsDao.getShoutouts(shoutoutData.mu1.email, 'given');
  expect(shoutoutsSent).toContainEqual(mockShoutout1);
});

test('Hide shoutout', async () => {
  const hiddenShoutout = await ShoutoutsDao.updateShoutout(mockShoutout1);
  expect(hiddenShoutout.hidden === true);
});
