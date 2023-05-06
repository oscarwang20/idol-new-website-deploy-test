import React, { useEffect, useState } from 'react';
import { Modal, Button, Header, Image } from 'semantic-ui-react';
import ImagesAPI from '../../../API/ImagesAPI';
import { TeamEventsAPI } from '../../../API/TeamEventsAPI';
import { Emitters } from '../../../utils';

const TeamEventCreditReview = (props: {
  teamEvent: TeamEvent;
  teamEventAttendance: TeamEventAttendance;
}): JSX.Element => {
  const { teamEvent, teamEventAttendance } = props;
  const [image, setImage] = useState('');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    ImagesAPI.getEventProofImage(teamEventAttendance.image).then((url: string) => {
      setImage(url);
    });
  }, [teamEventAttendance]);

  const approveCreditRequest = (teamEventAttendance: TeamEventAttendance) => {
    const updatedTeamEventAttendance = {
      ...teamEventAttendance,
      pending: false
    };
    TeamEventsAPI.updateTeamEventAttendance(updatedTeamEventAttendance)
      .then(() => {
        Emitters.generalSuccess.emit({
          headerMsg: 'Team Event Attendance Approved!',
          contentMsg: 'The team event attendance was successfully approved!'
        });
        Emitters.teamEventsUpdated.emit();
      })
      .catch((error) => {
        Emitters.generalError.emit({
          headerMsg: "Couldn't approve the team event attendance!",
          contentMsg: error
        });
      });
  };

  const rejectCreditRequest = () => {
    TeamEventsAPI.deleteTeamEventAttendance(teamEventAttendance.uuid)
      .then(() => {
        Emitters.generalSuccess.emit({
          headerMsg: 'Team Event Attendance Rejected!',
          contentMsg: 'The team event attendance was successfully rejected!'
        });
        ImagesAPI.deleteEventProofImage(teamEventAttendance.image);
        Emitters.teamEventsUpdated.emit();
      })
      .catch((error) => {
        Emitters.generalError.emit({
          headerMsg: "Couldn't reject the team event attendance!",
          contentMsg: error
        });
      });
  };

  return (
    <Modal
      closeIcon
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={<Button>Review request</Button>}
    >
      <Modal.Header>Team Event Credit Review</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <Header>
            {teamEventAttendance.member.firstName} {teamEventAttendance.member.lastName}
          </Header>
          <p>Team Event: {teamEvent.name}</p>
          <p>Number of Credits: {teamEvent.numCredits}</p>
          {teamEvent.hasHours && <p> Hours Attended: {teamEventAttendance.hoursAttended}</p>}
          <Image src={image} />
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button
          basic
          color="green"
          onClick={() => {
            approveCreditRequest(teamEventAttendance);
            setOpen(false);
          }}
        >
          Approve
        </Button>
        <Button
          basic
          color="red"
          onClick={() => {
            rejectCreditRequest();
            setOpen(false);
          }}
        >
          Reject
        </Button>
      </Modal.Actions>
    </Modal>
  );
};
export default TeamEventCreditReview;
