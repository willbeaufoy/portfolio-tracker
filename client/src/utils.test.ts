import {buildEodRequest} from './utils';

test('builds latest EOD URL', () => {
  expect(buildEodRequest(['AMZN', 'TSLA'])).toBe(
    'https://api.marketstack.com/v1/eod/latest/?access_key=MS_KEY&symbols=AMZN,TSLA',
  );
});
