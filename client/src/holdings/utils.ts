import {Holding, Trade} from '../api';

/** Calculates the % performance of a buy trade in the given holding. */
export function calculatePerformance(t: Trade, h: Holding) {
  const perf = ((h.price - t.unitPrice) / t.unitPrice) * 100;
  return perf.toFixed(2);
}
