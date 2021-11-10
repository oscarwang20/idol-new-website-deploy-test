import React, { useState } from 'react';
import { Form, TextArea, Segment, Label, Button, Checkbox } from 'semantic-ui-react';
import { useUserEmail } from '../../Common/UserProvider';
import CustomSearch, { memberMatchChecker } from '../../Common/Search';
import { Emitters } from '../../../utils';
import { Member } from '../../../API/MembersAPI';
import { Shoutout, ShoutoutsAPI } from '../../../API/ShoutoutsAPI';
import { useMembers } from '../../Common/FirestoreDataProvider';

const ShoutoutForm: React.FC = () => {
  const userEmail = useUserEmail();
  const members = useMembers();
  const user = members.find((it) => it.email === userEmail);
  const [recipient, setRecipient] = useState<IdolMember | undefined>(undefined);
  const [message, setMessage] = useState('');
  const [isAnon, setIsAnon] = useState(false);

  const giveShoutout = () => {
    if (!recipient) {
      Emitters.generalError.emit({
        headerMsg: 'No Member Selected',
        contentMsg: 'Please select a member!'
      });
    } else if (recipient.email === userEmail) {
      Emitters.generalError.emit({
        headerMsg: 'No Self Shoutouts',
        contentMsg: "You can't give yourself a shoutout, please select a different member!"
      });
    } else if (user && recipient && message !== '') {
      const shoutout: Shoutout = {
        giver: user,
        receiver: recipient,
        message,
        isAnon
      };
      ShoutoutsAPI.giveShoutout(shoutout).then((val) => {
        if (val.error) {
          Emitters.generalError.emit({
            headerMsg: "Couldn't send shoutout!",
            contentMsg: val.error
          });
        } else {
          Emitters.generalSuccess.emit({
            headerMsg: 'Shoutout submitted!',
            contentMsg: `Thank you for recognizing ${recipient.firstName}'s awesomeness! 🙏`
          });
          setRecipient(undefined);
          setMessage('');
        }
      });
    }
  };

  return (
    <Form
      style={{
        width: '100%',
        alignSelf: 'center',
        margin: 'auto'
      }}
    >
      <h2 style={{ marginBottom: '2vh' }}>Give someone a shoutout! 📣</h2>
      <label style={{ fontWeight: 'bold' }}>
        Who is awesome? <span style={{ color: '#db2828' }}>*</span>
      </label>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        {!recipient ? (
          <CustomSearch
            source={members}
            resultRenderer={(mem) => (
              <Segment>
                <h4>{`${mem.firstName} ${mem.lastName}`}</h4>
                <Label>{mem.email}</Label>
              </Segment>
            )}
            matchChecker={memberMatchChecker}
            selectCallback={(mem: Member) => {
              setRecipient(mem);
            }}
          ></CustomSearch>
        ) : undefined}

        {recipient ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'baseline'
            }}
          >
            <p style={{ paddingRight: '1.5em' }}>
              {recipient?.firstName} {recipient?.lastName}
            </p>
            <Button
              negative
              onClick={() => {
                setRecipient(undefined);
              }}
            >
              Clear
            </Button>
          </div>
        ) : undefined}

        <Checkbox
          label={{ children: 'Anonymous?' }}
          style={{ paddingLeft: '2em' }}
          onChange={() => setIsAnon(!isAnon)}
        />
      </div>

      <div style={{ padding: '0.8em 0' }}>
        <Form.Input
          label="Why are they awesome?"
          name="message"
          value={message}
          control={TextArea}
          onChange={(event) => setMessage(event.target.value)}
          style={{ minHeight: '25vh' }}
          required
        />
      </div>

      <Form.Button floated="right" onClick={giveShoutout}>
        Send
      </Form.Button>
    </Form>
  );
};

export default ShoutoutForm;
