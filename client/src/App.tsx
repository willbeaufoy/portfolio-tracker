import './App.css';
import React, {useEffect, useState} from 'react';
import {Auth} from 'aws-amplify';
import HoldingsList from './holdings/HoldingsList';
import UserInfo from './UserInfo';
import {User} from './api';
import {withAuthenticator} from '@aws-amplify/ui-react';

const App = () => {
  const [isUserLoaded, setIsUserLoaded] = useState(false);
  const [user, setUser] = useState<User>({
    username: '',
    email: '',
    currency: '',
  });

  useEffect(() => {
    Auth.currentUserInfo().then((cognitoUser) => {
      setUser({
        username: cognitoUser.username,
        email: cognitoUser.attributes.email,
        currency: 'GBP', // Only support GBP for now.
      });
      setIsUserLoaded(true);
    });
  }, []);

  if (!isUserLoaded) {
    return <div className='loading'>Loading...</div>;
  } else {
    return (
      <div className='App'>
        <header className='App-header'>
          <div></div>
          <h1 className='App-Title'>Portfolio Tracker</h1>
          <UserInfo user={user}></UserInfo>
        </header>
        <div className='App-Content'>
          <HoldingsList user={user}></HoldingsList>
        </div>
      </div>
    );
  }
};

export default withAuthenticator(App);
