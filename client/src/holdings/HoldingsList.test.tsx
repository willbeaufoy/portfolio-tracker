import {fireEvent, render} from '@testing-library/react';
import HoldingsList from './HoldingsList';
import React from 'react';
import {HOLDING_1, HOLDING_2, HOLDING_WITH_TRADES} from '../test_utils';

test('displays a list of holdings', () => {
  const holdings = [HOLDING_1, HOLDING_2];

  const {getByText} = render(<HoldingsList holdings={holdings} />);

  expect(getByText('AMZN')).toBeInTheDocument();
  expect(getByText('TSLA')).toBeInTheDocument();
});

test(`displays a holding's trades on click`, () => {
  const trade1Date = '2018-03-04';
  const trade2Date = '2020-09-08';
  const holdings = [HOLDING_WITH_TRADES];

  const {queryByText, getByText} = render(<HoldingsList holdings={holdings} />);
  expect(queryByText(trade1Date)).toBeNull();
  expect(queryByText(trade2Date)).toBeNull();

  const holdingButton = getByText('AMZN');
  fireEvent.click(holdingButton);

  expect(getByText(trade1Date)).toBeInTheDocument();
  expect(getByText(trade2Date)).toBeInTheDocument();
});
