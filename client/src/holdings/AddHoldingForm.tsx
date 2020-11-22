import './AddHoldingForm.css';
import {Field, Form, Formik} from 'formik';
import API from '../api';
import Button from '@material-ui/core/Button';
import {CURRENCIES} from './utils';
import React from 'react';
import {TextField} from 'formik-material-ui';

type AddHoldingFormProps = {
  username: string;
  onHoldingCreated: Function;
};

/** Form to add a holding. */
export default function AddHoldingForm(props: AddHoldingFormProps) {
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
            const instrument = await API.createInstrument({
              name: values.name,
              symbol: values.symbol,
              category: values.category,
              isin: values.isin,
              currency: values.currency,
              exchange: values.exchange,
              dataSource: 'FI',
            });
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
        }}
      >
        {({isSubmitting}) => (
          <Form className="AddHoldingForm">
            <Field component={TextField} name="name" label="Name" />
            <Field component={TextField} name="symbol" label="Ticker Symbol" />
            <Field component={TextField} name="isin" label="ISIN" />
            <Field as="select" name="category">
              <option value="STOCK">Stock</option>
              <option value="ETF">ETF</option>
              <option value="FUND">Fund</option>
            </Field>
            <Field component={TextField} name="exchange" label="Exchange" />
            <Field as="select" name="currency">
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Field>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={isSubmitting}
            >
              Add Holding
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
