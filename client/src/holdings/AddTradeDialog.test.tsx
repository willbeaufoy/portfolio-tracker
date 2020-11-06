import {fireEvent, render, waitFor} from '@testing-library/react';
import API from '../api';
import AddTradeDialog, {AddTradeDialogProps} from './AddTradeDialog';
import {HOLDING_2} from '../test_fixtures';
import React from 'react';
import {act} from 'react-dom/test-utils';
import {screen} from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

const DIALOG_TITLE = 'Add Trade';
let props: AddTradeDialogProps;
let addTrade: Function;

beforeEach(() => {
  addTrade = jest.fn();
  props = {
    holding: HOLDING_2,
    onTradeCreated: addTrade,
  };
});

test('opens and then cancels the dialog', async () => {
  const {getByRole, queryByRole} = render(<AddTradeDialog {...props} />);

  expect(queryByRole('heading', {name: DIALOG_TITLE})).toBeNull();

  const openButton = getByRole('button', {name: 'Add Trade'});
  fireEvent.click(openButton);

  await waitFor(() => {
    expect(getByRole('heading', {name: DIALOG_TITLE})).toBeInTheDocument();
  });

  const cancelButton = getByRole('button', {name: 'Cancel'});
  fireEvent.click(cancelButton);

  await waitFor(() => {
    expect(queryByRole('heading', {name: DIALOG_TITLE})).toBeNull();
  });
});

test('creates a trade', async () => {
  API.createTrade = jest.fn().mockReturnValue(Promise.resolve({id: 15}));
  await act(async () => {
    render(<AddTradeDialog {...props} />);
    const openButton = screen.getByRole('button', {name: 'Add Trade'});
    fireEvent.click(openButton);
    await waitFor(() => {
      expect(
        screen.getByRole('heading', {name: DIALOG_TITLE}),
      ).toBeInTheDocument();
    });

    const inputs = screen.getAllByRole('textbox');
    const [dateInput, brokerInput, quantityInput, unitPriceInput] = inputs;
    const addButton = screen.getByRole('button', {name: 'Add'});
    userEvent.type(brokerInput, 'Freetrade');
    userEvent.type(quantityInput, '0.003');
    userEvent.type(unitPriceInput, '200');
    fireEvent.click(addButton);
  });

  await waitFor(() => {
    expect(screen.queryByRole('heading', {name: DIALOG_TITLE})).toBeNull();
  });
  // TODO: Set date specifically.
  expect(API.createTrade).toHaveBeenCalledWith({
    holding: 2,
    date: new Date().toISOString().split('T')[0],
    broker: 'Freetrade',
    currency: 'GBP',
    quantity: 0.003,
    unitPrice: 200,
    fee: 0,
    tax: 0,
    fxRate: 100,
    fxFee: 0,
  });
  expect(addTrade).toHaveBeenCalledWith({id: 15});
});
