import React, {useEffect, useState} from 'react';
import {Auth} from 'aws-amplify';
import {withAuthenticator} from '@aws-amplify/ui-react';
import {API, graphqlOperation} from 'aws-amplify';
import {listHoldings} from './graphql/queries';
import './App.css';
import HoldingForm from './AddHolding';
import Holdings from './Holdings';
import UserInfo from './UserInfo';

type UserData = {
  username: string;
  attributes: {email: string};
};

export type HoldingData = {
  id: string;
  username: string;
  symbol: string;
  price: number;
};

export const API_BASE =
  'https://api.marketstack.com/v1/eod/latest/?access_key=234043173339712ba846306b3581836c&symbols=';

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
      async (res) => {
        const holdings = res.data.listHoldings.items;
        if (holdings.length) {
          await applyPrices(holdings);
          setHoldings(holdings);
        }
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

/**
 * Fetches the latest EOD prices for the given holdings from the API and
 * applies them to the holdings.
 */
async function applyPrices(holdings: HoldingData[]) {
  const symbols = holdings.map((h) => h.symbol).join();
  try {
    const res = await fetch(`${API_BASE}${symbols}`);
    const resJson = await res.json();
    for (const [i, stock] of resJson.data.entries()) {
      holdings[i].price = stock.close;
    }
  } catch (err) {
    console.log(err);
  }
}

export default withAuthenticator(App);
