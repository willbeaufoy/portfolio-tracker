from rest_framework import generics

from tracker.models import Holding
from tracker.serializers import HoldingSerializer


class HoldingList(generics.ListCreateAPIView):
    queryset = Holding.objects.all()
    serializer_class = HoldingSerializer


class HoldingDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Holding.objects.all()
    serializer_class = HoldingSerializer
