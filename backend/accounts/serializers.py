from rest_framework import serializers
from .models import Expense


class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = [
            "id",
            "user",
            "name",
            "amount",
            "category",
            "date",
            "notes",
            "payment_method",
            "is_recurring",
            "frequency",
        ]

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("Amount must be greater than 0.")
        return value

    def validate_name(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Name cannot be empty.")
        return value.strip()

    def validate_category(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Category cannot be empty.")
        return value.strip()