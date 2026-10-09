from django.db import models
from django.contrib.auth.models import User

# Create your models here.


class Expense(models.Model):
    PAYMENT_METHOD_CHOICES = [
        ("Cash", "Cash"),
        ("Card", "Card"),
        ("Bank Transfer", "Bank Transfer"),
        ("UPI", "UPI"),
        ("Wallet", "Wallet"),
        ("Other", "Other"),
    ]

    FREQUENCY_CHOICES = [
        ("One-time", "One-time"),
        ("Daily", "Daily"),
        ("Weekly", "Weekly"),
        ("Monthly", "Monthly"),
        ("Yearly", "Yearly"),
    ]

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="expenses",
    )
    name = models.CharField(max_length=200)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=50)
    date = models.DateField()
    notes = models.TextField(blank=True, default="")
    payment_method = models.CharField(
        max_length=30,
        choices=PAYMENT_METHOD_CHOICES,
        default="Cash",
    )
    is_recurring = models.BooleanField(default=False)
    frequency = models.CharField(
        max_length=20,
        choices=FREQUENCY_CHOICES,
        default="One-time",
    )

    def __str__(self):
        return f"{self.name} - {self.amount}"


class Budget(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="budgets",
    )
    month = models.CharField(max_length=7)  # YYYY-MM
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("user", "month")

    def __str__(self):
        return f"{self.user.username} - {self.month} - ₹{self.amount}"