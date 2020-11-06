import os
from typing import List, Optional

import requests
from django.core.management.base import BaseCommand, CommandError
from django.utils import timezone

from tracker.models import Instrument


class Command(BaseCommand):
    help = "Fetches and saves latest prices for instruments from external APIs."

    def add_arguments(self, parser):
        parser.add_argument('-s', '--symbols', nargs='+')

    def handle(self, *args, **options):
        self.sync_prices_from_finki(options['symbols'])

    def sync_prices_from_finki(self, symbols: Optional[List[str]] = None):
        """
        Sets the latest bid price of all instruments in the database
        from the FinkI API.
        """
        if symbols:
            instruments = Instrument.objects.filter(symbol__in=symbols)
        else:
            instruments = Instrument.objects.all()
        api_key = os.environ.get('FINKI_API_KEY')
        finki_function = 'bid'
        for instrument in instruments:
            self.stdout.write()
            try:
                req = 'https://finki.io/callAPI.php?isin={isin}&function={function}&key={key}'.format(
                    isin=instrument.isin, function=finki_function, key=api_key)
                res = requests.get(req)
                price = float(res.text)
                if price == 0:
                    # Sometimes FinKi returns 0, but will correct itself for subsequent requests.
                    self.stderr.write('Did not update {} as its FinKi price is currently 0'.format(
                        instrument.name))
                    continue
                instrument.latest_price = price
                instrument.latest_price_update_time = timezone.now()
                instrument.save()
                self.stdout.write('Successfully updated {} ({} {})'.format(
                    instrument.name, instrument.currency, price))
            except ValueError as e:
                self.stderr.write(
                    'Error fetching price for {}'.format(instrument.name))
                self.stderr.write('Request was: {}'.format(req))
                self.stderr.write('Error was: {}'.format(e))
