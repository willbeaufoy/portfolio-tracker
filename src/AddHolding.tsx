import React from 'react';
import {Formik, Form, Field} from 'formik';
import {API, graphqlOperation} from 'aws-amplify';
import {createHolding} from './graphql/mutations';
import './AddHolding';

type AddHoldingProps = {
  username: string;
};

/** Form to add a holding. */
const AddHolding = (props: AddHoldingProps) => (
  <div>
    <Formik
      initialValues={{symbol: ''}}
      onSubmit={(values, {setSubmitting}) => {
        setTimeout(() => {
          const input = {
            username: props.username,
            symbol: values.symbol,
            name: values.symbol,
          };
          API.graphql(graphqlOperation(createHolding, {input}));
          setSubmitting(false);
        }, 400);
      }}
    >
      {({isSubmitting}) => (
        <Form className="AddHolding-Form">
          <Field
            type="text"
            name="symbol"
            placeholder="Add Holding (Ticker symbol)"
          />
          <button type="submit" disabled={isSubmitting}>
            Add
          </button>
        </Form>
      )}
    </Formik>
  </div>
);

export default AddHolding;