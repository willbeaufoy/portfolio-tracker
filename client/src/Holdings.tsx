import React from 'react';
import Collapse from '@material-ui/core/Collapse';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import AddTrade from './AddTrade';
import {HoldingData} from './App';
import './Holdings.css';

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
                  <List component="div">
                    <ListItem className="trade">
                      <div>Date</div>
                      <div>Price</div>
                      <div>Fee</div>
                    </ListItem>
                    {h.trades.map((t) => (
                      <ListItem className="trade">
                        <div>{t.date}</div>
                        <div>{t.price}</div>
                        <div>{t.fee}</div>
                      </ListItem>
                    ))}
                    <ListItem className="trade">
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
