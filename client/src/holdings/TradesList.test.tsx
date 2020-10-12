import {HOLDING_WITH_TRADES} from '../test_utils';
import {fireEvent, render} from '@testing-library/react';
import TradesList, {TradesListProps} from './TradesList';
import React from 'react';
import {screen} from '@testing-library/dom';

let props: TradesListProps;
let removeTrade: Function;

beforeEach(() => {
  removeTrade = jest.fn();
  props = {
    holding: HOLDING_WITH_TRADES,
    onDeleteTradeClicked: removeTrade,
  };
});

test('notifies the parent when the delete button is clicked', () => {
  render(<TradesList {...props} />);

  const deleteButtons = screen.getAllByRole('button', {name: 'delete'});
  fireEvent.click(deleteButtons[0]);

  expect(removeTrade).toHaveBeenCalledWith(11, 0);
});
