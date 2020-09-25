import React, {useEffect, useState} from 'react';
import './App.css';
import HoldingForm from './AddHolding';
import Holdings from './Holdings';
import UserInfo from './UserInfo';
import {Auth} from 'aws-amplify';
import {withAuthenticator} from '@aws-amplify/ui-react';
import {API, graphqlOperation} from 'aws-amplify';
import {listHoldings} from './graphql/queries';

type UserData = {
  username: string;
  attributes: {email: string};
};

export type HoldingData = {
  id: string;
  username: string;
  name: string;
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
    });

    (API.graphql(graphqlOperation(listHoldings)) as Promise<any>).then(
      (holdings) => {
        setHoldings(holdings.data.listHoldings.items);
        setIsDataLoaded(true);
      },
    );
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
