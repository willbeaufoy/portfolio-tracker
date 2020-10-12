import {rest} from 'msw';
import {MS_EOD_LATEST_BASE_URL} from '../settings';

const holdingsBySymbol = new Map([
  ['AMZN', {close: 3482.74}],
  ['ASC.XLON', {close: 52.68}],
  ['BOO.XLON', {close: 3.47}],
  ['TSLA', {close: 442.3}],
]);

export const handlers = [
  rest.get(MS_EOD_LATEST_BASE_URL, (req, res, ctx) => {
    const symbols = req.url.searchParams.get('symbols')!.split(',');
    const data = symbols.map((s) => holdingsBySymbol.get(s) ?? {close: 0});
    return res(ctx.json({data}));
  }),
  // rest.post('https://cognito-idp.eu-west-2.amazonaws.com/', (req, res, ctx) => {
  //   console.log('in cognito');
  // }),
];
