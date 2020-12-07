import {Holding, Trade} from '../../api';
import {setHoldingPerformance, TEST_ONLY} from './performance';

const {setBuyTradePerformance, setSellTradePerformance} = TEST_ONLY;

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
          category: 'BUY',
          date: '2018-03-04',
          broker: 'Freetrade',
          priceCurrency: 'USD',
          paymentCurrency: 'GBP',
          quantity: 0.07184546,
          unitPrice: 896.09,
          fee: 0,
          tax: 0,
          fxRate: 1.2896,
        },
        {
          id: 12,
          holding: 1,
          category: 'BUY',
          date: '2020-09-08',
          broker: 'Trading 212',
          priceCurrency: 'USD',
          paymentCurrency: 'GBP',
          quantity: 0.03161908,
          unitPrice: 1040.28,
          fee: 0,
          tax: 0,
          fxRate: 1.3157,
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

test('set buy trade performance', () => {
  const t = {
    category: 'BUY',
    quantity: 5,
    unitPrice: 50,
    fee: 2,
    tax: 1,
    fxRate: 1.72,
  } as Trade;
  const h = {
    bidPrice: 60,
    currency: 'CAD',
  } as Holding;

  setBuyTradePerformance(t, h);

  expect(t.performance).toEqual({
    pricePaid: 148.34883720930233,
    currentValue: 174,
    valueChange: 25.65116279069767,
    percentChange: 17.2911114594764,
  });
});

test('set sell trade performance', () => {
  const t = {
    category: 'SELL',
    date: '2020-09-10',
    quantity: 5,
    unitPrice: 50,
    fee: 2,
    tax: 1,
    fxRate: 1.72,
  } as Trade;
  const prevBuyTrades = [
    {
      category: 'BUY',
      date: '2020-09-08',
      quantity: 2,
      unitPrice: 30,
      performance: {
        pricePaid: 60,
        currentValue: 120,
        valueChange: 60,
        percentChange: 100,
      },
    },
    {
      category: 'BUY',
      date: '2020-09-09',
      quantity: 3,
      unitPrice: 40,
      performance: {
        pricePaid: 120,
        currentValue: 180,
        valueChange: 60,
        percentChange: 50,
      },
    },
  ] as Trade[];
  const h = {
    bidPrice: 60,
    currency: 'CAD',
    trades: [...prevBuyTrades, t],
  } as Holding;

  setSellTradePerformance(t, h);

  expect(t.performance).toEqual({
    pricePaid: 180,
    currentValue: 142.34883720930233,
    valueChange: -37.65116279069767,
    percentChange: -20.917312661498705,
  });
});
