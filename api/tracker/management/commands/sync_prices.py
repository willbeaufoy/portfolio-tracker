
from django.core.management.base import BaseCommand

from tracker.sync import sync_prices


class Command(BaseCommand):
    help = "Fetches and saves latest prices for instruments from external APIs."

    def add_arguments(self, parser):
        parser.add_argument('-s', '--symbols', nargs='+')

    def handle(self, *args, **options):
        sync_prices(options['symbols'])
