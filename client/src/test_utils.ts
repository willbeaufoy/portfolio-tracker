export const HOLDING_1 = {
  id: 1,
  username: 'xzy',
  name: 'Amazon',
  symbol: 'AMZN',
  price: 3000,
  trades: [],
};

export const HOLDING_2 = {
  id: 2,
  username: 'xzy',
  name: 'Tesla',
  symbol: 'TSLA',
  price: 400,
  trades: [],
};

export const HOLDING_WITH_TRADES = {
  id: 1,
  username: 'xzy',
  name: 'Amazon',
  symbol: 'AMZN',
  price: 3000,
  trades: [
    {
      id: 1,
      holding: 1,
      date: '2018-03-04',
      quantity: 5,
      unitPrice: 3,
      fee: 0.1,
      fxRate: 0,
      fxFee: 0,
    },
    {
      id: 2,
      holding: 1,
      date: '2020-09-08',
      quantity: 3,
      unitPrice: 2,
      fee: 0.1,
      fxRate: 0,
      fxFee: 0,
    },
  ],
};
