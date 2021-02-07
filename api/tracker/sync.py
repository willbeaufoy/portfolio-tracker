import os
from typing import List, Optional

import requests
from decouple import config
from django.core.management.base import BaseCommand, CommandError
from django.utils import timezone

from tracker.models import Instrument

FINKI_API_KEY = config('FINKI_API_KEY')
# Note, this is not yet used
MARKETSTACK_API_KEY = config('MARKETSTACK_API_KEY')


def sync_prices(username: Optional[str] = None, isins: Optional[List[str]] = None, symbols: Optional[List[str]] = None) -> None:
    """
    Sets the latest bid price of the instruments selected by the given params,
    or all instruments if no params are provided.
    """
    if username:
        instruments = Instrument.objects.filter(holding__username=username)
        display = f'username={username}'
    elif isins:
        instruments = Instrument.objects.filter(isin__in=isins)
        display = ', '.join(isins)
    elif symbols:
        instruments = Instrument.objects.filter(symbol__in=symbols)
        display = ', '.join(symbols)
    else:
        instruments = Instrument.objects.all()
        display = 'all'
    print(f'\nSyncing prices from FinKi ({display})')
    for instrument in instruments:
        print()
        try:
            finki_function = 'ukFundClose' if instrument.category == 'FUND' else 'bid'
            req = f'https://finki.io/callAPI.php?isin={instrument.isin}&function={finki_function}&key={FINKI_API_KEY}'
            res = requests.get(req)
            bid_price = float(res.text)
            if bid_price == 0:
                # Sometimes FinKi returns 0, but will correct itself for subsequent requests.
                print(
                    f'Did not update {instrument.name} as its FinKi price is currently 0')
                continue
            instrument.bid_price = bid_price
            instrument.bid_price_update_time = timezone.now()
            instrument.save()
            print(
                f'Successfully updated {instrument.name} ({instrument.currency} {bid_price})')
        except ValueError as e:
            print(f'Error fetching price for {instrument.name}')
            print(f'Request was: {req}')
            print(f'Error was: {e}')

    return
