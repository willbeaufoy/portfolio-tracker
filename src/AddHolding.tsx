import React from 'react';
import {Formik, Form, Field} from 'formik';
import {API, graphqlOperation} from 'aws-amplify';
import {createHolding} from './graphql/mutations';
import './AddHolding.css';

type AddHoldingProps = {
  username: string;
};

/** Form to add a holding. */
const AddHolding = (props: AddHoldingProps) => (
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
          API.graphql(graphqlOperation(createHolding, {input}));
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

export default AddHolding;
