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
    """Sets the latest bid price of all instruments in the database"""
    instruments = Instrument.objects.all()
    api_key = os.environ.get('FINKI_API_KEY')
    for instrument in instruments:
        is_uk_instrument = instrument.isin.startswith(
            'GB') or instrument.isin.startswith('JE')
        is_ie_instrument = instrument.isin.startswith('IE')
        finki_function = 'ukBid' if is_uk_instrument or is_ie_instrument else 'usBid'
        try:
            req = 'https://finki.io/callAPI.php?isin={isin}&function={function}&key={key}'.format(
                isin=instrument.isin, function=finki_function, key=api_key)
            res = requests.get(req)
            price = float(res.text)
            if price == 0:
                # Sometimes FinKi returns 0, but will correct itself for subsequent requests.
                print('Did not update {} as its FinKi price is currently 0\n'.format(
                    instrument.name))
                continue
            if is_uk_instrument:
                # UK prices are quoted in GBX (pence) but we save them as GBP.
                price /= 100
            instrument.latest_price = price
            instrument.latest_price_update_time = timezone.now()
            instrument.save()
            print('Successfully updated {} ({})\n'.format(instrument.name, price))
        except ValueError as e:
            print('Error fetching price for {}'.format(instrument.name))
            print('Request was: {}'.format(req))
            print('Error was: {}\n'.format(e))
