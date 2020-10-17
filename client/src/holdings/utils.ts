import {Holding, Trade} from '../api';

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
