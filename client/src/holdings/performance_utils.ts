import {Holding, Performance, Trade} from '../api';

/**
 * Gets the total performance from all the given holdings.
 * Assumes performance for the holdings and their trades has already been
 * calculated.
 */
export function getTotalPerformance(holdings: Holding[]): Performance {
  let pricePaid = 0;
  let currentValue = 0;
  for (const holding of holdings) {
    pricePaid += holding.performance?.pricePaid ?? 0;
    currentValue += holding.performance?.currentValue ?? 0;
  }
  const valueChange = currentValue - pricePaid;
  const percentChange = (valueChange / pricePaid) * 100;
  return {pricePaid, currentValue, valueChange, percentChange};
}

/**
 * Formats a monetary value in the given currency in the current
 * user's locale format.
 *
 * Currently only supports the GB locale.
 */
export function formatValue(value: number, currency: string) {
  if (!currency) return '';
  return new Intl.NumberFormat('gb-GB', {style: 'currency', currency}).format(
    value,
  );
}

/**
 * Sets the current performance data for the given holding and its trades
 * from its existing data.
 */
export function setHoldingPerformance(holding: Holding) {
  if (!holding.trades.length || !holding.bidPrice) {
    holding.performance = undefined;
  }
  let pricePaid = 0;
  let currentValue = 0;
  for (const trade of holding.trades) {
    setTradePerformance(trade, holding);
    pricePaid += trade.performance?.pricePaid ?? 0;
    currentValue += trade.performance?.currentValue ?? 0;
  }
  const valueChange = currentValue - pricePaid;
  const percentChange = (valueChange / pricePaid) * 100;
  holding.performance = {pricePaid, currentValue, valueChange, percentChange};
}

/**
 * Sets the current performance data for the given trade from
 * the data of itself and its parent holding.
 */
function setTradePerformance(trade: Trade, holding: Holding) {
  const pricePaid = calculateTradePrice(trade);
  const currentValue = calculateTradeCurrentValue(trade, holding);
  const valueChange = currentValue - pricePaid;
  const percentChange = (valueChange / pricePaid) * 100;
  trade.performance = {pricePaid, currentValue, valueChange, percentChange};
}

/**
 * Calculates the total price of a trade in the user's currency
 * including fees and tax.
 */
function calculateTradePrice(t: Trade): number {
  const unitPriceInUsersCurrency = t.unitPrice * (1 / t.fxRate);
  return t.quantity * unitPriceInUsersCurrency + t.fee + t.tax + t.fxFee;
}

/**
 * Calculates the current value of the given buy trade in the given holding.
 * Takes into account any stock splits since the trade was made.
 */
function calculateTradeCurrentValue(t: Trade, h: Holding) {
  let value = t.quantity * getHoldingPriceInUsersCurrency(h);
  for (const s of h.splits) {
    if (t.date <= s.date) value *= s.ratio;
  }
  return value;
}

/** Gets the price of a holding in the user's currency. */
function getHoldingPriceInUsersCurrency(h: Holding) {
  // For now assume user's currency is always GBP and the only other holding
  // currencies are CAD, GBX or USD.
  let multiplier = 1;
  // Provide dummy exchange rates.
  switch (h.currency) {
    case 'CAD':
      multiplier = 0.58;
      break;
    case 'GBX':
      multiplier = 0.01;
      break;
    case 'USD':
      multiplier = 0.76;
      break;
  }
  return h.bidPrice * multiplier;
}
