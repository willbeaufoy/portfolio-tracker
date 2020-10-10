import API from '../api';
import {HOLDING_1, HOLDING_2, HOLDING_WITH_TRADES, USER} from '../test_utils';
import {fireEvent, render, waitFor} from '@testing-library/react';
import HoldingsList, {HoldingsListProps} from './HoldingsList';
import React from 'react';
import {screen} from '@testing-library/dom';

let props: HoldingsListProps;

beforeEach(() => {
  props = {
    user: USER,
  };
});

test('displays a list of holdings', async () => {
  API.listHoldings = jest
    .fn()
    .mockReturnValue(Promise.resolve([HOLDING_1, HOLDING_2]));
  API.applyPrices = jest.fn();

  render(<HoldingsList {...props} />);

  await waitFor(() => {
    expect(screen.getByText('AMZN')).toBeInTheDocument();
    expect(screen.getByText('TSLA')).toBeInTheDocument();
  });
});

test(`displays a holding's trades on click`, async () => {
  API.listHoldings = jest
    .fn()
    .mockReturnValue(Promise.resolve([HOLDING_WITH_TRADES]));
  API.applyPrices = jest.fn();
  const trade1Date = '2018-03-04';
  const trade2Date = '2020-09-08';

  render(<HoldingsList {...props} />);
  let holdingEl: HTMLElement;
  await waitFor(() => {
    expect(screen.queryByText(trade1Date)).toBeNull();
    expect(screen.queryByText(trade2Date)).toBeNull();
    holdingEl = screen.getByText('AMZN');
  });
  fireEvent.click(holdingEl!);

  await waitFor(() => {
    expect(screen.getByText(trade1Date)).toBeInTheDocument();
    expect(screen.getByText(trade2Date)).toBeInTheDocument();
  });
});

test('removes a trade after it has been deleted', () => {
  API.deleteTrade = jest.fn().mockReturnValue(Promise.resolve());
  // TODO: Implement.
});
