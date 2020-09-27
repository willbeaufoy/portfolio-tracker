import React from 'react';
import './Holding.css';
import {HoldingData} from './App';

type HoldingProps = {
  data: HoldingData;
};

/** An individual asset holding. */
const Holding = (props: HoldingProps) => (
  <div className="Holding">
    <div>{props.data.symbol}</div>
    <div>{props.data.price}</div>
  </div>
);

export default Holding;
