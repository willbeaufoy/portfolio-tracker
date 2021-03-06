import './Dialog.css';

import {debounce} from 'debounce';
import React, {useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import * as yup from 'yup';

import DateFnsUtils from '@date-io/date-fns';
import {yupResolver} from '@hookform/resolvers/yup';
import {
    Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FormControl,
    InputLabel, MenuItem, Select, TextField, Tooltip
} from '@material-ui/core';
import {ToggleButton, ToggleButtonGroup} from '@material-ui/lab';
import {KeyboardDateTimePicker, MuiPickersUtilsProvider} from '@material-ui/pickers';

import {API} from '../api';
import {CURRENCIES} from '../constants';
import {CreateTradeData, Currency, Holding, TradeCategory} from '../types';

interface IFormInput {
  date: Date;
  category: string;
  broker: string;
  priceCurrency: Currency;
  quantity: number;
  unitPrice: number;
  fee: string;
  tax: string;
  fxRate: string;
}

export interface AddTradeDialogProps {
  holding: Holding;
  onTradeCreated: Function;
  showNotification: Function;
}

export function AddTradeDialog({
  holding,
  onTradeCreated,
  showNotification,
}: AddTradeDialogProps) {
  const [open, setOpen] = useState(false);
  const tradeValidationSchema = yup.object().shape({
    category: yup.string(),
    date: yup.date(),
    broker: yup.string(),
    quantity: yup.number().required().moreThan(0),
    priceCurrency: yup.string(),
    unitPrice: yup.number().required().moreThan(0),
    fee: yup.string(),
    tax: yup.string(),
    fxRate: yup.string(),
  });
  const {
    register,
    handleSubmit,
    control,
    errors,
    formState: {isSubmitting},
  } = useForm<IFormInput>({
    resolver: yupResolver(tradeValidationSchema),
    defaultValues: {
      category: 'BUY',
      date: new Date().toISOString(),
      broker: holding.trades.slice(-1)[0]?.broker ?? '',
      priceCurrency:
        holding.trades.slice(-1)[0]?.priceCurrency ?? holding.currency,
    },
  });

  function openDialog() {
    setOpen(true);
  }

  function cancel() {
    setOpen(false);
  }

  async function submitForm(data: IFormInput) {
    let fxRate: number = Number(data.fxRate) ?? 0;
    if (!fxRate) {
      // An FX rate must always be provided even if the trade was made
      // in the user's currency.
      fxRate = holding.currency === 'GBX' ? 100 : 1;
    }
    const createTradeData: CreateTradeData = {
      holding: holding.id,
      date: data.date.toISOString().split('.')[0].replace('T', ' '),
      category: data.category as TradeCategory,
      broker: data.broker ?? '',
      quantity: data.quantity,
      priceCurrency: data.priceCurrency,
      unitPrice: data.unitPrice,
      fee: Number(data.fee) ?? 0,
      tax: Number(data.tax) ?? 0,
      fxRate,
      paymentCurrency: 'GBP', // Assume trade was always paid for in GBP for now.
    };
    try {
      const trade = await API.createTrade(createTradeData);
      onTradeCreated(trade);
      setOpen(false);
    } catch (err) {
      showNotification(`Create trade for ${holding.symbol} failed!`, 'error');
    }
  }

  return (
    <div>
      <Button variant='outlined' color='primary' onClick={openDialog}>
        Add Trade
      </Button>
      <Dialog open={open} onClose={cancel} aria-labelledby='form-dialog-title'>
        <form onSubmit={handleSubmit(submitForm)}>
          <DialogTitle id='form-dialog-title' style={{textAlign: 'center'}}>
            Add Trade ({holding.symbol})
          </DialogTitle>
          <DialogContent className='DialogContent'>
            <div style={{textAlign: 'center'}}>
              <Controller
                label='Category'
                name='category'
                control={control}
                render={({onChange, value}) => (
                  <ToggleButtonGroup
                    exclusive
                    aria-label='Category'
                    value={value}
                    onChange={(e, value) => onChange(value)}>
                    <ToggleButton value='BUY'>BUY</ToggleButton>
                    <ToggleButton value='SELL'>SELL</ToggleButton>
                  </ToggleButtonGroup>
                )}
              />
            </div>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Controller
                name='date'
                label='Date'
                control={control}
                render={({onChange, value}) => (
                  <KeyboardDateTimePicker
                    value={value}
                    onChange={debounce((date) => onChange(date), 1000)}
                    variant='inline'
                    format='dd/MM/yyyy HH:mm:ss'
                  />
                )}
              />
            </MuiPickersUtilsProvider>
            <TextField
              margin='dense'
              label='Broker'
              name='broker'
              inputRef={register}
            />
            <TextField
              margin='dense'
              label='Quantity'
              name='quantity'
              inputRef={register}
              error={!!errors.quantity}
            />
            <Controller
              name='priceCurrency'
              label='Currency'
              control={control}
              render={({onChange, value}) => (
                <FormControl>
                  <Tooltip title='The currency of the unit price (not the currency you paid in)'>
                    <InputLabel>Unit Price Currency</InputLabel>
                  </Tooltip>
                  <Select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}>
                    {CURRENCIES.map((c) => (
                      <MenuItem key={c} value={c}>
                        {c}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
            <TextField
              margin='dense'
              label='Unit Price'
              name='unitPrice'
              inputRef={register}
              error={!!errors.unitPrice}
            />
            <TextField
              margin='dense'
              label='Fee'
              name='fee'
              inputRef={register}
            />
            <TextField
              margin='dense'
              label='Tax'
              name='tax'
              inputRef={register}
            />
            <TextField
              margin='dense'
              label='FX Rate'
              name='fxRate'
              inputRef={register}
            />
          </DialogContent>
          <DialogActions>
            {isSubmitting && (
              <CircularProgress size={25} style={{marginRight: '10px'}} />
            )}
            <Button onClick={cancel} color='primary'>
              Cancel
            </Button>
            <Button type='submit' color='primary' disabled={isSubmitting}>
              Add
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}
