# Generated by Django 4.2.1 on 2024-02-06 18:11

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("chat", "0002_rename_clients_room_client_and_more"),
    ]

    operations = [
        migrations.RenameField(
            model_name="room",
            old_name="message",
            new_name="messages",
        ),
    ]
