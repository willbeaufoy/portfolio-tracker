import './TradesList.css';
import {
  calculateTradePerformance,
  calculateTradePrice,
  getPerfClass,
  getPerfSign,
} from './utils';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import {Holding} from './../api';
import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import {format} from 'date-fns';

export type TradesListProps = {
  holding: Holding;
  onDeleteTradeClicked: Function;
};

/** Displays a holding's trades with the option to delete them. */
export default function TradesList(props: TradesListProps) {
  return (
    <div>
      {Boolean(props.holding.trades?.length) && (
        <TableContainer>
          <Table size="small" aria-label="Trades table">
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell align="right">Broker</TableCell>
                <TableCell align="right">Quantity</TableCell>
                <TableCell align="right">Unit Price</TableCell>
                <TableCell align="right">Total Price</TableCell>
                <TableCell align="right">Performance</TableCell>
                <TableCell> </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {props.holding.trades!.map((t, i) => {
                const {
                  value: perfValue,
                  percent: perfPercent,
                } = calculateTradePerformance(t, props.holding);
                return (
                  <TableRow key={i}>
                    <TableCell component="th" scope="row">
                      {format(new Date(t.date), 'dd MMM yyyy')}
                    </TableCell>
                    <TableCell align="right">{t.broker}</TableCell>
                    <TableCell align="right">{t.quantity}</TableCell>
                    <TableCell align="right">
                      {t.unitPrice.toFixed(2)}
                    </TableCell>
                    <TableCell align="right">
                      {calculateTradePrice(t).toFixed(2)}
                    </TableCell>
                    <TableCell
                      align="right"
                      className={getPerfClass(perfValue)}
                    >
                      {getPerfSign(perfValue)}
                      {Math.abs(perfPercent).toFixed(2)}% (£
                      {Math.abs(perfValue).toFixed(2)})
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        onClick={() => {
                          props.onDeleteTradeClicked(t.id, i);
                        }}
                        aria-label="delete"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
}
