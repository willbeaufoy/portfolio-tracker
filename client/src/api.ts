import {API_BASE} from './settings';

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
  currency: string;
  exchange: string;
  isin: string;
  trades: Trade[];
  splits: InstrumentSplit[];
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
  currency: string;
  exchange: string;
  dataSource: string;
  isin: string;
};

interface InstrumentSplit {
  date: string;
  ratio: number;
}

/**
 * Performance of a holding/trade in absolute value (in user's currency)
 * and in percentage terms.
 */
export interface Performance {
  pricePaid: number;
  currentValue: number;
  valueChange: number;
  percentChange: number;
}

/** A trade as returned from the API. */
export interface Trade {
  id: number;
  holding: number;
  date: string;
  broker: string;
  priceCurrency: string;
  quantity: number;
  unitPrice: number;
  paymentCurrency: string;
  fee: number;
  tax: number;
  fxRate: number;
  fxFee: number;
  performance?: Performance;
}

type CreateTradeData = Omit<Trade, 'id' | 'performance'>;

export interface User {
  username: string;
  email: string;
  currency: string;
}

/** Static methods for calling APIs. */
export default class API {
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

  /** Lists holdings for the given username on the API. */
  static listHoldings(username: string): Promise<Holding[]> {
    return fetch(`${API_BASE}holdings/?username=${username}`).then((res) =>
      res.json(),
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
}
