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
import CircularProgress from '@material-ui/core/CircularProgress';

import {API} from '../api';
import {USER_CURRENCY} from '../settings';
import {CreateDividendData, Holding} from '../types';

export type IProps = {
  holding: Holding;
  onDividendCreated: Function;
};

export function AddDividendDialog({holding, onDividendCreated}: IProps) {
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
        Add Dividend
      </Button>
      <Dialog
        open={open}
        onClose={handleCancel}
        aria-labelledby='form-dialog-title'>
        <Formik
          initialValues={{
            date: new Date(),
            broker: holding.trades.slice(-1)[0]?.broker ?? '',
            value: '',
          }}
          onSubmit={async (values, {setSubmitting}) => {
            const input: CreateDividendData = {
              holding: holding.id,
              date: values.date.toISOString().split('.')[0].replace('T', ' '),
              broker: values.broker ?? '',
              value: Number(values.value ?? 0),
            };
            try {
              const dividend = await API.createDividend(input);
              onDividendCreated(dividend);
              setOpen(false);
            } catch (err) {
              console.error(err);
            }
            setSubmitting(false);
          }}>
          {({isSubmitting}) => (
            <Form>
              <DialogTitle id='form-dialog-title'>
                Add Dividend ({holding.symbol})
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
                <Field component={TextField} label='Broker' name='broker' />
                <Field
                  component={TextField}
                  label={`Value (${USER_CURRENCY})`}
                  name='value'
                />
              </DialogContent>
              <DialogActions>
                {!!isSubmitting && (
                  <CircularProgress size={25} style={{marginRight: '10px'}} />
                )}
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
