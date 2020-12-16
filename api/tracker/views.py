from rest_framework import generics, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from tracker.models import Holding, Instrument, Trade
from tracker.serializers import (HoldingSerializer, InstrumentSerializer,
                                 TradeSerializer)
from tracker.sync import sync_prices


class InstrumentList(generics.ListCreateAPIView):
    queryset = Instrument.objects.all()
    serializer_class = InstrumentSerializer

    def get_queryset(self):
        isin = self.request.query_params.get('isin', '')
        return Instrument.objects.filter(isin=isin)

    def post(self, request, *args, **kwargs):
        res = self.create(request, *args, **kwargs)
        sync_prices(isins=[request.data['isin']])
        return res


class InstrumentDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Instrument.objects.all()
    serializer_class = InstrumentSerializer


class InstrumentViewSet(viewsets.ModelViewSet):
    """
    Instrument viewset to provide custom actions
    """
    @action(detail=False)
    def sync(self, request):
        sync_prices()
        return Response({'status': 'OK'})


class HoldingList(generics.ListCreateAPIView):
    queryset = Holding.objects.all()
    serializer_class = HoldingSerializer

    def get_queryset(self):
        username = self.request.query_params.get('username', '')
        holdings = Holding.objects.filter(username=username)
        symbols = self.request.query_params.get('symbols', '')
        if symbols is not '':
            holdings = holdings.filter(
                instrument__symbol__in=symbols.split(','))
        return holdings


class HoldingDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Holding.objects.all()
    serializer_class = HoldingSerializer


class TradeList(generics.ListCreateAPIView):
    queryset = Trade.objects.all()
    serializer_class = TradeSerializer

    def get_queryset(self):
        # TODO: Prevent retrieving another user's holdings.
        holding_ids = self.request.query_params.get('holdingIds', [])
        return Trade.objects.filter(holding__in=holding_ids)


class TradeDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Trade.objects.all()
    serializer_class = TradeSerializer
