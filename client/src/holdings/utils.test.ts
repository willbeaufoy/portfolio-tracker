import {calculateTradePerformance, calculateTradePrice} from './utils';
import {HOLDING_WITH_TRADES} from '../test_fixtures';

test('calculates % performance of a trade', () => {
  const perf = calculateTradePerformance(
    HOLDING_WITH_TRADES.trades![0],
    HOLDING_WITH_TRADES,
  );
  expect(perf).toBe(7.138265502907015);
});

test('calculates total price of a trade', () => {
  const price = calculateTradePrice(HOLDING_WITH_TRADES.trades![1]);
  expect(price).toBe(8701.050000000001);
});
