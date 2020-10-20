import './AddHoldingForm.css';
import {Field, Form, Formik} from 'formik';
import API from '../api';
import Button from '@material-ui/core/Button';
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
        initialValues={{symbol: '', currency: '', exchange: ''}}
        onSubmit={async (values, actions) => {
          try {
            const instrument = await API.createInstrument({
              symbol: values.symbol,
              name: values.symbol,
              currency: values.currency,
              exchange: values.exchange,
              dataSource: 'FI',
              isin: 'placeholder',
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
            <Field component={TextField} name="symbol" label="Ticker Symbol" />
            <Field component={TextField} name="exchange" label="Exchange" />
            <Field component={TextField} name="currency" label="Currency" />
            <Button
              variant="outlined"
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
