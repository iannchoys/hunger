from django.conf import settings
from django.contrib.auth import authenticate, get_user_model, login, logout
from django.core.mail import send_mail
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, render
from django.urls import reverse
from django.utils import timezone
from django.views.decorators.http import require_POST

from .models import PasswordResetRequest


@require_POST
def register_user(request):
    email = request.POST.get("email", "").strip().lower()
    password = request.POST.get("password", "").strip()

    if not email or not password:
        return JsonResponse(
            {
                "success": False,
                "message": "Please fill in all fields.",
            },
            status=400,
        )

    if len(password) < 6:
        return JsonResponse(
            {
                "success": False,
                "message": "Password must be at least 6 characters.",
            },
            status=400,
        )

    User = get_user_model()

    if User.objects.filter(email=email).exists():
        return JsonResponse(
            {
                "success": False,
                "message": "User with this email already exists.",
            },
            status=400,
        )

    user = User.objects.create_user(email=email, password=password)
    login(request, user)

    return JsonResponse(
        {
            "success": True,
            "message": "Registration completed successfully.",
            "email": user.email,
        }
    )


@require_POST
def login_user(request):
    email = request.POST.get("email", "").strip().lower()
    password = request.POST.get("password", "").strip()

    if not email or not password:
        return JsonResponse(
            {
                "success": False,
                "message": "Please fill in all fields.",
            },
            status=400,
        )

    user = authenticate(request, username=email, password=password)

    if user is None:
        return JsonResponse(
            {
                "success": False,
                "message": "Incorrect email or password.",
            },
            status=400,
        )

    login(request, user)

    return JsonResponse(
        {
            "success": True,
            "message": "Login completed successfully.",
            "email": user.email,
        }
    )


@require_POST
def logout_user(request):
    logout(request)

    return JsonResponse(
        {
            "success": True,
            "message": "Logout completed successfully.",
        }
    )


@require_POST
def password_reset_request(request):
    email = request.POST.get("email", "").strip().lower()

    if not email:
        return JsonResponse(
            {
                "success": False,
                "message": "Please enter your email.",
            },
            status=400,
        )

    User = get_user_model()
    user = User.objects.filter(email=email).first()

    if user:
        reset_request = PasswordResetRequest.objects.create(
            user=user,
            email=email,
        )

        reset_url = request.build_absolute_uri(
            reverse(
                "users:password_reset_confirm",
                args=[reset_request.token],
            )
        )

        message = (
            "Hi!\n\n"
            "You requested a password reset for Hungry People.\n\n"
            f"Reset password link:\n{reset_url}\n\n"
            "This link is valid for 1 hour."
        )

        try:
            send_mail(
                subject="Reset password",
                message=message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
                fail_silently=False,
            )
        except Exception:
            return JsonResponse(
                {
                    "success": False,
                    "message": "Email is not configured correctly.",
                },
                status=500,
            )

    return JsonResponse(
        {
            "success": True,
            "message": "Reset password link sent successfully, please check mail.",
        }
    )


def password_reset_confirm(request, token):
    reset_request = get_object_or_404(
        PasswordResetRequest,
        token=token,
    )

    return render(
        request,
        "users/password_reset_confirm.html",
        {
            "reset_request": reset_request,
        },
    )


@require_POST
def password_reset_change(request, token):
    reset_request = get_object_or_404(
        PasswordResetRequest,
        token=token,
    )

    password = request.POST.get("password", "").strip()
    password_confirm = request.POST.get("password_confirm", "").strip()

    if reset_request.is_used:
        return JsonResponse(
            {
                "success": False,
                "message": "This reset link has already been used.",
            },
            status=400,
        )

    if reset_request.is_expired():
        return JsonResponse(
            {
                "success": False,
                "message": "This reset link has expired.",
            },
            status=400,
        )

    if not password or not password_confirm:
        return JsonResponse(
            {
                "success": False,
                "message": "Please fill in all fields.",
            },
            status=400,
        )

    if password != password_confirm:
        return JsonResponse(
            {
                "success": False,
                "message": "Passwords do not match.",
            },
            status=400,
        )

    if len(password) < 6:
        return JsonResponse(
            {
                "success": False,
                "message": "Password must be at least 6 characters.",
            },
            status=400,
        )

    user = reset_request.user
    user.set_password(password)
    user.save()

    reset_request.is_used = True
    reset_request.used_at = timezone.now()
    reset_request.save()

    return JsonResponse(
        {
            "success": True,
            "message": "Password changed successfully.",
        }
    )