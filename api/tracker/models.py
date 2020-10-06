from django.db import models


class Holding(models.Model):
    username = models.CharField(max_length=100)
    symbol = models.CharField(max_length=10)
    name = models.CharField(max_length=50)
    currency = models.CharField(max_length=3)


class Trade(models.Model):
    holding = models.ForeignKey(Holding, on_delete=models.CASCADE)
    date = models.DateField()
    shares = models.FloatField()
    price = models.FloatField()
    fee = models.FloatField()
