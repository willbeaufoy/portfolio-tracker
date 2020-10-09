import './HoldingsList.css';
import AddTrade from './AddTrade';
import Collapse from '@material-ui/core/Collapse';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import {deleteTrade} from '../api_utils';

/** A holding as returned from the API. */
export interface Holding {
  id?: number;
  username: string;
  symbol: string;
  price?: number;
  trades?: Trade[];
}

/** A trade as returned from the API. */
export interface Trade {
  id: number;
  holding: number;
  date: string;
  quantity: number;
  unitPrice: number;
  fee: number;
  fxRate: number;
  fxFee: number;
}

export type AddTradeData = Omit<Trade, 'id'>;

type HoldingsListProps = {
  holdings: Holding[];
};

/** Displays of all the user's holdings (and their trades) with option to add more. */
export default function HoldingsList(props: HoldingsListProps) {
  const [open, setOpen] = React.useState(props.holdings.map(() => false));
  const handleClick = (i: number) => {
    open[i] = !open[i];
    setOpen([...open]);
  };
  const onDeleteTradeClicked = async (id: number) => {
    await deleteTrade(id);
  };
  return (
    <div className="HoldingsList">
      <h2>Holdings</h2>
      {Boolean(props.holdings.length) && (
        <div>
          <List>
            {props.holdings.map((h, i) => (
              <React.Fragment key={i}>
                <ListItem
                  button
                  onClick={() => {
                    handleClick(i);
                  }}
                >
                  <div className="holding">
                    <div>{h.symbol}</div>
                    <div>{h.price}</div>
                  </div>
                </ListItem>
                <Collapse in={open[i]} timeout="auto" unmountOnExit>
                  {Boolean(h.trades?.length) && (
                    <TableContainer>
                      <Table size="small" aria-label="Trades table">
                        <TableHead>
                          <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell align="right">Quantity</TableCell>
                            <TableCell align="right">Unit Price</TableCell>
                            <TableCell align="right">Fee</TableCell>
                            <TableCell align="right">Total Price</TableCell>
                            <TableCell> </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {h.trades!.map((t, i) => (
                            <TableRow key={i}>
                              <TableCell component="th" scope="row">
                                {t.date}
                              </TableCell>
                              <TableCell align="right">{t.quantity}</TableCell>
                              <TableCell align="right">{t.unitPrice}</TableCell>
                              <TableCell align="right">{t.fee}</TableCell>
                              <TableCell align="right">
                                {t.quantity * t.unitPrice + t.fee}
                              </TableCell>
                              <TableCell align="right">
                                <IconButton
                                  onClick={() => {
                                    onDeleteTradeClicked(t.id);
                                  }}
                                  aria-label="delete"
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                  <List component="div">
                    <ListItem>
                      <AddTrade holding={h}></AddTrade>
                    </ListItem>
                  </List>
                </Collapse>
              </React.Fragment>
            ))}
          </List>
        </div>
      )}
    </div>
  );
}
