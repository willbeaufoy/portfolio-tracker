import {Holding, Trade} from '../api';

/**
 * Performance of a holding/trade in absolute value (in user's currency)
 * and in percentage terms.
 */
interface Performance {
  currentValue: number;
  valueChange: number;
  percentChange: number;
}

/** Calculates the performance of a holding from all its trades. */
export function calculateHoldingPerformance(h: Holding): Performance | null {
  if (!h.trades?.length) return null;
  const currentValue = h.trades.reduce(
    (acc, t) => acc + calculateTradeCurrentValue(t, h),
    0,
  );
  const totalPaid = h.trades.reduce(
    (acc, t) => acc + calculateTradePrice(t),
    0,
  );
  const valueChange = currentValue - totalPaid;
  const percentChange = (valueChange / totalPaid) * 100;
  return {currentValue, valueChange, percentChange};
}

/** Calculates the performance of a buy trade in the given holding. */
export function calculateTradePerformance(t: Trade, h: Holding): Performance {
  const currentValue = calculateTradeCurrentValue(t, h);
  const totalPaid = calculateTradePrice(t);
  const valueChange = currentValue - totalPaid;
  const percentChange = (valueChange / totalPaid) * 100;
  return {currentValue, valueChange, percentChange};
}

/**
 * Calculates the current value of the given buy trade in the given holding.
 * Takes into account any stock splits since the trade was made.
 */
function calculateTradeCurrentValue(t: Trade, h: Holding) {
  let value = t.quantity * h.price;
  const split = h.splits.find((s) => t.date <= s.date);
  for (const s of h.splits) {
    if (t.date <= s.date) value *= s.ratio;
  }
  return value;
}

/** Calculates the total price of a trade including fees and tax */
export function calculateTradePrice(t: Trade): number {
  return t.quantity * t.unitPrice + t.fee + t.tax + t.fxFee;
}

/** Gets the sign (+/-) for a performance number. */
export function getPerfSign(perf: number) {
  if (perf > 0) return '+';
  if (perf < 0) return '-';
  return '';
}

/** Gets the class name for a performance number. */
export function getPerfClass(perf: number) {
  if (perf > 0) return 'positive';
  if (perf < 0) return 'negative';
  return '';
}
