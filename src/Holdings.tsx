import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import {HoldingData} from './App';
import './Holdings.css';

type HoldingsProps = {
  holdings: HoldingData[];
};

/** Display of all the user's holdings with option to add more. */
const Holdings = (props: HoldingsProps) => (
  <div className="Holdings">
    <h2>Holdings</h2>
    <div className="Holdings-Holdings">
      <List>
        {props.holdings.map((h) => (
          <ListItem>
            <div className="Holding">
              <div>{h.symbol}</div>
              <div>{h.price}</div>
            </div>
          </ListItem>
        ))}
      </List>
    </div>
  </div>
);

export default Holdings;
