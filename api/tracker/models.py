from django.db import models


class Instrument(models.Model):

    class DataSource(models.TextChoices):
        FINKI = 'FI'
        MARKETSTACK = 'MS'

    symbol = models.CharField(max_length=10)
    name = models.CharField(max_length=50)
    currency = models.CharField(max_length=3)
    exchange = models.CharField(max_length=50)
    data_source = models.CharField(
        max_length=2, choices=DataSource.choices, default=DataSource.FINKI)
    isin = models.CharField(max_length=12)
    latest_price = models.FloatField(null=True)
    latest_price_update_time = models.DateTimeField(null=True)

    class Meta:
        ordering = ['name']


class Holding(models.Model):
    instrument = models.ForeignKey(Instrument, on_delete=models.PROTECT)
    username = models.CharField(max_length=100)


class Trade(models.Model):
    holding = models.ForeignKey(
        Holding, related_name='trades', on_delete=models.CASCADE)
    date = models.DateField()
    broker = models.CharField(max_length=100)
    quantity = models.FloatField()
    unit_price = models.FloatField()
    fee = models.FloatField()
    tax = models.FloatField()
    fx_rate = models.FloatField()
    fx_fee = models.FloatField()

    class Meta:
        ordering = ['date']
