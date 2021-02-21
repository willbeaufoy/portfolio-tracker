import os
from typing import List, Optional

import requests
from decouple import config
from django.core.management.base import BaseCommand, CommandError
from django.db.models import QuerySet
from django.utils import timezone

from tracker.models import Instrument

FINKI_API_KEY = config('FINKI_API_KEY')
# Currently unused as we are using Trading 212 for prices and a
# _sync_prices_from_marketstack function is not yet set up.
MARKETSTACK_API_KEY = config('MARKETSTACK_API_KEY')


def sync_prices(username: Optional[str] = None, isins: Optional[List[str]] = None, symbols: Optional[List[str]] = None) -> None:
    """
    Sets the latest bid price of the instruments selected by the given params,
    or all instruments if no params are provided.

    Can use a variety of APIs for price data. Currently using Trading 212.
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
    print(f'\nSyncing prices ({display})')
    _sync_prices_from_trading_212(instruments)


def _sync_prices_from_finki(instruments: QuerySet[Instrument]) -> None:
    """Syncs the prices from the given instruments from FinKi"""
    print('\nSyncing from FinKi')
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
            # If we encounter an error then the API is probably overloaded, so do not make any more
            # requests in order to give it a rest.
            print('Ending sync')
            break
    return


def _sync_prices_from_trading_212(instruments: QuerySet[Instrument]) -> None:
    """Syncs the prices from the given instruments from Trading 212"""
    print('Syncing from Trading 212')
    codes = [inst.t212_code for inst in instruments]
    try:
        codesStr = ','.join(codes)
        req = f'https://live.trading212.com/rest/v2/prices?withFakes=false&instrumentCodes={codesStr}'
        res = requests.get(req)
        resJson = res.json()
        if type(resJson) is not list:
            raise ValueError(resJson)
    except Exception as e:
        print('Error fetching prices from Trading 212')
        print(f'Request was: {req}')
        print(f'Error was: {e}')
        print('Ending sync')
        return

    priceData = {priceDatum['instrumentCode']: priceDatum for priceDatum in resJson}
    for inst in instruments:
        print(
            f'\nSyncing price for {inst.name}')
        priceDatum = priceData.get(inst.t212_code)
        if not priceDatum:
            print(
                f'Update failed. No Trading 212 data for code: {inst.t212_code}')
            continue
        inst.bid_price = priceDatum['sell']
        inst.bid_price_update_time = priceDatum['timestamp']
        inst.save()
        print(
            f'Update successful. Price: {inst.currency} {inst.bid_price}. Last update time: {inst.bid_price_update_time}')
    return


def apply_trading_212_codes(isins: Optional[List[str]] = None) -> None:
    """
    Applies the Trading 212 codes to the instruments with the given ISINs.
    This means we can then use the Trading 212 API for price data.
    """
    if isins:
        instruments = Instrument.objects.filter(isin__in=isins)
        display = ', '.join(isins)
    else:
        instruments = Instrument.objects.all()
        display = 'all'
    print(f'\nApplying Trading 212 codes ({display})')
    for inst in instruments:
        print()
        try:
            print(
                f'Trying to get Trading 212 code for {inst.name} with ISIN: {inst.isin}')
            req = f'https://finki.io/callAPI.php?isin={inst.isin}&function=t212Code&key={FINKI_API_KEY}'
            res = requests.get(req)
            # TODO: Handle temporarily unavailable errors
            if 'Whoops' in res.text:
                print('Failed')
                print(f'Request was: {req}')
                print(f'Response was: {res.text}')
                continue
            code = res.text.replace(' ', '_').strip()
            inst.t212_code = code
            inst.save()
            print('Succeeded')
        except Exception as e:
            print(e)
