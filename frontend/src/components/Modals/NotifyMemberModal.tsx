import React, { useState } from 'react';
import { Modal, Form } from 'semantic-ui-react';
import styles from './NotifyMemberModal.module.css';
import { Member, MembersAPI } from '../../API/MembersAPI';
import { Emitters } from '../../utils';

const NotifyMemberModal = (props: {
  all: boolean;
  member?: Member;
  members?: Member[];
  trigger: JSX.Element;
}): JSX.Element => {
  const { member, members, all, trigger } = props;
  const [open, setOpen] = useState(false);
  const subject = !all && member ? `${member.firstName} ${member.lastName}` : 'everyone';

  const handleSubmit = () => {
    if (!all && member) {
      MembersAPI.notifyMember(member).then((val) => {
        Emitters.generalSuccess.emit({
          headerMsg: 'Reminder sent!',
          contentMsg: `An email reminder was successfully sent to ${member.firstName} ${member.lastName}!`
        });
      });
    }

    if (all && members) {
      members.map((member) => {
        MembersAPI.notifyMember(member);
      });
      Emitters.generalSuccess.emit({
        headerMsg: 'Reminder sent!',
        contentMsg: `An email reminder was successfully sent to everyone!`
      });
    }

    setOpen(false);
  };

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={trigger}
    >
      <Modal.Header> Are you sure you want to notify {subject}?</Modal.Header>
      <Modal.Content>
        This will send an email to {subject} reminding them that they do not have enough TEC Credits
        completed yet this semester.
        <Form>
          <div className={styles.buttonsWrapper}>
            <Form.Button onClick={() => setOpen(false)}>Cancel</Form.Button>
            <Form.Button
              content="Yes"
              labelPosition="right"
              icon="checkmark"
              onClick={() => {
                handleSubmit();
              }}
              positive
            />
          </div>
        </Form>
      </Modal.Content>
    </Modal>
  );
};
export default NotifyMemberModal;
