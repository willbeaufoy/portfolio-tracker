import {Holding} from './api';
import {User} from './App';

export const HOLDING_1: Holding = {
  id: 1,
  username: 'xzy',
  name: 'Amazon',
  symbol: 'AMZN',
  currency: 'USD',
  exchange: 'NASDAQ',
  price: 0,
  trades: [],
};

export const HOLDING_2: Holding = {
  id: 2,
  username: 'xzy',
  name: 'Boohoo',
  symbol: 'BOO.XLON',
  currency: 'GBP',
  exchange: 'LSE',
  price: 0,
  trades: [],
};

export const HOLDING_WITH_TRADES: Holding = {
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
      quantity: 5,
      unitPrice: 2800,
      fee: 0.1,
      tax: 0.5,
      fxRate: 0,
      fxFee: 0,
    },
    {
      id: 12,
      holding: 1,
      date: '2020-09-08',
      broker: 'Freetrade',
      quantity: 3,
      unitPrice: 2900,
      fee: 0.1,
      tax: 0.5,
      fxRate: 1.2,
      fxFee: 0.45,
    },
  ],
};

export const USER: User = {
  username: 'xyz',
  attributes: {email: 'hello@site.com'},
};
