import './AddTrade.css';
import {Field, Form, Formik} from 'formik';
import React, {useState} from 'react';
import Button from '@material-ui/core/Button';
import DateFnsUtils from '@date-io/date-fns';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import {Holding} from './HoldingsList';
import {KeyboardDatePicker} from 'formik-material-ui-pickers';
import {MuiPickersUtilsProvider} from '@material-ui/pickers';
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
            quantity: '',
            unitPrice: '',
            fee: '',
            fxRate: '',
            fxFee: '',
          }}
          onSubmit={async (values, {setSubmitting}) => {
            const input = {
              holding: props.holding.id!,
              date: values.date.toISOString().split('T')[0],
              quantity: Number(values.quantity ?? 0),
              unitPrice: Number(values.unitPrice ?? 0),
              fee: Number(values.fee ?? 0),
              fxRate: Number(values.fxRate ?? 0),
              fxFee: Number(values.fxFee ?? 0),
            };
            await createTrade(input);
            setSubmitting(false);
            setOpen(false);
          }}
        >
          {({isSubmitting}) => (
            <Form className="AddTrade-form">
              <DialogTitle id="form-dialog-title">Add Trade</DialogTitle>
              <DialogContent className="DialogContent">
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <Field
                    component={KeyboardDatePicker}
                    label="Date"
                    variant="inline"
                    name="date"
                  />
                </MuiPickersUtilsProvider>
                <Field component={TextField} label="Quantity" name="quantity" />
                <Field
                  component={TextField}
                  label="Unit Price"
                  name="unitPrice"
                />
                <Field component={TextField} label="Fee" name="fee" />
                <Field component={TextField} label="FX Rate" name="fxRate" />
                <Field component={TextField} label="FX Fee" name="fxFee" />
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
