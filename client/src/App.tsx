import './App.css';

import {Auth} from 'aws-amplify';
import {ConfirmProvider} from 'material-ui-confirm';
import React, {useEffect, useState} from 'react';

import {withAuthenticator} from '@aws-amplify/ui-react';
import CircularProgress from '@material-ui/core/CircularProgress';
import {Snackbar} from '@material-ui/core';
import MuiAlert, {AlertProps} from '@material-ui/lab/Alert';

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
  const [fxRates, setFxRates] = useState<FxRates>({CAD: 1, EUR: 1, USD: 1});
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [alertColor, setAlertColor] = useState();

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

  /** Opens the snackbar with the provided message */

  function showNotification(message: any, severity: any) {
    setIsSnackbarOpen(true);
    setSnackbarMessage(message);
    setAlertColor(severity);
  }

  function handleCloseSnackbar(event: any, reason: any) {
    if (reason === 'clickaway') return;
    setIsSnackbarOpen(false);
    setSnackbarMessage('');
  }

  function Alert(props: AlertProps) {
    return (
      <MuiAlert
        elevation={6}
        variant='filled'
        severity={alertColor}
        {...props}
      />
    );
  }
  if (!isDataLoaded) {
    return (
      <div className='loading'>
        <CircularProgress />
      </div>
    );
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
            <HoldingsList
              user={user}
              fxRates={fxRates}
              showNotification={showNotification}></HoldingsList>
          </div>
          <Snackbar
            onClose={handleCloseSnackbar}
            open={isSnackbarOpen}
            autoHideDuration={3000}>
            <Alert>{snackbarMessage}</Alert>
          </Snackbar>
        </div>
      </ConfirmProvider>
    );
  }
}
export default withAuthenticator(App);
