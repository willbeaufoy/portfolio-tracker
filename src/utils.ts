export const MS_EOD_LATEST_BASE_URL =
  'https://api.marketstack.com/v1/eod/latest/';

/** Builds a request to fetch the latest EOD prices for the provided symbols. */
export function buildEodRequest(symbols: string[]): string {
  return `${MS_EOD_LATEST_BASE_URL}?access_key=${
    process.env.REACT_APP_MARKETSTACK_KEY
  }&symbols=${symbols.join()}`;
}
