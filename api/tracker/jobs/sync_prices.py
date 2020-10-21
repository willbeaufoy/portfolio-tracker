import asyncio
import os

import requests

from django_extensions.management.jobs import QuarterHourlyJob
from django.utils import timezone

from tracker.models import Instrument


class Job(QuarterHourlyJob):
    help = "Fetches and saves latest prices for instruments from external APIs."

    def execute(self):
        sync_prices_from_finki()


def sync_prices_from_finki():
    instruments = Instrument.objects.all()
    api_key = os.environ.get('FINKI_API_KEY')
    for inst in instruments:
        req = 'https://finki.io/callAPI.php?isin={isin}&function=ukAsk&key={key}'.format(
            isin=inst.isin, key=api_key)
        res = requests.get(req)
        price = float(res.text)
        if inst.exchange == 'LSE':
            # LSE prices are quoted in GBX (pence) but we save them as GBP.
            price /= 100
        inst.latest_price = price
        inst.latest_price_update_time = timezone.now()
        inst.save()
