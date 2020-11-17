# Generated by Django 3.1.2 on 2020-11-17 17:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tracker', '0007_auto_20201117_0020'),
    ]

    operations = [
        migrations.AlterField(
            model_name='instrument',
            name='category',
            field=models.CharField(choices=[('STOCK', 'Stock'), ('ETF', 'Etf'), ('FUND', 'Fund')], default='STOCK', max_length=20),
        ),
    ]
