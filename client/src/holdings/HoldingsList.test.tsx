import * as apiUtils from '../api_utils';
import {HOLDING_1, HOLDING_2, HOLDING_WITH_TRADES} from '../test_utils';
import {fireEvent, render, waitFor} from '@testing-library/react';
import HoldingsList from './HoldingsList';
import React from 'react';
import {screen} from '@testing-library/dom';

test('displays a list of holdings', () => {
  const holdings = [HOLDING_1, HOLDING_2];

  render(<HoldingsList holdings={holdings} />);

  expect(screen.getByText('AMZN')).toBeInTheDocument();
  expect(screen.getByText('TSLA')).toBeInTheDocument();
});

test(`displays a holding's trades on click`, () => {
  const trade1Date = '2018-03-04';
  const trade2Date = '2020-09-08';
  const holdings = [HOLDING_WITH_TRADES];

  render(<HoldingsList holdings={holdings} />);
  expect(screen.queryByText(trade1Date)).toBeNull();
  expect(screen.queryByText(trade2Date)).toBeNull();

  const holdingButton = screen.getByText('AMZN');
  fireEvent.click(holdingButton);

  expect(screen.getByText(trade1Date)).toBeInTheDocument();
  expect(screen.getByText(trade2Date)).toBeInTheDocument();
});

test('deletes a trade when the delete button is clicked', async () => {
  apiUtils.deleteTrade = jest.fn().mockReturnValue(Promise.resolve());
  const holdings = [HOLDING_WITH_TRADES];
  render(<HoldingsList holdings={holdings} />);
  const holdingButton = screen.getByText('AMZN');
  fireEvent.click(holdingButton);

  const deleteButtons = await waitFor(() =>
    screen.getAllByRole('button', {name: 'delete'}),
  );
  fireEvent.click(deleteButtons[0]);
  expect(apiUtils.deleteTrade).toHaveBeenCalledWith(1);
});
