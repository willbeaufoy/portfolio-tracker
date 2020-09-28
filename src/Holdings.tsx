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

/** Display of all the user's holdings with option to add more. */
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
                  <div className="Holding">
                    <div>{h.symbol}</div>
                    <div>{h.price}</div>
                  </div>
                </ListItem>
                <Collapse in={open[i]} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    <ListItem button>
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
