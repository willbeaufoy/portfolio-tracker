import {HOLDING_WITH_TRADES} from '../test_utils';
import {calculatePerformance} from './utils';

test('calculates % performance of a trade', () => {
  const perf = calculatePerformance(
    HOLDING_WITH_TRADES.trades[0],
    HOLDING_WITH_TRADES,
  );
  expect(perf).toBe('7.14');
});
