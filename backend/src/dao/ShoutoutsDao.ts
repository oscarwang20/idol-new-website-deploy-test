import { memberCollection, shoutoutCollection } from '../firebase';
import { Shoutout, DBShoutout } from '../DataTypes';

export default class ShoutoutsDao {
  static async getShoutouts(
    email: string,
    type: 'given' | 'received'
  ): Promise<Shoutout[]> {
    const givenOrReceived = type === 'given' ? 'giver' : 'receiver';
    const shoutoutRefs = await shoutoutCollection
      .where(givenOrReceived, '==', memberCollection.doc(email))
      .get();
    return Promise.all(
      shoutoutRefs.docs.map(async (shoutoutRef) => {
        const { giver, receiver, message } = shoutoutRef.data();
        return {
          giver: (await giver.get().then((doc) => doc.data())) as IdolMember,
          receiver: (await receiver
            .get()
            .then((doc) => doc.data())) as IdolMember,
          message
        };
      })
    );
  }

  static async setShoutout(shoutout: Shoutout): Promise<Shoutout> {
    const shoutoutRef: DBShoutout = {
      ...shoutout,
      giver: memberCollection.doc(shoutout.giver.email),
      receiver: memberCollection.doc(shoutout.receiver.email)
    };
    await shoutoutCollection.doc().set(shoutoutRef);
    return shoutout;
  }
}