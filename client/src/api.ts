import {API_BASE, MS_EOD_LATEST_BASE_URL} from './settings';
import {
  CreateHoldingData,
  CreateTradeData,
  Holding,
} from './holdings/HoldingsList';

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

  static listHoldings(username: string) {
    return fetch(`${API_BASE}holdings/?username=${username}`).then((res) =>
      res.json(),
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

  /**
   * Fetches the latest EOD prices for the given holdings from the API and
   * applies them to the holdings.
   */
  static async applyPrices(holdings: Holding[]) {
    const symbols = holdings.map((h) => h.symbol);
    try {
      const res = await fetch(buildEodRequest(symbols));
      const resJson = await res.json();
      for (const [i, stock] of resJson.data.entries()) {
        holdings[i].price = stock.close;
      }
    } catch (err) {
      console.error(err);
    }
  }
}

/** Builds a request to fetch the latest EOD prices for the provided symbols. */
export function buildEodRequest(symbols: string[]): string {
  return `${MS_EOD_LATEST_BASE_URL}?access_key=${
    process.env.REACT_APP_MARKETSTACK_KEY
  }&symbols=${symbols.join()}`;
}
