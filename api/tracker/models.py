from django.db import models


class Holding(models.Model):
    username = models.CharField(max_length=100)
    symbol = models.CharField(max_length=10)
    name = models.CharField(max_length=50)
    currency = models.CharField(max_length=3)
    exchange = models.CharField(max_length=50)

    class Meta:
        ordering = ['name']


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
