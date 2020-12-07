import {HOLDING_1, USER} from '../test_fixtures';
import {fireEvent, render} from '@testing-library/react';
import TradesList, {TradesListProps} from './TradesList';
import React from 'react';
import {screen} from '@testing-library/dom';
import {setHoldingPerformance} from './utils/performance';

let props: TradesListProps;
let removeTrade: Function;

beforeEach(() => {
  removeTrade = jest.fn();
  setHoldingPerformance(HOLDING_1);
  props = {
    holding: HOLDING_1,
    user: USER,
    onDeleteTradeClicked: removeTrade,
  };
});

test('displays the calculated total price and performance of the trades', () => {
  render(<TradesList {...props} />);

  const cells = screen.getAllByRole('cell');
  // First row should have both splits applied as the first split took place on
  // the day of the trade, and the second one subsequently.
  expect(cells[5].textContent).toBe('-£8,607.16');
  expect(cells[6].textContent).toBe('-£1,767.16 (20.53%)');
  // Second row should have no splits applied.
  expect(cells[13].textContent).toBe('-£6,641.82');
  expect(cells[14].textContent).toBe('+£198.18 (2.98%)');
});

test('notifies the parent when the delete button is clicked', () => {
  render(<TradesList {...props} />);

  const deleteButtons = screen.getAllByRole('button', {name: 'delete'});
  fireEvent.click(deleteButtons[0]);

  expect(removeTrade).toHaveBeenCalledWith(11, 0);
});
