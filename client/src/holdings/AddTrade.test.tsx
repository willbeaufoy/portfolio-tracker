import {
  fireEvent,
  render,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import AddTrade from './AddTrade';
import {HOLDING_1} from '../test_utils';
import React from 'react';
import {act} from 'react-dom/test-utils';
import * as apiUtils from '../api_utils';
import {screen} from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

const DIALOG_TITLE = 'Add Trade';

test('opens and then cancels the dialog', async () => {
  const {getByRole, queryByRole} = render(<AddTrade holding={HOLDING_1} />);

  expect(queryByRole('heading', {name: DIALOG_TITLE})).toBeNull();

  const openButton = getByRole('button', {name: 'Add Trade'});
  fireEvent.click(openButton);

  await waitFor(() => {
    expect(getByRole('heading', {name: DIALOG_TITLE})).toBeInTheDocument();
  });

  const cancelButton = getByRole('button', {name: 'Cancel'});
  fireEvent.click(cancelButton);

  await waitForElementToBeRemoved(() =>
    queryByRole('heading', {name: DIALOG_TITLE}),
  );
});

test('adds a trade', async () => {
  apiUtils.createTrade = jest.fn().mockReturnValue(Promise.resolve());
  await act(async () => {
    const {getByRole, getAllByRole} = render(<AddTrade holding={HOLDING_1} />);
    const openButton = getByRole('button', {name: 'Add Trade'});
    fireEvent.click(openButton);
    await waitFor(() => {
      expect(getByRole('heading', {name: DIALOG_TITLE})).toBeInTheDocument();
    });

    const numberInputs = getAllByRole('textbox');
    const [dateInput, quantityInput, unitPriceInput] = numberInputs;
    const addButton = getByRole('button', {name: 'Add'});
    userEvent.type(quantityInput, '0.003');
    userEvent.type(unitPriceInput, '200');
    fireEvent.click(addButton);
  });

  await waitForElementToBeRemoved(() =>
    screen.queryByRole('heading', {name: DIALOG_TITLE}),
  );
  // TODO: Set date specifically.
  expect(apiUtils.createTrade).toHaveBeenCalledWith({
    holding: 1,
    date: new Date().toISOString().split('T')[0],
    quantity: 0.003,
    unitPrice: 200,
    fee: 0,
    fxFee: 0,
    fxRate: 0,
  });
});
