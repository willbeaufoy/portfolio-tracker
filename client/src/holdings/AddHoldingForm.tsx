import './AddHoldingForm.css';

import {Field, Form, Formik} from 'formik';
import {TextField} from 'formik-material-ui';
import React from 'react';

import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import {API} from '../api';
import {CURRENCIES} from '../constants';

type AddHoldingFormProps = {
  username: string;
  onHoldingCreated: Function;
};

/** Form to add a holding. */
export function AddHoldingForm(props: AddHoldingFormProps) {
  return (
    <div>
      <Formik
        initialValues={{
          name: '',
          symbol: '',
          category: 'STOCK',
          isin: '',
          currency: CURRENCIES[0],
          exchange: '',
        }}
        onSubmit={async (values, actions) => {
          try {
            const existingInstruments = await API.listInstruments(values.isin);
            let instrument = existingInstruments[0];
            if (!instrument) {
              instrument = await API.createInstrument({
                name: values.name,
                symbol: values.symbol,
                category: values.category,
                isin: values.isin,
                currency: values.currency,
                exchange: values.exchange,
                dataSource: 'FI',
              });
            }
            const holding = await API.createHolding({
              username: props.username,
              instrument: instrument.id,
            });
            actions.resetForm();
            props.onHoldingCreated(holding);
          } catch (err) {
            console.error(err);
          }
          actions.setSubmitting(false);
        }}>
        {({isSubmitting}) => (
          <Form className='AddHoldingForm'>
            <Field component={TextField} name='name' label='Name' />
            <Field component={TextField} name='symbol' label='Ticker Symbol' />
            <Field component={TextField} name='isin' label='ISIN' />
            <Field as='select' name='category'>
              <option value='STOCK'>Stock</option>
              <option value='ETF'>ETF</option>
              <option value='FUND'>Fund</option>
            </Field>
            <Field component={TextField} name='exchange' label='Exchange' />
            <Field as='select' name='currency'>
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Field>
            <Button
              variant='contained'
              color='primary'
              type='submit'
              disabled={isSubmitting}>
              Add Holding
            </Button>
            <div>{Boolean(isSubmitting) && <CircularProgress size={25} />}</div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
