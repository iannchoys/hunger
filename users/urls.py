from django.urls import path

from . import views


app_name = "users"

urlpatterns = [
    path("register/", views.register_user, name="register"),
    path("login/", views.login_user, name="login"),
    path("logout/", views.logout_user, name="logout"),

    path(
        "password-reset/request/",
        views.password_reset_request,
        name="password_reset_request",
    ),
    path(
        "password-reset/<uuid:token>/",
        views.password_reset_confirm,
        name="password_reset_confirm",
    ),
    path(
        "password-reset/<uuid:token>/change/",
        views.password_reset_change,
        name="password_reset_change",
    ),
]