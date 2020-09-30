import React from 'react';
import {Formik, Form, Field} from 'formik';
import DatePicker from 'react-datepicker';
import {API, graphqlOperation} from 'aws-amplify';
import {createTrade} from './graphql/mutations';
import {HoldingData} from './App';
import './AddTrade.css';
import 'react-datepicker/dist/react-datepicker.css';

type AddTradeProps = {
  holding: HoldingData;
};

/** Form to add a trade. */
export default function AddTrade(props: AddTradeProps) {
  return (
    <Formik
      initialValues={{
        date: new Date(),
        shares: undefined,
        price: undefined,
      }}
      onSubmit={(values, {setSubmitting}) => {
        setTimeout(() => {
          const input = {
            holdingID: props.holding.id,
            date: values.date.getTime(),
            shares: values.shares,
            price: values.price,
            fee: 0,
          };
          console.log(input);
          API.graphql(graphqlOperation(createTrade, {input}));
          setSubmitting(false);
        }, 400);
      }}
    >
      {({isSubmitting, values, setFieldValue}) => (
        <Form className="AddTrade-Form">
          <div className="form-row">
            <DatePicker
              selected={values.date}
              dateFormat="MMMM d, yyyy"
              className="form-control"
              name="date"
              onChange={(date) => {
                setFieldValue('date', date);
              }}
            />
          </div>
          <div className="form-row">
            <Field type="number" name="shares" placeholder="Shares" />
            <Field type="number" name="price" placeholder="Price" />
            <button type="submit" disabled={isSubmitting}>
              Add
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
