import React, { useState, useEffect, useCallback } from 'react';
import { Button, Form, Item, Card, Modal } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Emitters } from '../../../utils';
import { ShoutoutsAPI, Shoutout } from '../../../API/ShoutoutsAPI';
import styles from './AdminShoutouts.module.css';

const AdminShoutouts: React.FC = () => {
  const [displayShoutouts, setDisplayShoutouts] = useState<Shoutout[]>([]);
  const [earlyDate, setEarlyDate] = useState<Date>(new Date(Date.now() - 12096e5));
  const [lastDate, setLastDate] = useState<Date>(new Date());
  const [hide, setHide] = useState(false);

  const updateShoutouts = useCallback(() => {
    ShoutoutsAPI.getAllShoutouts().then((shoutouts) => {
      if (lastDate < earlyDate) {
        Emitters.generalError.emit({
          headerMsg: 'Invalid Date Range',
          contentMsg:
            'Please make sure the latest shoutout date is after the earliest shoutout date.'
        });
      } else {
        setDisplayShoutouts(
          shoutouts.filter((shoutout) => {
            const shoutoutDate = new Date(shoutout.timestamp);
            return !shoutout.hidden && shoutoutDate >= earlyDate && shoutoutDate <= lastDate;
          })
        );
        setHide(false);
      }
    });
  }, [earlyDate, lastDate, setHide]);

  useEffect(() => {
    updateShoutouts();
  }, [earlyDate, lastDate, hide, updateShoutouts]);

  const fromString = (shoutout: Shoutout): string => {
    if (!shoutout.isAnon) {
      const { giver } = shoutout;
      return `From: ${giver?.firstName} ${giver?.lastName}`;
    }
    return `From: Anonymous`;
  };
  const dateString = (shoutout: Shoutout): string =>
    `${new Date(shoutout.timestamp).toDateString()}`;

  const ChooseDate = (props: {
    dateField: Date;
    dateFunction: (value: React.SetStateAction<Date>) => void;
  }): JSX.Element => {
    const { dateField, dateFunction } = props;
    return (
      <DatePicker
        selected={dateField}
        dateFormat="MMMM do yyyy"
        onChange={(date: Date) => dateFunction(date)}
      />
    );
  };

  const onHide = (shoutout: Shoutout) => {
    if (!shoutout.hidden) {
      setHide(true);
      ShoutoutsAPI.hideShoutout(shoutout.uuid).then(() => {
        Emitters.generalSuccess.emit({
          headerMsg: 'Shoutout Hidden',
          contentMsg: 'This shoutout was successfully hidden.'
        });
        setDisplayShoutouts((shoutouts) =>
          shoutouts.map((val) => {
            if (val.uuid === shoutout.uuid) return { ...val, hidden: true };
            return val;
          })
        );
      });
    }
  };

  return (
    <div>
      <Form className={styles.shoutoutForm}>
        <h2 className={styles.formTitle}>Select date range to display shoutouts:</h2>
        <Form.Group width="equals">
          <ChooseDate dateField={earlyDate} dateFunction={setEarlyDate} />
          <ChooseDate dateField={lastDate} dateFunction={setLastDate} />
        </Form.Group>
      </Form>

      <div className={styles.shoutoutsListContainer}>
        <h2 className={styles.formTitle}>Shoutouts List! 📣</h2>
        {displayShoutouts.length === 0 ? (
          <Card className={styles.noShoutoutsContainer}>
            <Card.Content>No shoutouts in this date range.</Card.Content>
          </Card>
        ) : (
          <Item.Group divided>
            {displayShoutouts
              .sort((a, b) => a.timestamp - b.timestamp)
              .map((shoutout, i) => (
                <Item key={i}>
                  <Item.Content>
                    <Item.Group widths="equal" className={styles.shoutoutDetails}>
                      <Item.Header
                        className={styles.shoutoutTo}
                      >{`${shoutout.receiver}`}</Item.Header>
                      <Item.Meta className={styles.shoutoutDate} content={dateString(shoutout)} />
                    </Item.Group>
                    <Item.Group widths="equal" className={styles.shoutoutHide}>
                      <Item.Meta className={styles.shoutoutFrom} content={fromString(shoutout)} />
                      <Modal
                        trigger={<Button icon="eye" size="tiny" />}
                        header="Hide Shoutout"
                        content="Are you sure that you want to hide this shoutout?"
                        actions={[
                          'Cancel',
                          {
                            key: 'hideShoutouts',
                            content: 'Hide Shoutout',
                            color: 'red',
                            onClick: () => onHide(shoutout)
                          }
                        ]}
                      />
                    </Item.Group>
                    <Item.Description
                      className={styles.shoutoutMessage}
                      content={shoutout.message}
                    />
                  </Item.Content>
                </Item>
              ))}
          </Item.Group>
        )}
      </div>
    </div>
  );
};

export default AdminShoutouts;
