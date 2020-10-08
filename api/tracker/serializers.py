from rest_framework import serializers

from tracker.models import Holding, Trade


class TradeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trade
        fields = ['holding', 'date', 'quantity',
                  'unit_price', 'fee', 'fx_rate', 'fx_fee']

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
        instance.quantity = validated_data.get('quantity', instance.quantity)
        instance.unit_price = validated_data.get(
            'unit_price', instance.unit_price)
        instance.fee = validated_data.get('fee', instance.fee)
        instance.fx_rate = validated_data.get('fx_rate', instance.fx_rate)
        instance.fx_fee = validated_data.get('fx_fee', instance.fx_fee)
        instance.save()
        return instance


class HoldingSerializer(serializers.ModelSerializer):
    trades = TradeSerializer(many=True, read_only=True)

    class Meta:
        model = Holding
        fields = ['id', 'username', 'symbol', 'name', 'currency', 'trades']

    def create(self, validated_data):
        """
        Create and return a new `Holding` instance, given the validated data.
        """
        return Holding.objects.create(**validated_data)

    def update(self, instance, validated_data):
        """
        Update and return an existing `Holding` instance, given the validated data.
        """
        instance.username = validated_data.get('username', instance.username)
        instance.symbol = validated_data.get('symbol', instance.symbol)
        instance.name = validated_data.get('name', instance.name)
        instance.currency = validated_data.get('currency', instance.currency)
        instance.save()
        return instance
