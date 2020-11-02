import React from 'react';
import {Performance} from '../api';

interface PerformanceDisplayProps {
  performance: Performance;
}

/** Displays of all the user's holdings with the option to add more. */
export default function PerformanceDisplay(props: PerformanceDisplayProps) {
  const {valueChange, percentChange} = props.performance;
  return (
    <div className={getPerfClass(valueChange)}>
      {getPerfSign(valueChange)}
      {Math.abs(percentChange).toFixed(2)}% (£
      {Math.abs(valueChange).toFixed(2)})
    </div>
  );
}

/** Gets the class name for a performance number. */
function getPerfClass(perf: number) {
  if (perf > 0) return 'positive';
  if (perf < 0) return 'negative';
  return '';
}

/** Gets the sign (+/-) for a performance number. */
export function getPerfSign(perf: number) {
  if (perf > 0) return '+';
  if (perf < 0) return '-';
  return '';
}
