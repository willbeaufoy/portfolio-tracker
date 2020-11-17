import collections
import datetime

from django.forms.models import model_to_dict
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from tracker.models import Holding, Instrument, Trade


class TestInstrumentList(APITestCase):
    def setUp(self):
        self.url = reverse('instrument-list')

    def test_create_instrument(self):
        request_data = {'symbol': 'TSLA', 'name': 'Tesla', 'category': 'STOCK', 'currency': 'USD',
                        'exchange': 'NASDAQ', 'data_source': 'FI', 'isin': 'US12'}
        response = self.client.post(self.url, request_data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Instrument.objects.count(), 1)
        self.assertEqual(Instrument.objects.get(id=1).symbol, 'TSLA')


class TestHoldingList(APITestCase):
    def setUp(self):
        self.url = reverse('holding-list')
        self.instrument = Instrument.objects.create(
            symbol='AMZN', name='Amazon', category='STOCK', currency='USD', exchange='NASDAQ', data_source='FI', isin='US12')
        self.holding_dict = collections.OrderedDict(
            {'instrument': self.instrument, 'username': 'a'})
        self.holding = Holding.objects.create(**self.holding_dict)
        self.trade_dict = collections.OrderedDict(
            {'holding': self.holding, 'date': '2020-09-08', 'broker': 'Freetrade', 'price_currency': 'USD', 'quantity': 1.0, 'unit_price': 1.0,
             'payment_currency': 'USD', 'fee': 1.0, 'tax': 1.5, 'fx_rate': 1.2, 'fx_fee': 0.45})
        self.trade = Trade.objects.create(**self.trade_dict)

    def test_create_holding(self):
        request_data = {'instrument': 1, 'username': 'b'}

        response = self.client.post(self.url, request_data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Holding.objects.count(), 2)
        self.assertEqual(Holding.objects.get(id=2).username, 'b')

    def test_list_valid_username_returns_holdings(self):
        request_data = {'username': 'a'}

        response = self.client.get(self.url, request_data, format='json')

        expect_trade_dict = collections.OrderedDict(self.trade_dict)
        expect_trade_dict['id'] = self.trade.id
        expect_trade_dict.move_to_end('id', last=False)
        expect_trade_dict['holding'] = self.holding.id
        expect_holding_dict = collections.OrderedDict(
            id=self.holding.id,
            instrument=self.instrument.id,
            username=self.holding.username,
            name=self.instrument.name,
            symbol=self.instrument.symbol,
            category=self.instrument.category,
            currency=self.instrument.currency,
            exchange=self.instrument.exchange,
            isin=self.instrument.isin,
            bid_price=None,
            bid_price_update_time=None,
            splits=[],
            trades=[expect_trade_dict],
        )
        self.assertEqual(response.data, [expect_holding_dict])

    def test_list_invalid_username_returns_empty_list(self):
        request_data = {'username': 'z'}

        response = self.client.get(self.url, request_data, format='json')

        self.assertEqual(response.data, [])


class TestTradeList(APITestCase):
    def setUp(self):
        self.url = reverse('trade-list')
        Instrument.objects.create()
        self.holding = Holding.objects.create(instrument_id=1)
        self.trade_dict = collections.OrderedDict(
            {'holding': self.holding, 'date': '2020-09-08', 'broker': 'Freetrade', 'price_currency': 'USD', 'quantity': 1, 'unit_price': 1,
             'payment_currency': 'GBP', 'fee': 1, 'tax': 1.5, 'fx_rate': 1.2, 'fx_fee': 0.45})
        self.trade = Trade.objects.create(**self.trade_dict)

    def test_create_trade(self):
        request_data = {'holding': 1, 'date': '2020-09-10', 'broker': 'Freetrade', 'price_currency': 'GBP',
                        'quantity': 2, 'unit_price': 1, 'payment_currency': 'USD', 'fee': 1, 'tax': 1.5, 'fx_rate': 1.2, 'fx_fee': 0.45}
        response = self.client.post(self.url, request_data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Trade.objects.count(), 2)
        self.assertEqual(Trade.objects.get(id=2).date,
                         datetime.date(2020, 9, 10))

    def test_list_valid_holding_returns_trades(self):
        request_data = {'holdingIds': [1]}

        response = self.client.get(self.url, request_data, format='json')

        expect_trade_dict = collections.OrderedDict(self.trade_dict)
        expect_trade_dict['id'] = self.trade.id
        expect_trade_dict.move_to_end('id', last=False)
        expect_trade_dict['holding'] = self.holding.id
        self.assertEqual(response.data, [expect_trade_dict])

    def test_list_invalid_holding_returns_empty_list(self):
        request_data = {'holdingIds': [2]}

        response = self.client.get(self.url, request_data, format='json')

        self.assertEqual(response.data, [])


class TestTradeDetail(APITestCase):
    def setUp(self):
        self.url = reverse('trade-detail', args=['1'])
        Instrument.objects.create()
        Holding.objects.create(instrument_id=1)
        self.trade_1 = Trade.objects.create(
            holding_id=1, date='2020-09-08', quantity=0.1, unit_price=200,
            fee=4, fx_fee=0.5, tax=1.5, fx_rate=1.2)
        self.trade_2 = Trade.objects.create(
            holding_id=1, date='2020-09-11', quantity=0.4, unit_price=201,
            fee=4, tax=1.5, fx_fee=0.5, fx_rate=1.1)

    def test_delete_trade(self):
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(list(Trade.objects.all()), [self.trade_2])
