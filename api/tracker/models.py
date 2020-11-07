from django.contrib import admin
from django.db import models


class Instrument(models.Model):

    class DataSource(models.TextChoices):
        FINKI = 'FI'
        MARKETSTACK = 'MS'

    class Meta:
        ordering = ['name']

    symbol = models.CharField(max_length=10)
    name = models.CharField(max_length=50)
    currency = models.CharField(max_length=3)
    exchange = models.CharField(max_length=50)
    data_source = models.CharField(
        max_length=2, choices=DataSource.choices, default=DataSource.FINKI)
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
        ordering = ['instrument__name']

    instrument = models.ForeignKey(Instrument, on_delete=models.PROTECT)
    username = models.CharField(max_length=100)

    def __str__(self):
        return '{} ({})'.format(self.instrument.name, self.username)


class Trade(models.Model):
    class Meta:
        ordering = ['date']

    holding = models.ForeignKey(
        Holding, related_name='trades', on_delete=models.CASCADE)
    date = models.DateField()
    broker = models.CharField(max_length=100)
    currency = models.CharField(max_length=3)
    quantity = models.FloatField()
    unit_price = models.FloatField()
    fee = models.FloatField()
    tax = models.FloatField()
    fx_rate = models.FloatField()
    fx_fee = models.FloatField()

    def __str__(self):
        return '{} ({}) ({})'.format(self.holding.instrument.name, self.holding.username, self.date)


admin.site.register([Holding, Instrument, InstrumentSplit, Trade])
