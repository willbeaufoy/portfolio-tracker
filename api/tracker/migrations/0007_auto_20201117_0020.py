# Generated by Django 3.1.2 on 2020-11-17 00:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tracker', '0006_auto_20201117_0018'),
    ]

    operations = [
        migrations.AlterField(
            model_name='instrument',
            name='exchange',
            field=models.CharField(blank=True, default='', max_length=50),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='instrument',
            name='symbol',
            field=models.CharField(blank=True, default='', max_length=10),
            preserve_default=False,
        ),
    ]
