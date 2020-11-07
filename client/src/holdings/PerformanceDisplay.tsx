import React from 'react';
import {Performance, User} from '../api';
import {formatValue} from './performance_utils';

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
  return (
    <div style={getPerfStyle(valueChange)}>
      {getPerfSign(valueChange)}
      {Math.abs(percentChange).toFixed(2)}% (
      {formatValue(valueChange, user.currency)})
    </div>
  );
}

/** Gets the styles for a performance number. */
function getPerfStyle(perf: number) {
  if (perf > 0) return {color: '#04ae49'}; // Green.
  if (perf < 0) return {color: '#de422a'}; // Red.
  return {};
}

/** Gets the sign (+/-) for a performance number. */
export function getPerfSign(perf: number) {
  if (perf > 0) return '+';
  if (perf < 0) return '-';
  return '';
}
