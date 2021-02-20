import './Dialog.css';

import React, {useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import * as yup from 'yup';

import {yupResolver} from '@hookform/resolvers/yup';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
} from '@material-ui/core';

import {API} from '../api';
import {CURRENCIES} from '../constants';
import {Currency} from '../types';

interface IFormInput {
  name: string;
  symbol: string;
  category: string;
  isin: string;
  currency: Currency;
  exchange: string;
}

interface AddHoldingDialogProps {
  username: string;
  onHoldingCreated: Function;
  showNotification: Function;
}

/** Form to add a holding. */
export function AddHoldingDialog({
  username,
  onHoldingCreated,
  showNotification,
}: AddHoldingDialogProps) {
  const [open, setOpen] = useState(false);
  const holdingValidationSchema = yup.object().shape({
    name: yup.string().required(),
    symbol: yup.string().required(),
    category: yup.string(),
    isin: yup.string().required(),
    currency: yup.string(),
    exchange: yup.string().required(),
  });
  const {
    register,
    handleSubmit,
    control,
    errors,
    formState: {isSubmitting},
  } = useForm<IFormInput>({
    resolver: yupResolver(holdingValidationSchema),
    defaultValues: {
      category: 'STOCK',
      currency: 'USD',
    },
  });

  function openDialog() {
    setOpen(true);
  }

  function cancel() {
    setOpen(false);
  }

  async function submitForm(data: IFormInput) {
    try {
      const existingInstruments = await API.listInstruments(data.isin);
      let instrument = existingInstruments[0];
      if (!instrument) {
        instrument = await API.createInstrument({
          name: data.name,
          symbol: data.symbol,
          category: data.category,
          isin: data.isin,
          currency: data.currency,
          exchange: data.exchange,
          dataSource: 'FI',
        });
      }
      const holding = await API.createHolding({
        username: username,
        instrument: instrument.id,
      });
      onHoldingCreated(holding);
      setOpen(false);
    } catch (err) {
      showNotification(`Add holding ${data.symbol} failed!`, 'error');
    }
  }

  return (
    <div>
      <Button
        variant='contained'
        color='primary'
        onClick={openDialog}
        style={{textAlign: 'center'}}>
        Add Holding
      </Button>
      <Dialog open={open} onClose={cancel} aria-labelledby='form-dialog-title'>
        <form onSubmit={handleSubmit(submitForm)}>
          <DialogTitle id='form-dialog-title' style={{textAlign: 'center'}}>
            Add Holding
          </DialogTitle>
          <DialogContent className='DialogContent'>
            <Controller
              name='category'
              label='Category'
              control={control}
              render={({onChange, value}) => (
                <FormControl>
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}>
                    <MenuItem value='STOCK'>Stock</MenuItem>
                    <MenuItem value='ETF'>ETF</MenuItem>
                    <MenuItem value='FUND'>Fund</MenuItem>
                  </Select>
                </FormControl>
              )}
            />
            <Controller
              name='currency'
              label='Currency'
              control={control}
              render={({onChange, value}) => (
                <FormControl>
                  <Tooltip title='The currency the holding is priced in in the data source (currently FinKi)'>
                    <InputLabel>Currency</InputLabel>
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
              label='Name'
              name='name'
              inputRef={register}
              error={!!errors.name}
            />
            <TextField
              margin='dense'
              label='Ticker Symbol'
              name='symbol'
              inputRef={register}
              error={!!errors.symbol}
            />
            <TextField
              margin='dense'
              label='ISIN'
              name='isin'
              inputRef={register}
              error={!!errors.isin}
            />
            <TextField
              margin='dense'
              label='Exchange'
              name='exchange'
              inputRef={register}
              error={!!errors.exchange}
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
