# Generated by Django 2.1 on 2020-10-08 16:51

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('tracker', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='holding',
            options={'ordering': ['name']},
        ),
        migrations.RenameField(
            model_name='trade',
            old_name='shares',
            new_name='quantity',
        ),
        migrations.AlterField(
            model_name='trade',
            name='holding',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='trades', to='tracker.Holding'),
        ),
    ]