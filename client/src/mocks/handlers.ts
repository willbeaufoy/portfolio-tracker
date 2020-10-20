import {rest} from 'msw';
import {MS_INTRADAY_LATEST_BASE_URL, MS_EOD_LATEST_BASE_URL} from '../settings';

const holdingsBySymbol = new Map([
  ['AMZN', {symbol: 'AMZN', close: 3482.74}],
  ['ASC.XLON', {symbol: 'ASC.XLON', close: 5268}],
  ['BOO.XLON', {symbol: 'BOO.XLON', close: 313.4}],
  ['JDW.XLON', {symbol: 'JDW.XLON', close: 773.5}],
  ['TSLA', {symbol: 'TSLA', close: 442.3}],
  ['YOU.XLON', {symbol: 'YOU.XLON', close: 950}],
  ['BYND', {symbol: 'BYND', close: 183.58}],
]);

export const handlers = [
  rest.get(MS_EOD_LATEST_BASE_URL, handlePricesRequest),
  rest.get(MS_INTRADAY_LATEST_BASE_URL, handlePricesRequest),
];

/**
 * Handles a request to fetch prices.
 * TODO: Type the params properly.
 */
function handlePricesRequest(req: any, res: any, ctx: any) {
  const symbols = req.url.searchParams.get('symbols')!.split(',');
  const data = symbols.map(
    (s: string) => holdingsBySymbol.get(s) ?? {close: 0},
  );
  return res(ctx.json({data}));
}
