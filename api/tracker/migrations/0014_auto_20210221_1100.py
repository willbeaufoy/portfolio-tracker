# Generated by Django 3.1.2 on 2021-02-21 11:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tracker', '0013_instrument_t212_code'),
    ]

    operations = [
        migrations.AlterField(
            model_name='instrument',
            name='data_source',
            field=models.CharField(choices=[('FI', 'Finki'), ('MS', 'Marketstack'), ('T2', 'Trading 212')], default='T2', max_length=2),
        ),
    ]