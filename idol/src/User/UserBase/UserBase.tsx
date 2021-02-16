import React from 'react';
import styles from './UserBase.module.css';
import { Route, Switch, BrowserRouter as Router, Link, useLocation } from 'react-router-dom';
import { Card, Button } from 'semantic-ui-react';
import AddUser from '../AddUser/AddUser';
import EditTeam from '../EditTeam/EditTeam';
import UserProfile from '../UserProfile/UserProfile';
import UserProfileImage from '../UserProfile/UserProfileImage/UserProfileImage';

const UserBase: React.FC = () => {
  let location = useLocation();
  if (location.pathname === '/users') {
    return (
      <div className={styles.UserBase} data-testid="UserBase">
        <div className={styles.content}>
          <Card.Group>
            <Card>
              <Card.Content>
                <Card.Header>Edit Users</Card.Header>
                <Card.Description>
                  Create, read, edit, or delete individual users of the system.
              </Card.Description>
              </Card.Content>
              <Card.Content extra>
                <div className='ui one buttons'>
                  <Link to='users/edit'>
                    <Button basic color='blue'>
                      Go To
          </Button>
                  </Link>
                </div>
              </Card.Content>
            </Card>
            <Card>
              <Card.Content>
                <Card.Header>Edit Teams</Card.Header>
                <Card.Description>
                  Create, read, edit, or delete teams in the system.
              </Card.Description>
              </Card.Content>
              <Card.Content extra>
                <div className='ui one buttons'>
                  <Link to='users/teams/edit'>
                    <Button basic color='blue'>
                      Go To
          </Button>
                  </Link>
                </div>
              </Card.Content>
            </Card>
            <Card>
              <Card.Content>
                <Card.Header>Edit Profile</Card.Header>
                <Card.Description>
                  Edit your profile information on DTI's website.
              </Card.Description>
              </Card.Content>
              <Card.Content extra>
                <div className='ui one buttons'>
                  <Link to='users/profile'>
                    <Button basic color='blue'>
                      Go To
          </Button>
                  </Link>
                </div>
              </Card.Content>
            </Card>
            <Card>
              <Card.Content>
                <Card.Header>Edit Profile Image</Card.Header>
                <Card.Description>
                  Edit your profile image.
              </Card.Description>
              </Card.Content>
              <Card.Content extra>
                <div className='ui one buttons'>
                  <Link to='users/profileImage'>
                    <Button basic color='blue'>
                      Go To
          </Button>
                  </Link>
                </div>
              </Card.Content>
            </Card>
          </Card.Group>
        </div>
      </div>
    );
  } else {
    return (
      <div className={styles.UserBase} data-testid="UserBase">
        <Router>
          <Switch>
            <Route path="/users/edit">
              <AddUser></AddUser>
            </Route>
            <Route path="/users/teams/edit">
              <EditTeam></EditTeam>
            </Route>
            <Route path="/users/profile">
              <UserProfile></UserProfile>
            </Route>
            <Route path="/users/profileImage">
              <UserProfileImage></UserProfileImage>
            </Route>
            <Route path="/*">
            </Route>
          </Switch>
        </Router>
      </div>
    )
  }
};

export default UserBase;