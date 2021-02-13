import './AddTradeDialog.css';

import React, {useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import * as yup from 'yup';

import DateFnsUtils from '@date-io/date-fns';
import {yupResolver} from '@hookform/resolvers/yup';
import {MenuItem, Select} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
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
import {CreateTradeData, Currency, Holding, TradeCategory} from '../types';

interface IFormInput {
  date: Date;
  category: string;
  broker: string;
  priceCurrency: Currency;
  quantity: number;
  unitPrice: number;
  fee: number;
  tax: number;
  fxRate: number;
}

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
  } = useForm<CreateTradeData>({
    resolver: yupResolver(tradeValidationSchema),
    defaultValues: {
      category: 'BUY',
      broker: holding.trades.slice(-1)[0]?.broker ?? '',
      priceCurrency: holding.currency,
    },
  });

  function handleClickOpen() {
    setOpen(true);
  }

  function handleCancel() {
    setOpen(false);
  }

  async function onSubmit(data: IFormInput) {
    let fxRate: number = Number(data.fxRate ?? 0);
    if (!fxRate) {
      // An FX rate must always be provided even if the trade was made
      // in the user's currency.
      fxRate = holding.currency === 'GBX' ? 100 : 1;
    }
    const createTradeData: CreateTradeData = {
      holding: holding.id,
      date: new Date().toISOString().split('.')[0].replace('T', ' '),
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
            <div className='Category'>
              <Controller
                render={(category) => (
                  <ToggleButtonGroup
                    exclusive
                    size={'medium'}
                    aria-label='Category'
                    {...category}
                    onChange={(e, value) => {
                      category.onChange(value);
                    }}>
                    <ToggleButton value='BUY' key='BUY'>
                      BUY
                    </ToggleButton>
                    <ToggleButton value='SELL' key='SELL'>
                      SELL
                    </ToggleButton>
                  </ToggleButtonGroup>
                )}
                label='Category'
                name='category'
                control={control}
                inputRef={register}
              />
            </div>
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
              name='broker'
              inputRef={register}
            />
            <TextField
              margin='dense'
              label='Quantity'
              name='quantity'
              inputRef={register}
              error={errors.quantity ? true : false}
            />
            <Controller
              name='priceCurrency'
              label='Currency'
              control={control}
              as={
                <Select inputRef={register}>
                  {CURRENCIES.map((c) => (
                    <MenuItem key={c} value={c}>
                      {c}
                    </MenuItem>
                  ))}
                </Select>
              }
            />
            <TextField
              margin='dense'
              label='Unit Price'
              name='unitPrice'
              inputRef={register}
              error={errors.unitPrice ? true : false}
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
            {!!isSubmitting && (
              <CircularProgress size={25} style={{marginRight: '10px'}} />
            )}
            <Button onClick={handleCancel} color='primary'>
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
