import {API_BASE, FX_API_BASE} from './settings';

/** Supported currencies */
export type Currency = 'CAD' | 'GBP' | 'GBX' | 'USD';
export const CURRENCIES: Currency[] = ['CAD', 'GBP', 'GBX', 'USD'];

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
type CreateHoldingData = {
  instrument: number;
  username: string;
};

type CreateInstrumentData = {
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
  USD: number;
}

export type Transaction = Dividend | Trade;

/** Static methods for calling APIs. */
export class API {
  /** Creates a dividend on the API. */
  static createDividend(data: CreateDividendData) {
    const url = new URL('/dividends/', API_BASE);
    return fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then((res) => {
      if (!res.ok) throw new Error(res.statusText);
      return res.json();
    });
  }

  /** Deletes a dividend on the API. */
  static deleteDividend(id: number) {
    const url = new URL(`/dividends/${id}`, API_BASE);
    return fetch(url.toString(), {
      method: 'DELETE',
    }).then((res) => {
      if (!res.ok) throw new Error(res.statusText);
      return res;
    });
  }

  /** Creates a holding on the API. */
  static createHolding(data: CreateHoldingData): Promise<Holding> {
    return fetch(`${API_BASE}holdings/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then((res) => res.json());
  }

  /** Deletes a holding on the API. */
  static deleteHolding(id: number) {
    return fetch(`${API_BASE}holdings/${id}`, {
      method: 'DELETE',
    }).then((res) => {
      if (!res.ok) throw new Error(res.statusText);
      return res;
    });
  }

  /** Lists holdings for the given username (and optionally symbols) on the API. */
  static listHoldings(
    username: string,
    symbols?: string[]
  ): Promise<Holding[]> {
    const url = new URL('/holdings/', API_BASE);
    const params = new URLSearchParams({username});
    if (symbols) params.append('symbols', symbols.join());
    return fetch(`${url.toString()}?${params.toString()}`).then((res) =>
      res.json()
    );
  }

  /** Creates an instrument on the API. */
  static createInstrument(data: CreateInstrumentData) {
    return fetch(`${API_BASE}instruments/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then((res) => {
      if (!res.ok) throw new Error(res.statusText);
      return res.json();
    });
  }

  /** Lists instruments by ISIN. */
  static listInstruments(isin: string) {
    return fetch(`${API_BASE}instruments/?isin=${isin}`).then((res) =>
      res.json()
    );
  }

  /** Creates a trade on the API. */
  static createTrade(data: CreateTradeData) {
    return fetch(`${API_BASE}trades/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then((res) => {
      if (!res.ok) throw new Error(res.statusText);
      return res.json();
    });
  }

  /** Deletes a trade on the API. */
  static deleteTrade(id: number) {
    return fetch(`${API_BASE}trades/${id}`, {
      method: 'DELETE',
    }).then((res) => {
      if (!res.ok) throw new Error(res.statusText);
      return res;
    });
  }

  /** Refreshes the latest prices on the API. */
  static refreshPrices() {
    return fetch(`${API_BASE}instruments/sync/`);
  }

  /** Lists FX rates in the given base currency */
  static listFxRates(base: Currency) {
    const url = new URL('/latest/', FX_API_BASE);
    const params = new URLSearchParams({base, symbols: 'CAD,USD'});
    return fetch(`${url.toString()}?${params.toString()}`).then((res) =>
      res.json()
    );
  }
}

export function isTrade(t: Trade | Dividend): t is Trade {
  return t.hasOwnProperty('category');
}
