import React, { useContext, useEffect } from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import SignIn from './SignIn/SignIn.lazy';
import Homepage from './Homepage/Homepage.lazy';
import { UserContext } from './UserProvider/UserProvider';
import SiteHeader from './SiteHeader/SiteHeader';
import { Sidebar, Menu, Icon } from 'semantic-ui-react';
import { Emitters } from './EventEmitter/constant-emitters';
import EmailNotFoundErrorModal from './Modals/EmailNotFoundError/EmailNotFoundErrorModal';
import UserBase from './User/UserBase/UserBase';
import './App.css';

function App() {
  const user = useContext(UserContext);
  const [visible, setVisible] = React.useState(false);
  useEffect(() => {
    let cb = (isOpen: boolean) => {
      setVisible(isOpen);
    };
    Emitters.navOpenEmitter.subscribe(cb);
    return () => {
      Emitters.navOpenEmitter.unsubscribe(cb);
    };
  });
  return (
    user.user ?
      (
        <Router>
          <div className="App" style={{
            minHeight: '100vh',
            maxHeight: '100vh',
            minWidth: '100vw',
            position: 'relative'
          }}>
            <SiteHeader />
            <div style={{ position: 'relative', top: '10vh' }}>
              <Sidebar
                as={Menu}
                animation='overlay'
                icon='labeled'
                inverted
                onHide={() => setVisible(false)}
                vertical
                visible={visible}
                width='thin'
                onClick={() => { Emitters.navOpenEmitter.emit(false) }}
                className="appSidebar"
              >
                <Link to="/">
                  <Menu.Item>
                    <Icon name='home' />
              Home
            </Menu.Item>
                </Link>
                <Link to="/users">
                  <Menu.Item>
                    <Icon name='group' />
              Users
            </Menu.Item>
                </Link>
              </Sidebar>
            </div>
            <div style={{ position: 'absolute', top: '10vh' }}>
              <Sidebar.Pushable>
                <Sidebar.Pusher dimmed={visible}>
                  <div style={{
                    minHeight: '90vh', width: '100vw', margin: 0, padding: 0
                  }}>
                    <Switch>
                      <Route path="/users*">
                        <UserBase />
                      </Route>
                      <Route path="/*">
                        <Homepage />
                      </Route>
                    </Switch>
                  </div>
                </Sidebar.Pusher>
              </Sidebar.Pushable>
            </div>
          </div>
        </Router >)
      :
      (<div className="App">
        <EmailNotFoundErrorModal />
        <Router>
          <Switch>
            <Route path="/*">
              <SignIn />
            </Route>
          </Switch>
        </Router>
      </div>)
  );
}

export default App;
