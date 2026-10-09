from django.urls import path
from . import views

urlpatterns = [
    path("signup/", views.signup, name="signup"),
    path("login/", views.login, name="login"),

    path(
        "expenses/",
        views.ExpenseListCreateView.as_view(),
        name="expense-list",
    ),

    path(
        "expenses/<int:pk>/",
        views.ExpenseDetailView.as_view(),
        name="expense-detail",
    ),

    path(
        "budget/",
        views.budget_view,
        name="budget",
    ),
]