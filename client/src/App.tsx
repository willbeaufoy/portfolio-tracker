import './App.css';
import HoldingsList, {Holding} from './holdings/HoldingsList';
import React, {useEffect, useState} from 'react';
import {applyPrices, listHoldings} from './api_utils';
import {Auth} from 'aws-amplify';
import HoldingForm from './holdings/AddHolding';
import UserInfo from './UserInfo';
import {withAuthenticator} from '@aws-amplify/ui-react';

interface UserData {
  username: string;
  attributes: {email: string};
}

const App = () => {
  const [isUserLoaded, setIsUserLoaded] = useState(false);
  const [userInfo, setUserInfo] = useState<UserData>({
    username: '',
    attributes: {email: ''},
  });
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [holdings, setHoldings] = useState<Holding[]>([]);

  useEffect(() => {
    Auth.currentUserInfo().then((userInfo) => {
      setUserInfo(userInfo);
      setIsUserLoaded(true);
      listHoldings(userInfo.username).then(async (holdings) => {
        if (holdings.length) {
          await applyPrices(holdings);
          setHoldings(holdings);
        }
        setIsDataLoaded(true);
      });
    });
  }, []);

  if (!isUserLoaded || !isDataLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <div className="App">
        <header className="App-header">
          <div></div>
          <h1 className="App-Title">Portfolio Tracker</h1>
          <UserInfo attrs={userInfo.attributes}></UserInfo>
        </header>
        <div className="App-Content">
          <HoldingsList holdings={holdings}></HoldingsList>
          <HoldingForm username={userInfo.username}></HoldingForm>
        </div>
      </div>
    );
  }
};

export default withAuthenticator(App);
