import {Holding, Trade} from '../api';

/** Calculates the % performance of a holding from all its trades. */
export function calculateHoldingPerformance(h: Holding): number {
  if (!h.trades?.length) return 0;
  const currentValue = h.trades.reduce(
    (acc, t) => acc + t.quantity * h.price,
    0,
  );
  const totalPaid = h.trades.reduce(
    (acc, t) => acc + calculateTradePrice(t),
    0,
  );
  return ((currentValue - totalPaid) / totalPaid) * 100;
}

/** Calculates the % performance of a buy trade in the given holding. */
export function calculateTradePerformance(t: Trade, h: Holding): number {
  const currentValue = t.quantity * h.price;
  const totalPaid = calculateTradePrice(t);
  return ((currentValue - totalPaid) / totalPaid) * 100;
}

/** Calculates the total price of a trade including fees and tax */
export function calculateTradePrice(t: Trade): number {
  return t.quantity * t.unitPrice + t.fee + t.tax + t.fxFee;
}

/** Gets the class name for a performance number. */
export function getPerfClass(perf: number) {
  if (perf > 0) return 'positive';
  if (perf < 0) return 'negative';
  return '';
}
