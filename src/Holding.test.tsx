import React from 'react';
import {render} from '@testing-library/react';
import Holding from './Holding';

test('displays a holding', () => {
  const data = {
    id: 'abc',
    username: 'xzy',
    name: 'Amazon',
    symbol: 'AMZN',
    price: 3000,
  };

  const {getByText} = render(<Holding data={data} />);

  expect(getByText('AMZN')).toBeInTheDocument();
  expect(getByText('3000')).toBeInTheDocument();
});
