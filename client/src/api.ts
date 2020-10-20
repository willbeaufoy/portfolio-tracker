import {
  API_BASE,
  MS_EOD_LATEST_BASE_URL,
  MS_INTRADAY_LATEST_BASE_URL,
} from './settings';

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
  trades?: Trade[];
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
}

type CreateTradeData = Omit<Trade, 'id'>;

const USA_EXCHANGES = ['NASDAQ'];

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
        price: 0,
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

  /**
   * Fetches the latest prices for the given holdings from the API and
   * applies them to the holdings. For US holdings (i.e. those priced in USD)
   * this is (almost) live data, for all other holdings it is EOD.
   */
  static async applyPrices(holdings: Holding[]) {
    const holdingsBySymbol = new Map(holdings.map((h) => [h.symbol, h]));
    const urls = buildFetchPricesUrls(holdings);
    try {
      const res = await Promise.all(
        urls.map((url) => fetch(url).then((res) => res.json())),
      );
      for (const r of res) {
        for (const d of r.data) {
          const h = holdingsBySymbol.get(d.symbol);
          if (!h) continue;
          // Stocks on the LSE are priced in GBX (pence).
          h.price = h.exchange === 'LSE' ? d.close / 100 : d.close;
        }
      }
    } catch (err) {
      console.error(err);
    }
  }
}

/**
 * Builds URLs to get price data for holdings.
 * Uses the intraday API for US stocks and the EOD API for others
 * (as only US stocks have intraday data).
 */
function buildFetchPricesUrls(holdings: Holding[]): string[] {
  const usSymbols = [];
  const otherSymbols = [];
  for (const h of holdings) {
    if (USA_EXCHANGES.includes(h.exchange)) {
      usSymbols.push(h.symbol);
    } else {
      otherSymbols.push(h.symbol);
    }
  }
  const reqs = [];
  if (usSymbols.length) {
    reqs.push(
      combineFetchPricesUrlParts(MS_INTRADAY_LATEST_BASE_URL, usSymbols),
    );
  }
  if (otherSymbols.length) {
    reqs.push(combineFetchPricesUrlParts(MS_EOD_LATEST_BASE_URL, otherSymbols));
  }
  return reqs;
}

/** Builds a URL to fetch prices for the provided symbols. */
function combineFetchPricesUrlParts(url: string, symbols: string[]): string {
  return `${url}?access_key=${
    process.env.REACT_APP_MARKETSTACK_KEY
  }&symbols=${symbols.join()}`;
}
