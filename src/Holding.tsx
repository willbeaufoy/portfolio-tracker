import React from 'react';
import './Holding.css';

type HoldingProps = {
  name: string;
};

/** An individual asset holding. */
const Holding = (props: HoldingProps) => (
  <div className="Holding">{props.name}</div>
);

export default Holding;
