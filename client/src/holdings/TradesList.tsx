import './TradesList.css';

import {format} from 'date-fns';
import React from 'react';

import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import DeleteIcon from '@material-ui/icons/Delete';

import {Holding, Trade, User} from '../api';
import {PerformanceDisplay} from './PerformanceDisplay';
import {formatValue, titleCase} from './utils/display';
import {isBuyTrade} from './utils/performance';

export type TradesListProps = {
  holding: Holding;
  user: User;
  onDeleteTradeClicked: Function;
};

/** Displays a holding's trades with the option to delete them. */
export function TradesList({
  holding: h,
  user,
  onDeleteTradeClicked,
}: TradesListProps) {
  return (
    <div>
      {Boolean(h.trades.length) && (
        <TableContainer>
          <Table size='small' aria-label='Trades table'>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell align='right'>Type</TableCell>
                <TableCell align='right'>Broker</TableCell>
                <TableCell align='right'>Quantity</TableCell>
                <TableCell align='right'>Unit Price</TableCell>
                <TableCell align='right'>Cost/Sale Price</TableCell>
                <TableCell align='right'>Performance/Profit</TableCell>
                <TableCell> </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {h.trades.map((t, i) => {
                return (
                  <TableRow key={i}>
                    <TableCell component='th' scope='row'>
                      {format(new Date(t.date), 'dd MMM yyyy')}
                    </TableCell>
                    {/* Category */}
                    <TableCell align='right'>{titleCase(t.category)}</TableCell>
                    {/* Broker */}
                    <TableCell align='right'>{t.broker}</TableCell>
                    {/* Quantity */}
                    <TableCell align='right'>{t.quantity}</TableCell>
                    {/* Unit Price */}
                    <TableCell align='right'>
                      {formatValue(t.unitPrice, t.priceCurrency)}
                    </TableCell>
                    {/* Cost/Sale Price */}
                    {/* Assumes the trade was made in the user's primary currency.
                    This may not always be the case. */}
                    <TableCell align='right'>
                      {tradeCostOrSalePrice(t, user)}
                    </TableCell>
                    {/* Performance/Profit */}
                    <TableCell align='right'>
                      {t.performance && (
                        <PerformanceDisplay
                          performance={t.performance}
                          user={user}
                        />
                      )}
                    </TableCell>
                    <TableCell align='right'>
                      <IconButton
                        onClick={() => {
                          onDeleteTradeClicked(t.id, i);
                        }}
                        aria-label='delete'>
                        <DeleteIcon fontSize='small' />
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

/** Gets a trade's cost if it is a buy trade, or sale price if it is a sell trade. */
function tradeCostOrSalePrice(t: Trade, u: User): string {
  const val = isBuyTrade(t)
    ? t.performance?.pricePaid
    : t.performance?.currentValue;
  const res = formatValue(val ?? 0, u.currency);
  return isBuyTrade(t) ? '-' + res : res;
}
