import {API_BASE, FX_API_BASE} from './settings';
import {
  CreateDividendData,
  CreateHoldingData,
  CreateInstrumentData,
  CreateTradeData,
  Currency,
  Dividend,
  Holding,
  Trade,
} from './types';

/** Static methods for calling APIs. */
export class API {
  /** Creates a dividend on the API. */
  static createDividend(data: CreateDividendData): Promise<Dividend> {
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
  static createTrade(data: CreateTradeData): Promise<Trade> {
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
