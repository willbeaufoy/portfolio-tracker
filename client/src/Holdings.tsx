import './Holdings.css';
import AddTrade from './AddTrade';
import Collapse from '@material-ui/core/Collapse';
import {HoldingData} from './App';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Paper from '@material-ui/core/Paper';
import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

type HoldingsProps = {
  holdings: HoldingData[];
};

/** Displays of all the user's holdings (and their trades) with option to add more. */
export default function Holdings(props: HoldingsProps) {
  const [open, setOpen] = React.useState(props.holdings.map(() => false));
  const handleClick = (i: number) => {
    open[i] = !open[i];
    setOpen([...open]);
  };
  return (
    <div className="Holdings">
      <h2>Holdings</h2>
      {Boolean(props.holdings.length) && (
        <div className="Holdings-Holdings">
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
                  <TableContainer component={Paper}>
                    <Table size="small" aria-label="Trades table">
                      <TableHead>
                        <TableRow>
                          <TableCell>Date</TableCell>
                          <TableCell align="right">Price</TableCell>
                          <TableCell align="right">Fee</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {h.trades.map((t, i) => (
                          <TableRow key={i}>
                            <TableCell component="th" scope="row">
                              {t.date}
                            </TableCell>
                            <TableCell align="right">{t.price}</TableCell>
                            <TableCell align="right">{t.fee}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
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
