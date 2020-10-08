import React, {useEffect, useState} from 'react';
import {Auth} from 'aws-amplify';
import {withAuthenticator} from '@aws-amplify/ui-react';
import './App.css';
import HoldingForm from './holdings/AddHolding';
import Holdings from './holdings/Holdings';
import UserInfo from './UserInfo';
import {applyPrices, listHoldings} from './api_utils';

type UserData = {
  username: string;
  attributes: {email: string};
};

export type HoldingData = {
  id: string;
  username: string;
  symbol: string;
  price: number;
  trades: TradeData[];
};

type TradeData = {
  id: string;
  holding: 0;
  date: string;
  price: number;
  fee: number;
};

const App = () => {
  const [isUserLoaded, setIsUserLoaded] = useState(false);
  const [userInfo, setUserInfo] = useState<UserData>({
    username: '',
    attributes: {email: ''},
  });
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [holdings, setHoldings] = useState<HoldingData[]>([]);

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
          <Holdings holdings={holdings}></Holdings>
          <HoldingForm username={userInfo.username}></HoldingForm>
        </div>
      </div>
    );
  }
};

export default withAuthenticator(App);
