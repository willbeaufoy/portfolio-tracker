import React from 'react';
import './Holding.css';

type HoldingProps = {
  code: string;
};

/** An individual asset holding. */
const Holding = (props: HoldingProps) => (
  <div className="Holding">{props.code}</div>
);

export default Holding;
