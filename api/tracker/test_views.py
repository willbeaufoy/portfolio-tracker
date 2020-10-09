import collections
import datetime

from django.forms.models import model_to_dict
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from tracker.models import Holding, Trade


class TestHoldingList(APITestCase):
    def setUp(self):
        self.url = reverse('holding-list')
        self.holdingDict = collections.OrderedDict(
            {'username': 'a', 'symbol': 'AMZN', 'name': 'Amazon', 'currency': 'USD'})
        self.holding = Holding.objects.create(**self.holdingDict)
        self.trade_dict = collections.OrderedDict(
            {'holding': self.holding, 'date': '2020-09-08', 'quantity': 1, 'unit_price': 1,
             'fee': 1, 'fx_rate': 1.2, 'fx_fee': 0.45})
        self.trade = Trade.objects.create(**self.trade_dict)

    def test_create_holding(self):
        request_data = {'username': 'a', 'symbol': 'TSLA',
                        'name': 'Tesla', 'currency': 'USD'}
        response = self.client.post(self.url, request_data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Holding.objects.count(), 2)
        self.assertEqual(Holding.objects.get(id=2).symbol, 'TSLA')

    def test_list_valid_username_returns_holdings(self):
        request_data = {'username': 'a'}

        response = self.client.get(self.url, request_data, format='json')

        expect_holding_dict = collections.OrderedDict(self.holdingDict)
        expect_holding_dict['id'] = self.holding.id
        expect_holding_dict.move_to_end('id', last=False)
        expect_trade_dict = collections.OrderedDict(self.trade_dict)
        expect_trade_dict['id'] = self.trade.id
        expect_trade_dict.move_to_end('id', last=False)
        expect_trade_dict['holding'] = self.holding.id
        expect_holding_dict['trades'] = [expect_trade_dict]
        self.assertEqual(response.data, [expect_holding_dict])

    def test_list_invalid_username_returns_empty_list(self):
        request_data = {'username': 'z'}

        response = self.client.get(self.url, request_data, format='json')

        self.assertEqual(response.data, [])


class TestTradeList(APITestCase):
    def setUp(self):
        self.url = reverse('trade-list')
        self.holding = Holding.objects.create()
        self.trade_dict = collections.OrderedDict(
            {'holding': self.holding, 'date': '2020-09-08', 'quantity': 1, 'unit_price': 1,
             'fee': 1, 'fx_rate': 1.2, 'fx_fee': 0.45})
        self.trade = Trade.objects.create(**self.trade_dict)

    def test_create_trade(self):
        request_data = {'holding': 1, 'date': '2020-09-10',
                        'quantity': 2, 'unit_price': 1, 'fee': 1, 'fx_rate': 1.2, 'fx_fee': 0.45}
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
        self.trade_1 = Trade.objects.create(
            holding_id=1, date='2020-09-08', quantity=0.1, unit_price=200,
            fee=4, fx_fee=0.5, fx_rate=1.2)
        self.trade_2 = Trade.objects.create(
            holding_id=1, date='2020-09-11', quantity=0.4, unit_price=201,
            fee=4, fx_fee=0.5, fx_rate=1.1)

    def test_delete_trade(self):
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(list(Trade.objects.all()), [self.trade_2])
