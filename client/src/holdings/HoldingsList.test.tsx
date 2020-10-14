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
  API.applyPrices = jest.fn();
});

test('displays a list of holdings', async () => {
  API.listHoldings = jest
    .fn()
    .mockReturnValue(Promise.resolve([HOLDING_1, HOLDING_2]));

  render(<HoldingsList {...props} />);

  await waitFor(() => {
    expect(screen.getByText('AMZN')).toBeInTheDocument();
    expect(screen.getByText('BOO.XLON')).toBeInTheDocument();
  });
});

describe('holdings with trades', () => {
  const trade1Date = '04 Mar 2018';
  const trade2Date = '08 Sep 2020';

  beforeEach(async () => {
    API.listHoldings = jest
      .fn()
      .mockReturnValue(Promise.resolve([HOLDING_WITH_TRADES]));
  });

  test(`displays a holding's trades on click`, async () => {
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

  test('click delete button deletes a trade and removes it from the list', async () => {
    API.deleteTrade = jest.fn().mockReturnValue(Promise.resolve());
    // Replicate previous test to get to the state where we can delete.
    render(<HoldingsList {...props} />);
    const holdingEl = await waitFor(() => screen.getByText('AMZN'));
    fireEvent.click(holdingEl!);
    let deleteButtons: HTMLElement[];
    await waitFor(() => {
      expect(screen.getByText(trade1Date)).toBeInTheDocument();
      expect(screen.getByText(trade2Date)).toBeInTheDocument();
      deleteButtons = screen.getAllByRole('button', {name: 'delete'});
    });

    fireEvent.click(deleteButtons[1]);

    await waitFor(() => {
      expect(screen.queryByText(trade1Date)).toBeNull();
      expect(screen.getByText(trade2Date)).toBeInTheDocument();
    });
    expect(API.deleteTrade).toHaveBeenCalledWith(11);
  });
});
