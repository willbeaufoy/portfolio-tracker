from drf_extra_fields.relations import PresentablePrimaryKeyRelatedField
from rest_framework import serializers

from tracker.models import Holding, Instrument, Trade


class InstrumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Instrument
        fields = ['id', 'symbol', 'name', 'currency', 'exchange',
                  'data_source', 'isin', 'latest_price', 'latest_price_update_time']

    def create(self, validated_data):
        """
        Create and return a new `Instrument` instance, given the validated data.
        """
        return Instrument.objects.create(**validated_data)

    def update(self, instance, validated_data):
        """
        Update and return an existing `Instrument` instance, given the validated data.
        """
        instance.symbol = validated_data.get('symbol', instance.symbol)
        instance.name = validated_data.get('name', instance.name)
        instance.currency = validated_data.get('currency', instance.currency)
        instance.exchange = validated_data.get('exchange', instance.exchange)
        instance.data_source = validated_data.get(
            'data_source', instance.data_source)
        instance.isin = validated_data.get('isin', instance.isin)
        instance.latest_price = validated_data.get(
            'latest_price', instance.latest_price)
        instance.latest_price_update_time = validated_data.get(
            'latest_price_update_time', instance.latest_price_update_time)
        instance.save()
        return instance


class TradeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trade
        fields = ['id', 'holding', 'date', 'broker', 'quantity',
                  'unit_price', 'fee', 'tax', 'fx_rate', 'fx_fee']

    def create(self, validated_data):
        """
        Create and return a new `Trade` instance, given the validated data.
        """
        return Trade.objects.create(**validated_data)

    def update(self, instance, validated_data):
        """
        Update and return an existing `Trade` instance, given the validated data.
        """
        instance.holding = validated_data.get('holding', instance.holding)
        instance.date = validated_data.get('date', instance.date)
        instance.broker = validated_data.get('broker', instance.broker)
        instance.quantity = validated_data.get('quantity', instance.quantity)
        instance.unit_price = validated_data.get(
            'unit_price', instance.unit_price)
        instance.fee = validated_data.get('fee', instance.fee)
        instance.tax = validated_data.get('tax', instance.tax)
        instance.fx_rate = validated_data.get('fx_rate', instance.fx_rate)
        instance.fx_fee = validated_data.get('fx_fee', instance.fx_fee)
        instance.save()
        return instance


class HoldingSerializer(serializers.ModelSerializer):
    instrument = PresentablePrimaryKeyRelatedField(
        queryset=Instrument.objects.all(), presentation_serializer=InstrumentSerializer)
    trades = TradeSerializer(many=True, read_only=True)

    class Meta:
        model = Holding
        fields = ['id', 'instrument', 'username', 'trades']

    def create(self, validated_data):
        """
        Create and return a new `Holding` instance, given the validated data.
        """
        return Holding.objects.create(**validated_data)
