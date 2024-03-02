import React, { useEffect, useState } from 'react';
import { Card, Message, Modal, Button, Loader } from 'semantic-ui-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import EditTeamEvent from './EditTeamEvent';
import TeamEventCreditReview from './TeamEventCreditReview';
import styles from './TeamEventDetails.module.css';
import { TeamEventsAPI } from '../../../API/TeamEventsAPI';
import { Emitters } from '../../../utils';
import { INITIATIVE_EVENTS } from '../../../consts';

const defaultTeamEvent: TeamEvent = {
  name: '',
  date: '',
  numCredits: '',
  hasHours: false,
  requests: [],
  uuid: '',
  isInitiativeEvent: false
};

type AttendanceDisplayProps = {
  status: Status;
  teamEvent: TeamEvent;
};

const AttendanceDisplay: React.FC<AttendanceDisplayProps> = ({ status, teamEvent }) => {
  const newAttendance = teamEvent.requests.filter((res) => res.status === status);

  return (
    <>
      {newAttendance && newAttendance.length !== 0 ? (
        <Card.Group>
          {newAttendance.map((req, i) => (
            <Card className={styles.memberCard} key={i}>
              <Card.Content>
                <Card.Header>
                  {req.member.firstName} {req.member.lastName}
                </Card.Header>
                <Card.Meta>{req.member.email}</Card.Meta>
              </Card.Content>
              <Card.Content extra>
                <TeamEventCreditReview
                  teamEvent={teamEvent}
                  teamEventAttendance={req}
                  currentStatus={status}
                ></TeamEventCreditReview>
              </Card.Content>
            </Card>
          ))}
        </Card.Group>
      ) : (
        <Message>There are currently no {status} members for this event.</Message>
      )}
    </>
  );
};

const TeamEventDetails: React.FC = () => {
  const location = useRouter();
  const uuid = location.query.uuid as string;
  const [teamEvent, setTeamEvent] = useState<TeamEvent>(defaultTeamEvent);
  const [isLoading, setLoading] = useState(true);

  const fullReset = () => {
    setLoading(true);
    setTeamEvent(defaultTeamEvent);
  };

  useEffect(() => {
    const cb = () => {
      fullReset();
    };
    Emitters.teamEventsUpdated.subscribe(cb);
    return () => {
      Emitters.teamEventsUpdated.unsubscribe(cb);
    };
  });

  useEffect(() => {
    if (isLoading) {
      TeamEventsAPI.getTeamEventForm(uuid).then((teamEvent) => {
        setTeamEvent(teamEvent);
        setLoading(false);
      });
    }
  }, [isLoading, uuid]);

  const deleteTeamEvent = () => {
    TeamEventsAPI.deleteTeamEventForm(teamEvent).then(() => {
      Emitters.generalSuccess.emit({
        headerMsg: 'Team Event Deleted!',
        contentMsg: 'The team event was successfully deleted!'
      });
    });
    location.push('/admin/team-events');
  };

  if (isLoading) return <Loader active />;

  return (
    <div className={styles.container}>
      <div className={styles.arrowAndButtons}>
        <Link href="/admin/team-events">
          <span className={styles.arrow}>&#8592;</span>
        </Link>
        <div>
          <EditTeamEvent teamEvent={teamEvent}></EditTeamEvent>
          <Modal
            trigger={<Button color="red">Delete Event</Button>}
            header="Delete Team Event"
            content="Are you sure that you want to delete this event?"
            actions={[
              'Cancel',
              {
                key: 'deleteEvent',
                content: 'Delete Event',
                color: 'red',
                onClick: deleteTeamEvent
              }
            ]}
          />
        </div>
      </div>

      <h1 className={styles.eventName}>{teamEvent.name}</h1>
      <div className={styles.eventDetailsContainer}>
        <h3 className={styles.eventDetails}>Date: {teamEvent.date}</h3>
        <h3 className={styles.eventDetails}>Credits: {teamEvent.numCredits}</h3>
        <h3 className={styles.eventDetails}>Has Hours: {teamEvent.hasHours ? 'yes' : 'no'}</h3>
        {INITIATIVE_EVENTS && (
          <h3 className={styles.eventDetails}>
            Initiative Event: {teamEvent.isInitiativeEvent ? 'Yes' : 'No'}
          </h3>
        )}
      </div>

      <div className={styles.listsContainer}>
        <div className={styles.listContainer}>
          <h2 className={styles.memberTitle}>Members Pending</h2>
          <AttendanceDisplay status={'pending' as Status} teamEvent={teamEvent} />
        </div>

        <div className={styles.listContainer}>
          <h2 className={styles.memberTitle}>Members Approved</h2>
          <AttendanceDisplay status={'approved' as Status} teamEvent={teamEvent} />
          <h2 className={styles.memberTitle}>Members Rejected</h2>
          <AttendanceDisplay status={'rejected' as Status} teamEvent={teamEvent} />
        </div>
      </div>
    </div>
  );
};
export default TeamEventDetails;
