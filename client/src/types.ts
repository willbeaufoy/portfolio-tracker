/** Supported currencies */
export type Currency = 'CAD' | 'EUR' | 'GBP' | 'GBX' | 'USD';

/** A dividend as returned from the API */
export interface Dividend {
  id: number;
  holding: number;
  date: string;
  broker: string;
  value: number;
}

export type CreateDividendData = Omit<Dividend, 'id'>;

/**
 * A holding as returned from the API and displayed to the user.
 * Made up of data from a holding, its trades and its instrument.
 */
export interface Holding {
  id: number;
  username: string;
  name: string;
  symbol: string;
  bidPrice: number;
  bidPriceUpdateTime: string;
  category: string;
  currency: Currency;
  exchange: string;
  isin: string;
  trades: Trade[];
  splits: InstrumentSplit[];
  dividends: Dividend[];
  performance?: Performance;
}

/** Object passed the the API to create a holding. */
export type CreateHoldingData = {
  instrument: number;
  username: string;
};

export type CreateInstrumentData = {
  name: string;
  symbol: string;
  category: string;
  currency: Currency;
  exchange: string;
  dataSource: string;
  isin: string;
};

export interface InstrumentSplit {
  date: string;
  ratio: number;
}

/**
 * Performance of a holding/trade in absolute value (in user's currency)
 * and in percentage terms. Valid for buy and sell trades.
 *
 * In the case of a sell trade, pricePaid is calculated as the weighted average of the
 * price paid for the previous buy trades that were sold, and currentValue is the amount
 * received in the sale.
 *
 * The ...forPerf variables are for calculating performance for higher up the chain, and
 * are not displayed to the user.
 */
export interface Performance {
  pricePaid: number;
  pricePaidForPerf: number;
  currentValue: number;
  currentValueForPerf: number;
  valueChange: number;
  percentChange: number;
  quantityForPerf?: number;
}

export type TradeCategory = 'BUY' | 'SELL';

/** A trade as returned from the API. */
export interface Trade {
  id: number;
  holding: number;
  date: string;
  category: TradeCategory;
  broker: string;
  priceCurrency: Currency;
  quantity: number;
  unitPrice: number;
  paymentCurrency: Currency;
  fee: number;
  tax: number;
  fxRate: number;
  performance?: Performance;
}

export type CreateTradeData = Omit<Trade, 'id' | 'performance'>;

export interface User {
  username: string;
  email: string;
  currency: string;
}

export interface FxRates {
  CAD: number;
  EUR: number;
  USD: number;
}

export type Transaction = Dividend | Trade;

export function isTrade(t: Trade | Dividend): t is Trade {
  return t.hasOwnProperty('category');
}
