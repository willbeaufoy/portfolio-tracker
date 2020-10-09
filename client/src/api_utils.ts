import {API_BASE, MS_EOD_LATEST_BASE_URL} from './settings';
import {Holding, Trade} from './holdings/HoldingsList';

/** Creates a holding on the API. */
export function createHolding(data: Holding) {
  fetch(`${API_BASE}holdings/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

export function listHoldings(username: string) {
  return fetch(`${API_BASE}holdings/?username=${username}`).then((res) =>
    res.json(),
  );
}

/** Creates a trade on the API. */
export function createTrade(data: Trade) {
  return fetch(`${API_BASE}trades/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

/**
 * Fetches the latest EOD prices for the given holdings from the API and
 * applies them to the holdings.
 */
export async function applyPrices(holdings: Holding[]) {
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

/** Builds a request to fetch the latest EOD prices for the provided symbols. */
export function buildEodRequest(symbols: string[]): string {
  return `${MS_EOD_LATEST_BASE_URL}?access_key=${
    process.env.REACT_APP_MARKETSTACK_KEY
  }&symbols=${symbols.join()}`;
}
