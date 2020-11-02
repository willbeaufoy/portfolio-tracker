import {HOLDING_1} from '../test_fixtures';
import {fireEvent, render} from '@testing-library/react';
import TradesList, {TradesListProps} from './TradesList';
import React from 'react';
import {screen} from '@testing-library/dom';
import {setHoldingPerformance} from './utils';

let props: TradesListProps;
let removeTrade: Function;

beforeEach(() => {
  removeTrade = jest.fn();
  setHoldingPerformance(HOLDING_1);
  props = {
    holding: HOLDING_1,
    onDeleteTradeClicked: removeTrade,
  };
});

test('displays the calculated total price and performance of the trades', () => {
  render(<TradesList {...props} />);

  const cells = screen.getAllByRole('cell');
  // First row should have both splits applied as the first split took place on
  // the day of the trade, and the second one subsequently.
  expect(cells[4].textContent).toBe('10500.60');
  expect(cells[5].textContent).toBe('-14.29% (£1500.60)');
  // Second row should have no splits applied.
  expect(cells[11].textContent).toBe('8701.05');
  expect(cells[12].textContent).toBe('+3.44% (£298.95)');
});

test('notifies the parent when the delete button is clicked', () => {
  render(<TradesList {...props} />);

  const deleteButtons = screen.getAllByRole('button', {name: 'delete'});
  fireEvent.click(deleteButtons[0]);

  expect(removeTrade).toHaveBeenCalledWith(11, 0);
});
