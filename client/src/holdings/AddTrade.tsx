import {Field, Form, Formik} from 'formik';
import React, {useState} from 'react';
import Button from '@material-ui/core/Button';
import {KeyboardDatePicker} from 'formik-material-ui-pickers';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import {Holding} from './HoldingsList';
import {TextField} from 'formik-material-ui';
import {createTrade} from '../api_utils';

type AddTradeProps = {
  holding: Holding;
};

export default function AddTrade(props: AddTradeProps) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Add Trade
      </Button>
      <Dialog
        open={open}
        onClose={handleCancel}
        aria-labelledby="form-dialog-title"
      >
        <Formik
          initialValues={{
            date: new Date(),
            quantity: 0,
            unitPrice: 0,
            fee: 0,
            fxRate: 0,
            fxFee: 0,
          }}
          onSubmit={(values, {setSubmitting}) => {
            setTimeout(() => {
              const input = {
                holding: props.holding.id,
                date: values.date.toISOString().split('T')[0],
                quantity: values.quantity,
                unit_price: values.unitPrice,
                fee: values.fee,
                fxRate: values.fxRate,
                fxFee: values.fxFee,
              };
              console.log(input);
              createTrade(input);
              setSubmitting(false);
              setOpen(false);
            }, 400);
          }}
        >
          {({isSubmitting}) => (
            <Form className="AddTrade-form">
              <DialogTitle id="form-dialog-title">Add Trade</DialogTitle>
              <DialogContent>
                <Field
                  component={KeyboardDatePicker}
                  label="Date"
                  variant="inline"
                  name="date"
                />
                <Field
                  component={TextField}
                  label="Quantity"
                  type="number"
                  name="quantity"
                />
                <Field
                  component={TextField}
                  label="Unit Price"
                  type="number"
                  name="unitPrice"
                />
                <Field
                  component={TextField}
                  label="Fee"
                  type="number"
                  name="fee"
                />
                <Field
                  component={TextField}
                  label="FX Rate"
                  type="number"
                  name="fxRate"
                />
                <Field
                  component={TextField}
                  label="FX Fee"
                  type="number"
                  name="fxFee"
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCancel} color="primary">
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} color="primary">
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
