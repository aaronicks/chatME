# Generated by Django 4.2.1 on 2024-02-06 18:09

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("chat", "0001_initial"),
    ]

    operations = [
        migrations.RenameField(
            model_name="room",
            old_name="clients",
            new_name="client",
        ),
        migrations.RenameField(
            model_name="room",
            old_name="messages",
            new_name="message",
        ),
    ]
