# Generated by Django 3.1.2 on 2020-11-17 00:06

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('tracker', '0004_auto_20201109_1957'),
    ]

    operations = [
        migrations.AddField(
            model_name='instrument',
            name='category',
            field=models.CharField(default='STOCK', max_length=20),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='trade',
            name='holding',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='trades', to='tracker.holding'),
        ),
    ]
