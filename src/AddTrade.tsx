import React from 'react';
import {Formik, Form, Field} from 'formik';
import {MuiPickersUtilsProvider} from '@material-ui/pickers';
import {DatePicker} from 'formik-material-ui-pickers';
import DateFnsUtils from '@date-io/date-fns';
import {API, graphqlOperation} from 'aws-amplify';
import {createTrade} from './graphql/mutations';
import {HoldingData} from './App';
import './AddTrade.css';

type AddTradeProps = {
  holding: HoldingData;
};

/** Form to add a trade. */
export default function AddTrade(props: AddTradeProps) {
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <div>
        <Formik
          initialValues={{
            date: new Date(),
            shares: undefined,
            price: undefined,
          }}
          onSubmit={(values, {setSubmitting}) => {
            setTimeout(() => {
              const input = {
                holdingId: props.holding.id,
                date: values.date.getTime(),
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
              <Field component={DatePicker} name="date" label="Date"></Field>
              <Field type="number" name="shares" placeholder="Shares" />
              <Field type="number" name="price" placeholder="Price" />
              <button type="submit" disabled={isSubmitting}>
                Add
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </MuiPickersUtilsProvider>
  );
}
