import API, {Holding} from '../api';
import {HOLDING_1, HOLDING_2, USER} from '../test_fixtures';
import {fireEvent, render, waitFor} from '@testing-library/react';
import HoldingsList, {HoldingsListProps} from './HoldingsList';
import React from 'react';
import cloneDeep from 'lodash.clonedeep';
import {screen} from '@testing-library/dom';
import {act} from 'react-dom/test-utils';

let props: HoldingsListProps;

beforeEach(() => {
  props = {
    user: USER,
  };
});

describe('holdings with trades', () => {
  const trade1Date = '04 Mar 2018';
  const trade2Date = '08 Sep 2020';

  beforeEach(async () => {
    API.listHoldings = jest
      .fn()
      .mockReturnValue(
        Promise.resolve([cloneDeep(HOLDING_1), cloneDeep(HOLDING_2)]),
      );
  });

  test('displays a list of holdings with their individual and combined performance figures', async () => {
    render(<HoldingsList {...props} />);

    await waitFor(() => {
      // Total performance.
      expect(screen.getByText('-10.26% (-£1,587.03)')).toBeInTheDocument();
      // Amazon performance.
      expect(screen.getByText('Amazon (AMZN)')).toBeInTheDocument();
      expect(screen.getByText('-10.29% (-£1,569.43)')).toBeInTheDocument();
      // Boohoo performance.
      expect(screen.getByText('Boohoo (BOO.XLON)')).toBeInTheDocument();
      expect(screen.getByText('-8.13% (-£17.60)')).toBeInTheDocument();
    });
  });

  test(`displays a holding's trades on click`, async () => {
    render(<HoldingsList {...props} />);
    let holdingEl: HTMLElement;
    await waitFor(() => {
      expect(screen.queryByText(trade1Date)).toBeNull();
      expect(screen.queryByText(trade2Date)).toBeNull();
      holdingEl = screen.getByText('Amazon (AMZN)');
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
    const holdingEl = await waitFor(() => screen.getByText('Amazon (AMZN)'));
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

  test(`click 'refresh' button refreshes prices`, async () => {
    API.refreshPrices = jest
      .fn()
      .mockReturnValue(Promise.resolve({status: 'ok'}));
    render(<HoldingsList {...props} />);
    // Check the total performance, as we expect this to change in the test.
    await waitFor(() => {
      expect(screen.getByText('-10.26% (-£1,587.03)')).toBeInTheDocument();
    });
    // Now change what listHoldings returns to mock the data having changed on the API.
    const holding1New: Holding = cloneDeep(HOLDING_1);
    holding1New.bidPrice += 100;
    API.listHoldings.mockReturnValue(
      Promise.resolve([holding1New, cloneDeep(HOLDING_2)]),
    );

    act(() => {
      const refreshButton = screen.getByText('Refresh Prices');
      fireEvent.click(refreshButton);
    });

    await waitFor(() => {
      expect(API.refreshPrices).toHaveBeenCalled();
      expect(API.listHoldings).toHaveBeenCalledTimes(2);
      // Check new total performance value.
      expect(screen.getByText('-7.31% (-£1,131.03)')).toBeInTheDocument();
    });
  });
});
