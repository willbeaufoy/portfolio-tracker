import {Holding} from '../api';
import {setHoldingPerformance} from './utils';

describe('setHoldingPerformance', () => {
  test('with trades priced in different currency from holding', () => {
    // Note, currently the trade priceCurrency and paymentCurrency make
    // no difference to the calculation.
    const h: Holding = {
      id: 1,
      username: 'xzy',
      name: 'Shopify',
      symbol: 'SHOP',
      exchange: 'NASDAQ',
      bidPrice: 1173.49,
      bidPriceUpdateTime: '2020-11-07 12:45:50.93222',
      isin: 'CA82509L1076',
      currency: 'CAD',
      trades: [
        {
          id: 11,
          holding: 1,
          date: '2018-03-04',
          broker: 'Freetrade',
          priceCurrency: 'USD',
          paymentCurrency: 'GBP',
          quantity: 0.07184546,
          unitPrice: 896.09,
          fee: 0,
          tax: 0,
          fxRate: 1.2896,
          fxFee: 0,
        },
        {
          id: 12,
          holding: 1,
          date: '2020-09-08',
          broker: 'Trading 212',
          priceCurrency: 'USD',
          paymentCurrency: 'GBP',
          quantity: 0.03161908,
          unitPrice: 1040.28,
          fee: 0,
          tax: 0,
          fxRate: 1.3157,
          fxFee: 0,
        },
      ],
      splits: [],
    };

    setHoldingPerformance(h);

    expect(h.performance).toEqual({
      pricePaid: 74.92260460214007,
      currentValue: 70.420469765868,
      valueChange: -4.502134836272063,
      percentChange: -6.009047416570279,
    });
    expect(h.trades[0].performance).toEqual({
      pricePaid: 49.92245521975806,
      currentValue: 48.899758736132,
      valueChange: -1.0226964836260635,
      percentChange: -2.048570085594079,
    });
    expect(h.trades[1].performance).toEqual({
      pricePaid: 25.000149382382,
      currentValue: 21.520711029736,
      valueChange: -3.4794383526459995,
      percentChange: -13.917670248394657,
    });
  });
});
