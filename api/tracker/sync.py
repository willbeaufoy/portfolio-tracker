import asyncio
import os
from typing import Dict, List, Optional

import requests
from decouple import config
from django.core.management.base import BaseCommand, CommandError
from django.db.models.query import QuerySet
from django.utils import timezone

from tracker.models import Instrument

FINKI_API_KEY = config('FINKI_API_KEY')
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

    ms_instruments = list(instruments.filter(data_source='MS'))
    finki_instruments = list(instruments.filter(data_source='FI'))
    asyncio.run(create_tasks(list(instruments),
                             ms_instruments, finki_instruments))

    # return sync_prices_from_finki(isins, symbols)


async def create_tasks(instruments: List[Instrument], ms_instruments: List[Instrument], finki_instruments: List[Instrument]) -> Dict[str, float]:
    print(ms_instruments)
    print(finki_instruments)
    ms_instruments = []
    finki_instruments = []
    for instrument in instruments:
        if instrument.data_source == 'MS':
            ms_instruments.append(instrument)
        if instrument.data_source == 'FI':
            finki_instruments.append(instrument)
    if len(ms_instruments):
        ms_task = await asyncio.create_task(sync_prices_from_marketstack(ms_instruments))
    if len(finki_instruments):
        fi_prices_by_isin = await asyncio.create_task(sync_prices_from_finki(finki_instruments))

    return {**ms_prices_by_isin, **fi_prices_by_isin}


async def sync_prices_from_marketstack(instruments: List[Instrument]) -> Dict[str, float]:
    return {}


async def sync_prices_from_finki(isins: List[str]) -> Dict[str, float]:
    """Syncs prices for the given instruments from the FinKi API"""
    print('\nSyncing prices from FinKi ({})'.format('display'))
    prices_by_isin = {}
    for isin in isins:
        print()
        try:
            # finki_function = 'ukFundClose' if instrument.category == 'FUND' else 'bid'
            finki_function = 'bid'
            req = f'https://finki.io/callAPI.php?isin={isin}&function={finki_function}&key={FINKI_API_KEY}'
            res = requests.get(req)
            bid_price = float(res.text)
            if bid_price == 0:
                # Sometimes FinKi returns 0, but will correct itself for subsequent requests.
                print(
                    f'Did not update {instrument.name} as its FinKi price is currently 0')
                continue
            prices_by_isin['isin'] = bid_price

    return prices_by_isin
