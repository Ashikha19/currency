from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("accounts", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="expense",
            name="notes",
            field=models.TextField(blank=True, default=""),
        ),
        migrations.AddField(
            model_name="expense",
            name="payment_method",
            field=models.CharField(
                choices=[
                    ("Cash", "Cash"),
                    ("Card", "Card"),
                    ("Bank Transfer", "Bank Transfer"),
                    ("UPI", "UPI"),
                    ("Wallet", "Wallet"),
                    ("Other", "Other"),
                ],
                default="Cash",
                max_length=30,
            ),
        ),
        migrations.AddField(
            model_name="expense",
            name="is_recurring",
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name="expense",
            name="frequency",
            field=models.CharField(
                choices=[
                    ("One-time", "One-time"),
                    ("Daily", "Daily"),
                    ("Weekly", "Weekly"),
                    ("Monthly", "Monthly"),
                    ("Yearly", "Yearly"),
                ],
                default="One-time",
                max_length=20,
            ),
        ),
    ]
