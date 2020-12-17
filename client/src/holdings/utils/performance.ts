import round from 'lodash.round';
import {InstrumentSplit, Holding, Performance, Trade} from '../../api';

/** Supported currencies */
export const CURRENCIES = ['CAD', 'GBP', 'GBX', 'USD'];

/**
 * Gets the total performance from all the given holdings.
 * Assumes performance for the holdings and their trades has already been
 * calculated.
 */
export function getTotalPerformance(holdings: Holding[]): Performance {
  let pricePaid = 0;
  let pricePaidForPerf = 0;
  let currentValue = 0;
  let currentValueForPerf = 0;
  for (const holding of holdings) {
    pricePaid += holding.performance?.pricePaid ?? 0;
    pricePaidForPerf += holding.performance?.pricePaidForPerf ?? 0;
    currentValue += holding.performance?.currentValue ?? 0;
    currentValueForPerf += holding.performance?.currentValueForPerf ?? 0;
  }
  const valueChange = currentValueForPerf - pricePaidForPerf;
  const percentChange = (valueChange / pricePaidForPerf) * 100;
  return {
    pricePaid,
    pricePaidForPerf: pricePaid,
    currentValue,
    currentValueForPerf: currentValue,
    valueChange,
    percentChange,
  };
}

/**
 * Sets the current performance data for the given holding and its trades
 * from its existing data.
 */
export function setHoldingPerformance(h: Holding) {
  if (!h.trades.length || !h.bidPrice) {
    h.performance = undefined;
  }
  h.trades.sort((a, b) => {
    if (a.date < b.date) return -1;
    if (a.date > b.date) return 1;
    return 0;
  });
  for (const t of h.trades) {
    isBuyTrade(t)
      ? setBuyTradePerformance(t, h)
      : setSellTradePerformance(t, h);
  }
  // Calculate price paid and current value for current holdings (i.e. buy trades only)
  // and including sell trades for performance calculations.
  let pricePaid = 0;
  let pricePaidForPerf = 0;
  let currentValue = 0;
  let currentValueForPerf = 0;
  for (const t of h.trades) {
    pricePaidForPerf += t.performance?.pricePaidForPerf ?? 0;
    currentValueForPerf += t.performance?.currentValueForPerf ?? 0;
    if (isBuyTrade(t)) {
      pricePaid += t.performance?.pricePaidForPerf ?? 0;
      currentValue += t.performance?.currentValueForPerf ?? 0;
    }
  }
  const valueChange = currentValueForPerf - pricePaidForPerf;
  const percentChange = (valueChange / pricePaidForPerf) * 100;
  h.performance = {
    pricePaid,
    pricePaidForPerf,
    currentValue,
    currentValueForPerf,
    valueChange,
    percentChange,
  };
}

/**
 * Sets the current performance data for the given buy trade from
 * the data of itself and its parent holding.
 */
function setBuyTradePerformance(t: Trade, h: Holding) {
  if (!isBuyTrade(t)) throw new Error('Not a buy trade');
  const pricePaid = getBuyTradePrice(t);
  const currentValue = getBuyTradeCurrentValue(t, h);
  const valueChange = currentValue - pricePaid;
  const percentChange = (valueChange / pricePaid) * 100;
  t.performance = {
    pricePaid,
    pricePaidForPerf: pricePaid,
    currentValue,
    currentValueForPerf: currentValue,
    valueChange,
    percentChange,
    quantityForPerf: t.quantity,
  };
}

/**
 * Calculates the total price of a trade in the user's currency
 * including fees and tax.
 */
function getBuyTradePrice(t: Trade): number {
  const unitPriceInUsersCurrency = t.unitPrice * (1 / t.fxRate);
  return t.quantity * unitPriceInUsersCurrency + t.fee + t.tax;
}

/**
 * Calculates the current value of the given buy trade in the given holding.
 * Takes into account any stock splits since the trade was made.
 */
function getBuyTradeCurrentValue(t: Trade, h: Holding) {
  let value = t.quantity * getHoldingPriceInUsersCurrency(h);
  for (const s of h.splits ?? []) {
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

function setSellTradePerformance(t: Trade, h: Holding) {
  if (!isSellTrade(t)) throw new Error('Not a sell trade');
  // Get the buy trades prior to the sell trade that have performance figures.
  const prevBuyTrades = h.trades.filter(
    (tr) =>
      isBuyTrade(tr) && tr.performance?.pricePaidForPerf && tr.date < t.date
  );
  const cost = getSellTradeCost(t, prevBuyTrades, h.splits);
  updateBuyTradesBeforeSellTrade(prevBuyTrades, cost);
  const amountReceived = getSellTradeReceived(t);
  const profit = amountReceived - cost;
  const profitPercent = (profit / cost) * 100;
  t.performance = {
    pricePaid: cost,
    pricePaidForPerf: cost,
    currentValue: amountReceived,
    currentValueForPerf: amountReceived,
    valueChange: profit,
    percentChange: profitPercent,
  };
}

/**
 * Calculates the original cost of the units sold in a sell trade from a weighted average
 * of the given prior buy trades.
 * Limitations:
 * - Relies on buy trades earlier than the given sell trade already having had their performance calculated
 */
function getSellTradeCost(
  st: Trade,
  prevBuyTrades: Trade[],
  splits: InstrumentSplit[]
): number {
  let totalPricePaid = 0;
  let totalUnits = 0;
  for (const bt of prevBuyTrades) {
    if (!isBuyTrade(bt) || bt.date >= st.date || !bt.performance) {
      // Prevent calling function incorrectly.
      throw new Error('Not a valid buy trade');
    }
    let pricePaid = bt.performance.pricePaidForPerf;
    for (const s of splits ?? []) {
      if (bt.date <= s.date) pricePaid /= s.ratio;
    }
    totalPricePaid += pricePaid;
    totalUnits += bt.performance.quantityForPerf!;
  }
  const meanUnitCost = totalPricePaid / totalUnits;
  const cost = meanUnitCost * st.quantity;
  return roundValueInCurrency(cost, st.priceCurrency);
}

/**
 * Updates performance of buy trades prior to a sell trade.
 * This removes performance figures where the performance is accounted for
 * in the sell trade.
 */
function updateBuyTradesBeforeSellTrade(
  buyTrades: Trade[],
  sellTradeCost: number
) {
  let costRemaining = sellTradeCost;
  for (const bt of buyTrades) {
    if (!isBuyTrade(bt) || !bt.performance) {
      // Prevent calling function incorrectly.
      throw new Error('Not a valid buy trade');
    }
    const pricePaidForPerfRemaining =
      bt.performance.pricePaidForPerf - costRemaining;
    if (pricePaidForPerfRemaining > 0) {
      const divisor =
        bt.performance.pricePaidForPerf / pricePaidForPerfRemaining;
      bt.performance.pricePaidForPerf /= divisor;
      bt.performance.currentValueForPerf /= divisor;
      bt.performance.valueChange /= divisor;
      bt.performance.quantityForPerf! /= divisor;
      break;
    } else {
      costRemaining -= bt.performance.pricePaidForPerf;
      bt.performance.pricePaidForPerf = 0;
      bt.performance.currentValueForPerf = 0;
      bt.performance.valueChange = 0;
      bt.performance.percentChange = 0;
      bt.performance.quantityForPerf = 0;
    }
  }
}

/**
 * Calculates the amount received from a sell trade in the user's currency`.
 * This is the amount received minus taxes and fees.
 */
function getSellTradeReceived(t: Trade) {
  const unitPriceInUsersCurrency = t.unitPrice * (1 / t.fxRate);
  return t.quantity * unitPriceInUsersCurrency - t.fee - t.tax;
}

export function isBuyTrade(t: Trade) {
  return t.category === 'BUY';
}

function isSellTrade(t: Trade) {
  return t.category === 'SELL';
}

function roundValueInCurrency(val: number, currency: string) {
  return currency === 'GBX' ? round(val) : round(val, 2);
}

export const TEST_ONLY = {setBuyTradePerformance, setSellTradePerformance};
