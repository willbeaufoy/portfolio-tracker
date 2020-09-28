import React from 'react';
import {Formik, Form, Field} from 'formik';
import {API, graphqlOperation} from 'aws-amplify';
import {createTrade} from './graphql/mutations';
import {HoldingData} from './App';
import './AddHolding';

type AddTradeProps = {
  holding: HoldingData;
};

/** Form to add a trade. */
export default function AddTrade(props: AddTradeProps) {
  return (
    <div>
      <Formik
        initialValues={{timestamp: 0, shares: 0, price: 0}}
        onSubmit={(values, {setSubmitting}) => {
          setTimeout(() => {
            const input = {
              holdingId: props.holding.id,
              date: values.timestamp,
              shares: values.shares,
              price: values.price,
            };
            API.graphql(graphqlOperation(createTrade, {input}));
            setSubmitting(false);
          }, 400);
        }}
      >
        {({isSubmitting}) => (
          <Form className="AddTrade-Form">
            <Field type="number" name="timestamp" placeholder="Timestamp" />
            <Field type="number" name="shares" placeholder="Shares" />
            <Field type="number" name="price" placeholder="Price" />
            <button type="submit" disabled={isSubmitting}>
              Add
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
