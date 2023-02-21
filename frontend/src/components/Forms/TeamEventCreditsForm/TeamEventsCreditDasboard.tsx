import React from 'react';
import { Form, Card, Message } from 'semantic-ui-react';
import { useSelf } from '../../Common/FirestoreDataProvider';
import styles from './TeamEventCreditsForm.module.css';

const REQUIRED_COMMUNITY_CREDITS = 1;
const REQUIRED_MEMBER_TEC_CREDITS = 3;
const REQUIRED_LEAD_TEC_CREDITS = 6;

const TeamEventCreditDashboard = (props: {
  approvedTEC: TeamEventHoursInfo[];
  pendingTEC: TeamEventHoursInfo[];
}): JSX.Element => {
  const { approvedTEC, pendingTEC } = props;

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const userRole = useSelf()!.role;

  const requiredCredits =
    userRole === 'lead' ? REQUIRED_LEAD_TEC_CREDITS : REQUIRED_MEMBER_TEC_CREDITS; // number of required tec credits in a semester based on user role

  const calculateNumCredits = ({
    hasHours,
    hoursAttended,
    numCredits
  }: TeamEventHoursInfo): number =>
    hasHours && hoursAttended ? Number(numCredits) * hoursAttended : Number(numCredits);

  const approvedCredits = approvedTEC.reduce(
    (approved, teamEvent) => approved + calculateNumCredits(teamEvent),
    0
  );
  const approvedCommunityCredits = approvedTEC.reduce(
    (communityCredits, teamEvent) =>
      teamEvent.isCommunity ? communityCredits + Number(teamEvent.numCredits) : communityCredits,
    0
  );

  // Calculate the remaining credits
  let remainingCredits;
  if (requiredCredits - approvedCredits > 0) remainingCredits = requiredCredits - approvedCredits;
  else if (approvedCommunityCredits < REQUIRED_COMMUNITY_CREDITS)
    remainingCredits = REQUIRED_COMMUNITY_CREDITS - approvedCommunityCredits;
  else remainingCredits = 0;

  // remove this variable and usage when community events ready to be released
  const COMMUNITY_EVENTS = false;

  let headerString;
  if (userRole !== 'lead')
    headerString = `Check your team event credit status for this semester here!  
    Every DTI member must complete ${REQUIRED_MEMBER_TEC_CREDITS} team event credits 
    ${COMMUNITY_EVENTS ? `and ${REQUIRED_COMMUNITY_CREDITS} community team event credits` : ''} 
    to fulfill this requirement.`;
  else
    headerString = `Since you are a lead, you must complete ${REQUIRED_LEAD_TEC_CREDITS} total team event credits
    ${
      COMMUNITY_EVENTS
        ? `, with ${REQUIRED_COMMUNITY_CREDITS} of them being community event credits`
        : ''
    }.`;

  return (
    <div>
      <Form>
        <div className={styles.header}></div>
        <h1>Check Team Event Credits</h1>
        <p>{headerString}</p>

        <div className={styles.inline}>
          <label className={styles.bold}>
            Your Approved Credits: <span className={styles.dark_grey_color}>{approvedCredits}</span>
          </label>
        </div>

        {COMMUNITY_EVENTS && (
          <div className={styles.inline}>
            <label className={styles.bold}>
              Your Approved Community Credits:{' '}
              <span className={styles.dark_grey_color}>{approvedCommunityCredits}</span>
            </label>
          </div>
        )}

        <div className={styles.inline}>
          <label className={styles.bold}>
            Remaining Credits Needed:{' '}
            <span className={styles.dark_grey_color}>{remainingCredits}</span>
          </label>
        </div>

        <div className={styles.inline}>
          <label className={styles.bold}>Approved Events:</label>
          {approvedTEC.length !== 0 ? (
            <Card.Group>
              {approvedTEC.map((teamEvent, i) => (
                <Card key={i}>
                  <Card.Content>
                    <Card.Header>{teamEvent.name} </Card.Header>
                    <Card.Meta>{teamEvent.date}</Card.Meta>
                    <Card.Meta>{`Number of Credits: ${calculateNumCredits(teamEvent)}`}</Card.Meta>
                    {COMMUNITY_EVENTS && (
                      <Card.Meta>Community Event: {teamEvent.isCommunity ? 'Yes' : 'No'}</Card.Meta>
                    )}
                  </Card.Content>
                </Card>
              ))}
            </Card.Group>
          ) : (
            <Message>You have not been approved for any team events yet.</Message>
          )}
        </div>

        <div className={styles.inline}>
          <label className={styles.bold}>Pending Approval For:</label>
          {pendingTEC.length !== 0 ? (
            <Card.Group>
              {pendingTEC.map((teamEvent, i) => (
                <Card key={i}>
                  <Card.Content>
                    <Card.Header>{teamEvent.name} </Card.Header>
                    <Card.Meta>{teamEvent.date}</Card.Meta>
                    <Card.Meta>{`Number of Credits: ${calculateNumCredits(teamEvent)}`}</Card.Meta>
                  </Card.Content>
                </Card>
              ))}
            </Card.Group>
          ) : (
            <Message>You are not currently pending approval for any team events.</Message>
          )}
        </div>
      </Form>
    </div>
  );
};

export default TeamEventCreditDashboard;
