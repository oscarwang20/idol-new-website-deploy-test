import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Button } from 'semantic-ui-react';
import styles from './NavigationCard.module.css';

export type NavigationCardItem = {
  readonly header: string;
  readonly description: string;
  readonly link: string;
};

type Props = { readonly testID?: string; readonly items: readonly NavigationCardItem[] };

export default function NavigationCard({ testID, items }: Props): JSX.Element {
  return (
    <div data-testid={testID}>
      <div className={styles.content}>
        <Card.Group>
          {items.map(({ header, description, link }) => (
            <Card key={link}>
              <Card.Content>
                <Card.Header>{header}</Card.Header>
                <Card.Description>{description}</Card.Description>
              </Card.Content>
              <Card.Content extra>
                <div className="ui one buttons">
                  <Link to={link}>
                    <Button basic color="blue">
                      Go To
                    </Button>
                  </Link>
                </div>
              </Card.Content>
            </Card>
          ))}
        </Card.Group>
      </div>
    </div>
  );
}