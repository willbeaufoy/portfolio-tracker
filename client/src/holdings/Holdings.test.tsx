import {fireEvent, render} from '@testing-library/react';
import Holdings from './Holdings';
import React from 'react';

test('displays a list of holdings', () => {
  const holdings = [
    {
      id: 1,
      username: 'xzy',
      name: 'Amazon',
      symbol: 'AMZN',
      price: 3000,
    },
    {
      id: 2,
      username: 'xzy',
      name: 'Tesla',
      symbol: 'TSLA',
      price: 400,
    },
  ];

  const {getByText} = render(<Holdings holdings={holdings} />);

  expect(getByText('AMZN')).toBeInTheDocument();
  expect(getByText('TSLA')).toBeInTheDocument();
});

test(`displays a holding's trades on click`, () => {
  const tradeDate1 = '2018-03-04';
  const tradeDate2 = '2020-09-08';
  const holdings = [
    {
      id: 1,
      username: 'xzy',
      name: 'Amazon',
      symbol: 'AMZN',
      price: 3000,
      trades: [
        {holding: 1, date: tradeDate1, quantity: 5, price: 3, fee: 0.1},
        {holding: 1, date: tradeDate2, quantity: 3, price: 2, fee: 0.1},
      ],
    },
  ];
  const {queryByText, getByText} = render(<Holdings holdings={holdings} />);
  expect(queryByText(tradeDate1)).toBeNull();
  expect(queryByText(tradeDate2)).toBeNull();

  const holdingButton = getByText('AMZN');
  fireEvent.click(holdingButton);

  expect(getByText(tradeDate1)).toBeInTheDocument();
  expect(getByText(tradeDate2)).toBeInTheDocument();
});
