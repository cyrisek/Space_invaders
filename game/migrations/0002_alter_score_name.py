# Generated by Django 4.1.5 on 2023-01-24 19:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("game", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="score",
            name="name",
            field=models.CharField(default="", max_length=25),
        ),
    ]
