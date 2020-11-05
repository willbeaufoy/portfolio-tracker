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
  return (
    <div className={getPerfClass(valueChange)}>
      {getPerfSign(valueChange)}
      {Math.abs(percentChange).toFixed(2)}% (
      {formatValue(valueChange, user.currency)})
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
