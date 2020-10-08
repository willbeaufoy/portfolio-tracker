import {Field, Form, Formik} from 'formik';
import React from 'react';
import {createHolding} from '../api_utils';
import './AddHolding.css';

type AddHoldingProps = {
  username: string;
};

/** Form to add a holding. */
export default function AddHolding(props: AddHoldingProps) {
  return (
    <div>
      <Formik
        initialValues={{symbol: '', currency: ''}}
        onSubmit={(values, {setSubmitting}) => {
          setTimeout(() => {
            const input = {
              username: props.username,
              symbol: values.symbol,
              name: values.symbol,
              currency: values.currency,
            };
            createHolding(input);
            setSubmitting(false);
          }, 400);
        }}
      >
        {({isSubmitting}) => (
          <Form className="AddHolding-Form">
            <Field type="text" name="symbol" placeholder="Ticker Symbol" />
            <Field type="text" name="currency" placeholder="Currency" />
            <button type="submit" disabled={isSubmitting}>
              Add
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
