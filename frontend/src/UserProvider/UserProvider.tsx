import React, { Component, createContext } from "react";
import { auth } from "../firebase";
import { Emitters } from "../EventEmitter/constant-emitters";
import { LoginAPI } from "../API/LoginAPI";

type UserContextType = { user: firebase.User | null };

export const UserContext = createContext<UserContextType>({ user: null });
class UserProvider extends Component<any, UserContextType>  {

  constructor(props: any) {
    super(props);
    this.state = {
      user: auth.currentUser ? auth.currentUser : null
    };
  }

  componentDidMount = () => {
    auth.onAuthStateChanged(async userAuth => {
      if (userAuth) {
        LoginAPI.login(await userAuth.getIdToken()).then((loginResp) => {
          if (!loginResp.isLoggedIn) {
            Emitters.emailNotFoundError.emit();
            auth.signOut();
            return;
          }
          this.setState({ user: userAuth });
        });
      } else {
        LoginAPI.logout().then((logoutResp) => {
          if (!logoutResp.isLoggedIn) {
            this.setState({ user: userAuth });
          } else {
            alert("Couldn't log out!");
          }
        });
      }
    });
  };
  render() {
    return (
      <UserContext.Provider value={this.state}>
        {this.props.children}
      </UserContext.Provider>
    );
  }
}
export default UserProvider;