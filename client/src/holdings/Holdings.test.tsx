import React from 'react';
import {render} from '@testing-library/react';
import Holdings from './Holdings';

test('displays a list of holdings', () => {
  const holdings = [
    {
      id: 'a',
      username: 'xzy',
      name: 'Amazon',
      symbol: 'AMZN',
      price: 3000,
    },
    {
      id: 'b',
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
