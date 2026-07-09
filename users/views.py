from django.shortcuts import render
from django.contrib.auth import authenticate, get_user_model, login, logout
from django.http import JsonResponse
from django.views.decorators.http import require_POST


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
