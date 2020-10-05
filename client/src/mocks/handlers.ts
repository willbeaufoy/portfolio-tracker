import {rest} from 'msw';
import {MS_EOD_LATEST_BASE_URL} from '../utils';

const holdingsData = {
  data: [
    {
      symbol: 'AMZN',
      close: 3000,
    },
    {
      symbol: 'TSLA',
      close: 400,
    },
  ],
};

export const handlers = [
  rest.get(MS_EOD_LATEST_BASE_URL, (req, res, ctx) => {
    return res(ctx.json(holdingsData));
  }),
  // rest.post('https://cognito-idp.eu-west-2.amazonaws.com/', (req, res, ctx) => {
  //   console.log('in cognito');
  // }),
];
