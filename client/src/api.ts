import {API_BASE} from './settings';

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

/**
 * A holding as displayed to the user.
 * Made up of data from multiple API calls.
 */
export interface Holding {
  id: number;
  username: string;
  name: string;
  symbol: string;
  price: number;
  currency: string;
  exchange: string;
  trades: Trade[];
  splits: InstrumentSplit[];
  performance?: Performance;
}

type CreateHoldingData = {
  instrument: number;
  username: string;
};

type CreateInstrumentData = {
  name: string;
  symbol: string;
  currency: string;
  exchange: string;
  dataSource: string;
  isin: string;
};

interface InstrumentSplit {
  date: string;
  ratio: number;
}

/** A trade as returned from the API. */
export interface Trade {
  id: number;
  holding: number;
  date: string;
  broker: string;
  quantity: number;
  unitPrice: number;
  fee: number;
  tax: number;
  fxRate: number;
  fxFee: number;
  performance?: Performance;
}

type CreateTradeData = Omit<Trade, 'id'>;

/** Static methods for calling APIs. */
export default class API {
  /** Creates a holding on the API. */
  static createHolding(data: CreateHoldingData) {
    return fetch(`${API_BASE}holdings/`, {
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

  /** Deletes a holding on the API. */
  static deleteHolding(id: number) {
    return fetch(`${API_BASE}holdings/${id}`, {
      method: 'DELETE',
    }).then((res) => {
      if (!res.ok) throw new Error(res.statusText);
      return res;
    });
  }

  /**
   * Lists holdings for the given username on the API
   * and converts them such that they satisfy the Holding interface.
   */
  static async listHoldings(username: string): Promise<Holding[]> {
    const res = await fetch(`${API_BASE}holdings/?username=${username}`);
    const data = await res.json();
    const holdings: Holding[] = [];
    for (const d of data) {
      holdings.push({
        id: d.id,
        username: d.username,
        name: d.instrument.name,
        symbol: d.instrument.symbol,
        currency: d.instrument.currency,
        exchange: d.instrument.exchange,
        price: d.instrument.latestPrice,
        splits: d.instrument.splits,
        trades: d.trades,
      });
    }
    return holdings;
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
}
