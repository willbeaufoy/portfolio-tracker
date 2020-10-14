import API from './api';
import {HOLDING_1, HOLDING_2} from './test_utils';

test('applies prices from external APIs to holdings', async () => {
  // Test one US and one non-US holding as they are treated differently.
  const holdings = [HOLDING_1, HOLDING_2];
  expect(holdings[0].price).toBe(0);
  expect(holdings[1].price).toBe(0);

  await API.applyPrices(holdings);

  expect(holdings[0].price).toBe(3482.74);
  expect(holdings[1].price).toBe(3.47);
});
