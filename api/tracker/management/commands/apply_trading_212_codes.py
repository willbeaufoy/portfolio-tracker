
from django.core.management.base import BaseCommand
from tracker.sync import apply_trading_212_codes


class Command(BaseCommand):
    help = 'Applies Trading 212 codes to instruments with the given ISINs, or \
        to all instruments if no ISINs are given.'

    def add_arguments(self, parser):
        parser.add_argument('-i', '--isins', nargs='+')

    def handle(self, *args, **options):
        apply_trading_212_codes(isins=options['isins'])
