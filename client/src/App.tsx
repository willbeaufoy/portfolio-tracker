import './App.css';

import {Auth} from 'aws-amplify';
import {ConfirmProvider} from 'material-ui-confirm';
import React, {useEffect, useState} from 'react';

import {withAuthenticator} from '@aws-amplify/ui-react';

import {API} from './api';
import {HoldingsList} from './holdings/HoldingsList';
import {USER_CURRENCY} from './settings';
import {FxRates, User} from './types';
import {UserInfo} from './UserInfo';

function App() {
  const [isDataLoaded, setisDataLoaded] = useState(false);
  const [user, setUser] = useState<User>({
    username: '',
    email: '',
    currency: '',
  });
  const [fxRates, setFxRates] = useState<FxRates>({CAD: 1, USD: 1});

  useEffect(() => {
    Auth.currentUserInfo().then((cognitoUser) => {
      setUser({
        username: cognitoUser.username,
        email: cognitoUser.attributes.email,
        currency: USER_CURRENCY,
      });
      API.listFxRates(USER_CURRENCY).then((fxRates) => {
        setFxRates(fxRates.rates);
        setisDataLoaded(true);
      });
    });
  }, []);

  if (!isDataLoaded) {
    return <div className='loading'>Loading...</div>;
  } else {
    return (
      <ConfirmProvider>
        <div className='App'>
          <header className='App-header'>
            <div></div>
            <h1 className='App-Title'>Portfolio Tracker</h1>
            <UserInfo user={user}></UserInfo>
          </header>
          <div className='App-Content'>
            <HoldingsList user={user} fxRates={fxRates}></HoldingsList>
          </div>
        </div>
      </ConfirmProvider>
    );
  }
}

export default withAuthenticator(App);
