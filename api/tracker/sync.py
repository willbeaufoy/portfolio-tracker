import os
from typing import List, Optional

import requests
from django.core.management.base import BaseCommand, CommandError
from django.utils import timezone

from tracker.models import Instrument


def sync_prices(symbols: Optional[List[str]] = None):
    """
    Sets the latest bid price of the instruments in the provided list,
    or all instruments if this is not provided.
    """
    return sync_prices_from_finki(symbols)


def sync_prices_from_finki(symbols: Optional[List[str]] = None):
    """
    Syncs prices from the FinkI API.
    """
    if symbols:
        instruments = Instrument.objects.filter(symbol__in=symbols)
    else:
        instruments = Instrument.objects.all()
    api_key = os.environ.get('FINKI_API_KEY')
    finki_function = 'bid'
    print('\nSyncing prices from FinKi')
    for instrument in instruments:
        print()
        try:
            req = 'https://finki.io/callAPI.php?isin={isin}&function={function}&key={key}'.format(
                isin=instrument.isin, function=finki_function, key=api_key)
            res = requests.get(req)
            bid_price = float(res.text)
            if bid_price == 0:
                # Sometimes FinKi returns 0, but will correct itself for subsequent requests.
                print('Did not update {} as its FinKi price is currently 0'.format(
                    instrument.name))
                continue
            instrument.bid_price = bid_price
            instrument.bid_price_update_time = timezone.now()
            instrument.save()
            print('Successfully updated {} ({} {})'.format(
                instrument.name, instrument.currency, bid_price))
        except ValueError as e:
            print(
                'Error fetching price for {}'.format(instrument.name))
            print('Request was: {}'.format(req))
            print('Error was: {}'.format(e))

    return
