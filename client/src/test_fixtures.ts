import {Holding, User} from './api';

export const HOLDING_1: Holding = {
  id: 1,
  username: 'xzy',
  name: 'Amazon',
  symbol: 'AMZN',
  exchange: 'NASDAQ',
  bidPrice: 3000,
  bidPriceUpdateTime: '2020-11-07 12:45:50.93222',
  isin: 'US0231351067',
  currency: 'USD',
  trades: [
    {
      id: 11,
      holding: 1,
      date: '2018-03-04',
      broker: 'Freetrade',
      priceCurrency: 'USD',
      paymentCurrency: 'GBP',
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
      priceCurrency: 'USD',
      paymentCurrency: 'GBP',
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
  symbol: 'BOO',
  currency: 'GBX',
  exchange: 'LSE',
  bidPrice: 398,
  bidPriceUpdateTime: '2020-11-07 10:24:50.487137',
  isin: 'JE00BG6L7297',
  trades: [
    {
      id: 5,
      holding: 2,
      date: '2019-03-04',
      broker: 'Trading 212',
      priceCurrency: 'GBX',
      paymentCurrency: 'GBP',
      quantity: 50,
      unitPrice: 432,
      fee: 0.1,
      tax: 0.5,
      fxRate: 100,
      fxFee: 0,
    },
  ],
  splits: [],
};

export const USER: User = {
  username: 'xyz',
  email: 'hello@site.com',
  currency: 'GBP',
};
