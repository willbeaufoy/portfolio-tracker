import {Holding} from './api';
import {User} from './App';

export const HOLDING_1: Holding = {
  id: 1,
  username: 'xzy',
  name: 'Amazon',
  symbol: 'AMZN',
  exchange: 'NASDAQ',
  price: 3000,
  currency: 'USD',
  trades: [
    {
      id: 11,
      holding: 1,
      date: '2018-03-04',
      broker: 'Freetrade',
      currency: 'USD',
      quantity: 5,
      unitPrice: 2100,
      fee: 0.1,
      tax: 0.5,
      fxRate: 1.22,
      fxFee: 0,
    },
    {
      id: 12,
      holding: 1,
      date: '2020-09-08',
      broker: 'Freetrade',
      currency: 'USD',
      quantity: 3,
      unitPrice: 2900,
      fee: 0.1,
      tax: 0.5,
      fxRate: 1.31,
      fxFee: 0.45,
    },
  ],
  splits: [
    {ratio: 3, date: '2019-01-02'},
    {ratio: 0.2, date: '2018-03-04'},
  ],
};

export const HOLDING_2: Holding = {
  id: 2,
  username: 'xzy',
  name: 'Boohoo',
  symbol: 'BOO.XLON',
  currency: 'GBP',
  exchange: 'LSE',
  price: 398,
  trades: [
    {
      id: 5,
      holding: 2,
      date: '2019-03-04',
      broker: 'Trading 212',
      currency: 'GBP',
      quantity: 6,
      unitPrice: 432,
      fee: 0.1,
      tax: 0.5,
      fxRate: 0,
      fxFee: 0,
    },
  ],
  splits: [],
};

export const USER: User = {
  username: 'xyz',
  attributes: {email: 'hello@site.com'},
};
