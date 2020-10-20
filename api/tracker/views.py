from rest_framework import generics

from tracker.models import Holding, Instrument, Trade
from tracker.serializers import HoldingSerializer, InstrumentSerializer, TradeSerializer


class InstrumentList(generics.ListCreateAPIView):
    queryset = Instrument.objects.all()
    serializer_class = InstrumentSerializer


class InstrumentDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Instrument.objects.all()
    serializer_class = InstrumentSerializer


class HoldingList(generics.ListCreateAPIView):
    queryset = Holding.objects.all()
    serializer_class = HoldingSerializer

    def get_queryset(self):
        username = self.request.query_params.get('username', '')
        return Holding.objects.filter(username=username)


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
