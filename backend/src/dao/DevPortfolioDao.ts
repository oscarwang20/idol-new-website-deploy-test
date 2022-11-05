import { v4 as uuidv4 } from 'uuid';
import { devPortfolioCollection, memberCollection } from '../firebase';
import { DBDevPortfolio, DBDevPortfolioSubmission } from '../types/DataTypes';
import { getMemberFromDocumentReference } from '../utils/memberUtil';
import { getSubmissionStatus } from '../utils/githubUtil';

export function devPortfolioSubmissionToDBDevPortfolioSubmission(
  submission: DevPortfolioSubmission
): DBDevPortfolioSubmission {
  return {
    ...submission,
    member: memberCollection.doc(submission.member.email)
  };
}

export default class DevPortfolioDao {
  private static async DBDevPortfolioToDevPortfolio(data: DBDevPortfolio): Promise<DevPortfolio> {
    const submissions = await Promise.all(
      data.submissions.map(async (submission) => {
        const fromDb = {
          ...submission,
          member: await getMemberFromDocumentReference(submission.member)
        } as DevPortfolioSubmission;

        // since not all submissions could have this field yet
        if (!fromDb.status) {
          return { ...fromDb, status: getSubmissionStatus(fromDb) };
        }
        return fromDb;
      })
    );

    return { ...data, submissions };
  }

  private static devPortfolioToDBDevPortfolio(instance: DevPortfolio): DBDevPortfolio {
    return {
      ...instance,
      uuid: instance.uuid ? instance.uuid : uuidv4(),
      submissions: instance.submissions.map((submission) => ({
        ...submission,
        member: memberCollection.doc(submission.member.email)
      }))
    };
  }

  public static async getDevPortfolio(uuid: string): Promise<DevPortfolio> {
    const doc = await devPortfolioCollection.doc(uuid).get();
    return this.DBDevPortfolioToDevPortfolio(doc.data() as DBDevPortfolio);
  }

  static async makeDevPortfolioSubmission(
    uuid: string,
    submission: DevPortfolioSubmission
  ): Promise<DevPortfolioSubmission> {
    const doc = await devPortfolioCollection.doc(uuid).get();

    const data = doc.data() as DBDevPortfolio;

    const subs = data.submissions;
    subs.push(devPortfolioSubmissionToDBDevPortfolioSubmission(submission));
    await devPortfolioCollection.doc(uuid).update({ submissions: subs });

    return submission;
  }

  static async getInstance(uuid: string): Promise<DevPortfolio | null> {
    const doc = await devPortfolioCollection.doc(uuid).get();
    if (!doc) return null;

    const data = doc.data() as DBDevPortfolio;

    return DevPortfolioDao.DBDevPortfolioToDevPortfolio(data);
  }

  static async getAllInstances(): Promise<DevPortfolio[]> {
    const instanceRefs = await devPortfolioCollection.get();

    return Promise.all(
      instanceRefs.docs.map(async (instanceRefs) =>
        DevPortfolioDao.DBDevPortfolioToDevPortfolio(instanceRefs.data() as DBDevPortfolio)
      )
    );
  }

  public static async getAllDevPortfolioInfo(): Promise<DevPortfolioInfo[]> {
    const instanceInfoRefs = await devPortfolioCollection
      .select('deadline', 'earliestValidDate', 'name', 'uuid', 'lateDeadline')
      .get();
    return Promise.all(
      instanceInfoRefs.docs.map(async (instanceRefs) => {
        const { submissions, ...devPortfolioInfo } = instanceRefs.data() as DBDevPortfolio;
        return devPortfolioInfo;
      })
    );
  }

  public static async getDevPortfolioInfo(uuid: string): Promise<DevPortfolioInfo> {
    const portfolioRef = await devPortfolioCollection.doc(uuid).get();
    const { submissions, ...devPortfolioInfo } = portfolioRef.data() as DBDevPortfolio;
    return devPortfolioInfo;
  }

  public static async getUsersDevPortfolioSubmissions(
    uuid: string,
    user: IdolMember
  ): Promise<DevPortfolioSubmission[]> {
    const portfolioData = (await devPortfolioCollection.doc(uuid).get()).data() as DBDevPortfolio;
    const dBSubmissions = portfolioData.submissions.filter(
      (submission) => submission.member.id === user.email
    );

    return dBSubmissions.map((submission) => ({ ...submission, member: user }));
  }

  static async createNewInstance(instance: DevPortfolio): Promise<DevPortfolio> {
    const portfolio = {
      ...instance,
      submissions: [],
      uuid: instance.uuid ? instance.uuid : uuidv4()
    };
    devPortfolioCollection.doc(portfolio.uuid).set(portfolio);
    return portfolio;
  }

  static async updateInstance(updatedInstance: DevPortfolio): Promise<void> {
    const dbInstance = this.devPortfolioToDBDevPortfolio(updatedInstance);

    await devPortfolioCollection.doc(dbInstance.uuid).set(dbInstance);
  }

  static async deleteInstance(uuid: string): Promise<void> {
    await devPortfolioCollection.doc(uuid).delete();
  }
}
