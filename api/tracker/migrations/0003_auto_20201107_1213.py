# Generated by Django 3.1.2 on 2020-11-07 12:13

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('tracker', '0002_auto_20201103_1933'),
    ]

    operations = [
        migrations.RenameField(
            model_name='instrument',
            old_name='latest_price',
            new_name='bid_price',
        ),
        migrations.RenameField(
            model_name='instrument',
            old_name='latest_price_update_time',
            new_name='bid_price_update_time',
        ),
    ]