import './Dialog.css';

import React, {useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import * as yup from 'yup';

import DateFnsUtils from '@date-io/date-fns';
import {yupResolver} from '@hookform/resolvers/yup';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@material-ui/core';
import {DateTimePicker, MuiPickersUtilsProvider} from '@material-ui/pickers';

import {API} from '../api';
import {USER_CURRENCY} from '../settings';
import {CreateDividendData, Holding} from '../types';

interface IFormInput {
  broker: string;
  value: number;
  date: Date;
}

export type IProps = {
  holding: Holding;
  onDividendCreated: Function;
  showNotification: Function;
};

export function AddDividendDialog({
  holding,
  onDividendCreated,
  showNotification,
}: IProps) {
  const [open, setOpen] = useState(false);
  const diviValidationSchema = yup.object().shape({
    broker: yup.string(),
    value: yup.number().required().moreThan(0),
    date: yup.date(),
  });
  const {
    register,
    handleSubmit,
    control,
    errors,
    formState: {isSubmitting},
  } = useForm<IFormInput>({
    resolver: yupResolver(diviValidationSchema),
    defaultValues: {
      broker: holding.trades.slice(-1)[0]?.broker ?? '',
      value: undefined,
      date: new Date().toISOString(),
    },
  });

  function openDialog() {
    setOpen(true);
  }

  function cancel() {
    setOpen(false);
  }

  async function submitForm(data: IFormInput) {
    const createDividendData: CreateDividendData = {
      holding: holding.id,
      broker: data.broker ?? '',
      value: data.value,
      date: data.date.toISOString().split('.')[0].replace('T', ' '),
    };
    try {
      const dividend = await API.createDividend(createDividendData);
      onDividendCreated(dividend);
      setOpen(false);
    } catch (err) {
      showNotification(
        `Create dividend for ${holding.symbol} failed!`,
        'error'
      );
    }
  }

  return (
    <div>
      <Button variant='outlined' color='primary' onClick={openDialog}>
        Add Dividend
      </Button>
      <Dialog open={open} onClose={cancel} aria-labelledby='form-dialog-title'>
        <form onSubmit={handleSubmit(submitForm)}>
          <DialogTitle id='form-dialog-title' style={{textAlign: 'center'}}>
            Add Dividend ({holding.symbol})
          </DialogTitle>
          <DialogContent className='DialogContent'>
            <TextField
              margin='dense'
              label='Broker'
              name='broker'
              inputRef={register}
            />
            <TextField
              margin='dense'
              label={`Value (${USER_CURRENCY})`}
              name='value'
              inputRef={register}
              error={!!errors.value}
            />
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Controller
                name='date'
                label='Date'
                control={control}
                render={({onChange, value}) => (
                  <DateTimePicker
                    value={value}
                    onChange={(date) => onChange(date)}
                    variant='inline'
                  />
                )}
              />
            </MuiPickersUtilsProvider>
          </DialogContent>
          <DialogActions>
            {isSubmitting && (
              <CircularProgress size={25} style={{marginRight: '10px'}} />
            )}
            <Button onClick={cancel} color='primary'>
              Cancel
            </Button>
            <Button type='submit' disabled={isSubmitting} color='primary'>
              Add
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}
