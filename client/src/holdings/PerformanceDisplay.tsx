import React from 'react';
import {Performance, User} from '../api';
import {formatValue} from './utils';

interface PerformanceDisplayProps {
  performance: Performance;
  user: User;
}

/** Displays of all the user's holdings with the option to add more. */
export default function PerformanceDisplay({
  performance,
  user,
}: PerformanceDisplayProps) {
  const {valueChange, percentChange} = performance;
  if (isNaN(performance.percentChange)) return <div></div>;
  return (
    <div style={getPerfStyle(valueChange)}>
      {valueChange > 0 ? '+' : ''}
      {formatValue(valueChange, user.currency)} (
      {Math.abs(percentChange).toFixed(2)}%)
    </div>
  );
}

/** Gets the styles for a performance number. */
function getPerfStyle(perf: number) {
  if (perf > 0) return {color: '#04ae49'}; // Green.
  if (perf < 0) return {color: '#de422a'}; // Red.
  return {};
}
