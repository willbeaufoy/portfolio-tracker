import './AddTradeDialog.css';

import {Field, Form, Formik} from 'formik';
import {TextField} from 'formik-material-ui';
import {KeyboardDateTimePicker} from 'formik-material-ui-pickers';
import React, {useState} from 'react';

import DateFnsUtils from '@date-io/date-fns';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import {MuiPickersUtilsProvider} from '@material-ui/pickers';

import {API, Holding, TradeCategory} from '../api';
import {CURRENCIES} from './utils/performance';

export type AddTradeDialogProps = {
  holding: Holding;
  onTradeCreated: Function;
};

export function AddTradeDialog({holding, onTradeCreated}: AddTradeDialogProps) {
  const [open, setOpen] = useState(false);

  function handleClickOpen() {
    setOpen(true);
  }

  function handleCancel() {
    setOpen(false);
  }

  return (
    <div>
      <Button variant='outlined' color='primary' onClick={handleClickOpen}>
        Add Trade
      </Button>
      <Dialog
        open={open}
        onClose={handleCancel}
        aria-labelledby='form-dialog-title'>
        <Formik
          initialValues={{
            date: new Date(),
            category: 'BUY',
            broker: holding.trades.slice(-1)[0]?.broker ?? '',
            priceCurrency: CURRENCIES[0],
            quantity: '',
            unitPrice: '',
            fee: '',
            tax: '',
            fxRate: '',
            fxFee: '',
          }}
          onSubmit={async (values, {setSubmitting}) => {
            let fxRate = Number(values.fxRate ?? 0);
            if (!fxRate) {
              // An FX rate must always be provided even if the trade was made
              // in the user's currency.
              fxRate = holding.currency === 'GBX' ? 100 : 1;
            }
            const input = {
              holding: holding.id,
              date: values.date.toISOString().split('.')[0].replace('T', ' '),
              category: values.category as TradeCategory,
              broker: values.broker ?? '',
              quantity: Number(values.quantity ?? 0),
              priceCurrency: values.priceCurrency,
              unitPrice: Number(values.unitPrice ?? 0),
              paymentCurrency: 'GBP', // Assume trade was always paid for in GBP for now.
              fee: Number(values.fee ?? 0),
              tax: Number(values.tax ?? 0),
              fxRate,
              fxFee: 0, // Field not used currenctly.
            };
            try {
              const trade = await API.createTrade(input);
              onTradeCreated(trade);
              setOpen(false);
            } catch (err) {
              console.error(err);
            }
            setSubmitting(false);
          }}>
          {({isSubmitting}) => (
            <Form>
              <DialogTitle id='form-dialog-title'>
                Add Trade ({holding.symbol})
              </DialogTitle>
              <DialogContent className='DialogContent'>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <Field
                    component={KeyboardDateTimePicker}
                    label='Date'
                    variant='inline'
                    name='date'
                  />
                </MuiPickersUtilsProvider>
                <Field as='select' name='category'>
                  <option value='BUY'>Buy</option>
                  <option value='SELL'>Sell</option>
                </Field>
                <Field component={TextField} label='Broker' name='broker' />
                <Field component={TextField} label='Quantity' name='quantity' />
                <Field as='select' name='priceCurrency'>
                  {CURRENCIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </Field>
                <Field
                  component={TextField}
                  label={`Unit Price`}
                  name='unitPrice'
                />
                <Field component={TextField} label='Fee' name='fee' />
                <Field component={TextField} label='Tax' name='tax' />
                <Field component={TextField} label='FX Rate' name='fxRate' />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCancel} color='primary'>
                  Cancel
                </Button>
                <Button type='submit' disabled={isSubmitting} color='primary'>
                  Add
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </div>
  );
}
