import json
from decimal import InvalidOperation

from django.contrib.auth import authenticate, get_user_model
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.shortcuts import get_object_or_404

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes

from .serializers import ExpenseSerializer
from .models import Expense, Budget

User = get_user_model()


# =========================
# SIGNUP
# =========================

@csrf_exempt
@require_POST
def signup(request):
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse(
            {"error": "Invalid JSON."},
            status=400,
        )

    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not email or not password:
        return JsonResponse(
            {"error": "Email and password are required."},
            status=400,
        )

    if User.objects.filter(username=email).exists():
        return JsonResponse(
            {"error": "An account with that email already exists."},
            status=400,
        )

    user = User.objects.create_user(
        username=email,
        email=email,
        password=password,
    )

    return JsonResponse(
        {
            "message": "Account created.",
            "email": user.email,
            "id": user.id,
        },
        status=201,
    )


# =========================
# LOGIN
# =========================

@csrf_exempt
@require_POST
def login(request):
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse(
            {"error": "Invalid JSON."},
            status=400,
        )

    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    user = authenticate(
        request,
        username=email,
        password=password,
    )

    if user is None:
        return JsonResponse(
            {"error": "Email or password are incorrect."},
            status=401,
        )

    return JsonResponse(
        {
            "message": "Login successful.",
            "email": user.email,
            "id": user.id,
        }
    )


# =========================
# EXPENSE LIST + CREATE
# =========================

class ExpenseListCreateView(generics.ListCreateAPIView):
    serializer_class = ExpenseSerializer

    def get_queryset(self):
        user_id = self.request.query_params.get("user")

        if user_id:
            return Expense.objects.filter(user_id=user_id).order_by("-date", "-id")

        return Expense.objects.none()

    def perform_create(self, serializer):
        user_id = self.request.data.get("user")

        if not user_id:
            raise ValueError("User ID is required.")

        user = get_object_or_404(User, id=user_id)
        serializer.save(user=user)


# =========================
# EXPENSE DETAIL
# =========================

class ExpenseDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer
    # =========================
# BUDGET GET + CREATE / UPDATE
# =========================

@csrf_exempt
def budget_view(request):
    if request.method == "GET":
        user_id = request.GET.get("user")
        month = request.GET.get("month")

        if not user_id:
            return JsonResponse(
                {"error": "User ID is required."},
                status=400,
            )

        if not month:
            return JsonResponse(
                {"error": "Month is required."},
                status=400,
            )

        try:
            budget = Budget.objects.get(
                user_id=user_id,
                month=month,
            )

            return JsonResponse({
                "id": budget.id,
                "user": budget.user_id,
                "month": budget.month,
                "amount": str(budget.amount),
            })

        except Budget.DoesNotExist:
            return JsonResponse(
                {"message": "No budget found."},
                status=404,
            )

    # =========================
    # SAVE / UPDATE BUDGET
    # =========================

    if request.method == "POST":
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse(
                {"error": "Invalid JSON."},
                status=400,
            )

        user_id = data.get("user")
        month = data.get("month")
        amount = data.get("amount")

        if not user_id or not month or amount is None:
            return JsonResponse(
                {"error": "User, month and amount are required."},
                status=400,
            )

        try:
            amount_decimal = float(amount)
            if amount_decimal <= 0:
                return JsonResponse(
                    {"error": "Amount must be greater than 0."},
                    status=400,
                )
        except (ValueError, TypeError, InvalidOperation):
            return JsonResponse(
                {"error": "Amount must be a valid number."},
                status=400,
            )

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return JsonResponse(
                {"error": "User not found."},
                status=404,
            )

        budget, created = Budget.objects.update_or_create(
            user=user,
            month=month,
            defaults={
                "amount": amount,
            },
        )

        return JsonResponse({
            "message": "Budget saved successfully.",
            "id": budget.id,
            "user": budget.user_id,
            "month": budget.month,
            "amount": str(budget.amount),
            "created": created,
        })

    return JsonResponse(
        {"error": "Only GET and POST methods are allowed."},
        status=405,
    )