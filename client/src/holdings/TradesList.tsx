import './TradesList.css';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import {Holding, User} from './../api';
import PerformanceDisplay from './PerformanceDisplay';
import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import {format} from 'date-fns';
import {formatValue} from './performance_utils';

export type TradesListProps = {
  holding: Holding;
  user: User;
  onDeleteTradeClicked: Function;
};

/** Displays a holding's trades with the option to delete them. */
export default function TradesList({
  holding,
  user,
  onDeleteTradeClicked,
}: TradesListProps) {
  return (
    <div>
      {Boolean(holding.trades.length) && (
        <TableContainer>
          <Table size="small" aria-label="Trades table">
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell align="right">Broker</TableCell>
                <TableCell align="right">Quantity</TableCell>
                <TableCell align="right">Unit Price</TableCell>
                <TableCell align="right">Price Paid</TableCell>
                <TableCell align="right">Performance</TableCell>
                <TableCell> </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {holding.trades.map((t, i) => {
                return (
                  <TableRow key={i}>
                    <TableCell component="th" scope="row">
                      {format(new Date(t.date), 'dd MMM yyyy')}
                    </TableCell>
                    <TableCell align="right">{t.broker}</TableCell>
                    <TableCell align="right">{t.quantity}</TableCell>
                    <TableCell align="right">
                      {formatValue(t.unitPrice, holding.currency)}
                    </TableCell>
                    {/* Assumes the trade was made in the user's primary currency.
                    This may not always be the case. */}
                    <TableCell align="right">
                      {formatValue(
                        t.performance?.pricePaid ?? 0,
                        user.currency,
                      )}
                    </TableCell>
                    <TableCell align="right">
                      {t.performance && (
                        <PerformanceDisplay
                          performance={t.performance}
                          user={user}
                        />
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        onClick={() => {
                          onDeleteTradeClicked(t.id, i);
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
