import './AddTradeDialog.css';

import React, {useState} from 'react';
import {Controller, useForm} from 'react-hook-form';

import DateFnsUtils from '@date-io/date-fns';
import {yupResolver} from '@hookform/resolvers/yup';
import {Select} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import {DateTimePicker, MuiPickersUtilsProvider} from '@material-ui/pickers';

import {API} from '../api';
import {CURRENCIES} from '../constants';
import {CreateTradeData, Holding, TradeCategory} from '../types';
import {tradeValidationSchema} from './tradevalidationschema';

export type AddTradeDialogProps = {
  holding: Holding;
  onTradeCreated: Function;
  showNotification: Function;
};

export function AddTradeDialog({
  holding,
  onTradeCreated,
  showNotification,
}: AddTradeDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const handleDateChange = (date: any) => {
    setSelectedDate(date);
  };
  const {register, handleSubmit, control} = useForm<CreateTradeData>({
    resolver: yupResolver(tradeValidationSchema),
    reValidateMode: 'onChange',
    mode: 'onChange',
    defaultValues: {
      date: '',
      category: 'BUY',
      broker: holding.trades.slice(-1)[0]?.broker ?? '',
      priceCurrency: holding.currency,
      quantity: undefined,
      unitPrice: undefined,
      fee: undefined,
      tax: undefined,
      fxRate: undefined,
    },
  });

  function handleClickOpen() {
    setOpen(true);
  }

  function handleCancel() {
    setOpen(false);
  }
  async function onSubmit(data: CreateTradeData) {
    const input: CreateTradeData = {
      holding: holding.id,
      date: new Date().toISOString().split('T')[0],
      category: data.category as TradeCategory,
      broker: data.broker,
      quantity: data.quantity,
      priceCurrency: data.priceCurrency,
      unitPrice: data.unitPrice,
      fee: data.fee,
      tax: data.tax,
      fxRate: data.fxRate,
      paymentCurrency: 'GBP', // Assume trade was always paid for in GBP for now.
    };
    let fxRate: number = Number(data.fxRate ?? 0);
    if (!fxRate) {
      // An FX rate must always be provided even if the trade was made
      // in the user's currency.
      fxRate = holding.currency === 'GBX' ? 100 : 1;
    }
    try {
      const trade = await API.createTrade(input);
      onTradeCreated(trade);
      setOpen(false);
    } catch (err) {
      showNotification(`Create trade for ${holding.symbol} failed!`, 'error');
    }
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle id='form-dialog-title'>
            Add Trade ({holding.symbol})
          </DialogTitle>
          <DialogContent className='DialogContent'>
            <Controller
              render={(props) => (
                <ToggleButtonGroup
                  exclusive
                  aria-label='text alignment'
                  {...props}
                  onChange={(e, value) => {
                    props.onChange(value);
                  }}>
                  <ToggleButton value='BUY' key='BUY'>
                    BUY
                  </ToggleButton>
                  <ToggleButton value='SELL' key='SELL'>
                    SELL
                  </ToggleButton>
                </ToggleButtonGroup>
              )}
              name='category'
              defaultValue={'Buy'}
              control={control}
              inputRef={register}
            />

            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <DateTimePicker
                value={selectedDate}
                onChange={handleDateChange}
                label='Date'
                variant='inline'
                name='date'
                inputRef={register}
              />
            </MuiPickersUtilsProvider>
            <TextField
              margin='dense'
              label='Broker'
              name='Broker'
              inputRef={register}
            />
            <TextField
              margin='dense'
              label='Quantity'
              name='Quantity'
              inputRef={register}
            />
            <Select
              name='priceCurrency'
              inputRef={register}
              defaultValue={holding.currency}>
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
            <TextField
              margin='dense'
              label='Unit Price'
              name='Unit Price'
              inputRef={register}
            />
            <TextField
              margin='dense'
              label='Fee'
              name='Fee'
              inputRef={register}
            />
            <TextField
              margin='dense'
              label='Tax'
              name='Tax'
              inputRef={register}
            />
            <TextField
              margin='dense'
              label='FX Rate'
              name='FX Rate'
              inputRef={register}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancel} color='primary'>
              Cancel
            </Button>
            <Button type='submit' color='primary'>
              Add
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}
