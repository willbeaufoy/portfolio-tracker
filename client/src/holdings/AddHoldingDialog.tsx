import './Dialog.css';

import React, {useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import * as yup from 'yup';

import {yupResolver} from '@hookform/resolvers/yup';
import {
    Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Select,
    TextField
} from '@material-ui/core';

import {API} from '../api';
import {CURRENCIES} from '../constants';
import {CreateInstrumentData, Currency} from '../types';

interface IFormInput {
  name: string;
  symbol: string;
  category: string;
  isin: string;
  currency: Currency;
  exchange: string;
}

type AddHoldingDialogProps = {
  username: string;
  onHoldingCreated: Function;
  showNotification: Function;
};

/** Form to add a holding. */
export function AddHoldingDialog({
  username,
  onHoldingCreated,
  showNotification,
}: AddHoldingDialogProps) {
  const [open, setOpen] = useState(false);
  const holdingValidationSchema = yup.object().shape({
    name: yup.string(),
    symbol: yup.string(),
    category: yup.string(),
    isin: yup.string(),
    currency: yup.string(),
    exchange: yup.string(),
  });
  const {
    register,
    handleSubmit,
    control,
    formState: {isSubmitting},
  } = useForm<CreateInstrumentData>({
    resolver: yupResolver(holdingValidationSchema),
    defaultValues: {
      category: 'STOCK',
      currency: CURRENCIES[0],
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
              as={
                // Should be using Render but won't pass default value correctly.
                <Select>
                  <MenuItem value='STOCK'>Stock</MenuItem>
                  <MenuItem value='ETF'>ETF</MenuItem>
                  <MenuItem value='FUND'>Fund</MenuItem>
                </Select>
              }
            />
            <Controller
              name='currency'
              label='Currency'
              control={control}
              as={
                // Should be using Render but won't pass default value correctly.
                <Select>
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
              label='Name'
              name='name'
              inputRef={register}
            />
            <TextField
              margin='dense'
              label='Ticker Symbol'
              name='symbol'
              inputRef={register}
            />
            <TextField
              margin='dense'
              label='ISIN'
              name='isin'
              inputRef={register}
            />
            <TextField
              margin='dense'
              label='Exchange'
              name='exchange'
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
