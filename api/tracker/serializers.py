from rest_framework import serializers

from tracker.models import Holding


class HoldingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Holding
        fields = ['symbol', 'name', 'currency']

    def create(self, validated_data):
        """
        Create and return a new `Holding` instance, given the validated data.
        """
        return Holding.objects.create(**validated_data)

    def update(self, instance, validated_data):
        """
        Update and return an existing `Holding` instance, given the validated data.
        """
        instance.symbol = validated_data.get('symbol', instance.symbol)
        instance.name = validated_data.get('name', instance.name)
        instance.currency = validated_data.get('currency', instance.currency)
        instance.save()
        return instance
