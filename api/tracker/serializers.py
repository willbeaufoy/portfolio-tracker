from rest_framework import serializers

from tracker.models import Holding, Instrument, InstrumentSplit, Trade


class InstrumentSplitSerializer(serializers.ModelSerializer):
    class Meta:
        model = InstrumentSplit
        fields = ['ratio', 'date']


class InstrumentSerializer(serializers.ModelSerializer):
    splits = InstrumentSplitSerializer(many=True, read_only=True)

    class Meta:
        model = Instrument
        fields = ['id', 'symbol', 'name', 'currency', 'exchange',
                  'data_source', 'isin', 'bid_price', 'bid_price_update_time', 'splits']

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
        instance.bid_price = validated_data.get(
            'bid_price', instance.bid_price)
        instance.bid_price_update_time = validated_data.get(
            'bid_price_update_time', instance.bid_price_update_time)
        instance.save()
        return instance


class TradeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trade
        fields = ['id', 'holding', 'date', 'broker', 'currency', 'quantity',
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
        instance.currency = validated_data.get('currency', instance.currency)
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
    name = serializers.CharField(read_only=True, source="instrument.name")
    symbol = serializers.CharField(read_only=True, source="instrument.symbol")
    currency = serializers.CharField(
        read_only=True, source="instrument.currency")
    exchange = serializers.CharField(
        read_only=True, source="instrument.exchange")
    isin = serializers.CharField(
        read_only=True, source="instrument.isin")
    bid_price = serializers.FloatField(
        read_only=True, source="instrument.bid_price")
    bid_price_update_time = serializers.DateTimeField(
        read_only=True, source="instrument.bid_price_update_time")
    splits = InstrumentSplitSerializer(
        many=True, read_only=True, source="instrument.splits")
    trades = TradeSerializer(many=True, read_only=True)

    class Meta:
        model = Holding
        fields = ['id', 'instrument', 'username', 'name', 'symbol', 'currency', 'exchange',
                  'isin', 'bid_price', 'bid_price_update_time', 'splits', 'trades']

    def create(self, validated_data):
        """
        Create and return a new `Holding` instance, given the validated data.
        """
        return Holding.objects.create(**validated_data)
