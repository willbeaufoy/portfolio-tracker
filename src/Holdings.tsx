import React from 'react';
import {HoldingData} from './App';
import Holding from './Holding';
import './Holdings.css';

type HoldingsProps = {
  holdings: HoldingData[];
};

/** Display of all the user's holdings with option to add more. */
const Holdings = (props: HoldingsProps) => {
  return (
    <div className="Holdings">
      <h2>Holdings</h2>
      <div className="Holdings-Holdings">
        {props.holdings.map((h: HoldingData) => (
          <Holding code={h.code}></Holding>
        ))}
      </div>
    </div>
  );
};

export default Holdings;
