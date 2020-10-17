import './App.css';
import React, {useEffect, useState} from 'react';
import {Auth} from 'aws-amplify';
import HoldingsList from './holdings/HoldingsList';
import UserInfo from './UserInfo';
import {withAuthenticator} from '@aws-amplify/ui-react';

export interface User {
  username: string;
  attributes: {email: string};
}

const App = () => {
  const [isUserLoaded, setIsUserLoaded] = useState(false);
  const [user, setUser] = useState<User>({
    username: '',
    attributes: {email: ''},
  });

  useEffect(() => {
    Auth.currentUserInfo().then((user) => {
      setUser(user);
      setIsUserLoaded(true);
    });
  }, []);

  if (!isUserLoaded) {
    return <div className="loading">Loading...</div>;
  } else {
    return (
      <div className="App">
        <header className="App-header">
          <div></div>
          <h1 className="App-Title">Portfolio Tracker</h1>
          <UserInfo attrs={user.attributes}></UserInfo>
        </header>
        <div className="App-Content">
          <HoldingsList user={user}></HoldingsList>
        </div>
      </div>
    );
  }
};

export default withAuthenticator(App);
