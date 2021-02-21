from django.contrib import admin
from django.db import models
from django.db.models.functions import Lower


class Instrument(models.Model):
    class Category(models.TextChoices):
        STOCK = 'STOCK'
        ETF = 'ETF'
        FUND = 'FUND'

    class DataSource(models.TextChoices):
        FINKI = 'FI'
        MARKETSTACK = 'MS'
        TRADING_212 = 'T2'

    class Meta:
        ordering = ['name']

    symbol = models.CharField(max_length=10, blank=True)
    name = models.CharField(max_length=50)
    category = models.CharField(
        max_length=20, choices=Category.choices, default=Category.STOCK)
    currency = models.CharField(max_length=3)
    exchange = models.CharField(max_length=50, blank=True)
    data_source = models.CharField(
        max_length=2, choices=DataSource.choices, default=DataSource.TRADING_212)
    # Code used to identify the instrument on the Trading 212 API
    t212_code = models.CharField(max_length=50, blank=True)
    isin = models.CharField(max_length=12)
    bid_price = models.FloatField(null=True)
    bid_price_update_time = models.DateTimeField(null=True)

    def __str__(self):
        return self.name


class InstrumentSplit(models.Model):
    instrument = models.ForeignKey(
        Instrument, related_name='splits', on_delete=models.PROTECT)
    ratio = models.FloatField()
    date = models.DateField()

    def __str__(self):
        return '{} (1:{:g}) ({})'.format(self.instrument.name, self.ratio, self.date)


class Holding(models.Model):
    class Meta:
        ordering = [Lower('instrument__name')]

    instrument = models.ForeignKey(Instrument, on_delete=models.PROTECT)
    username = models.CharField(max_length=100)

    def __str__(self):
        return '{} ({})'.format(self.instrument.name, self.username)


class Trade(models.Model):
    class Category(models.TextChoices):
        BUY = 'BUY'
        SELL = 'SELL'

    class Meta:
        ordering = ['-date']

    holding = models.ForeignKey(
        Holding, related_name='trades', on_delete=models.CASCADE)
    date = models.DateTimeField()
    category = models.CharField(
        max_length=20, choices=Category.choices, default=Category.BUY)
    broker = models.CharField(max_length=100)
    quantity = models.FloatField()
    price_currency = models.CharField(max_length=3)
    unit_price = models.FloatField()
    payment_currency = models.CharField(max_length=3)
    fee = models.FloatField()
    tax = models.FloatField()
    # FX rate between payment_currency and price_currency.
    # E.g. 1.31 if payment_currency is GBP and price_currency is USD.
    fx_rate = models.FloatField()

    def __str__(self):
        return '{} ({}) ({})'.format(self.holding.instrument.name, self.holding.username, self.date)


class Dividend(models.Model):
    class Meta:
        ordering = ['-date']

    holding = models.ForeignKey(
        Holding, related_name='dividends', on_delete=models.CASCADE)
    date = models.DateTimeField()
    broker = models.CharField(max_length=100)
    value = models.FloatField()

    def __str__(self):
        return '{} ({}) ({})'.format(self.holding.instrument.name, self.holding.username, self.date)


admin.site.register([Holding, Instrument, InstrumentSplit, Trade, Dividend])
