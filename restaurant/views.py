from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.http import require_POST

from .models import ContactMessage, MenuItem, PrivateEvent


def home(request):
    menu_items = MenuItem.objects.filter(on_main=True)[:21]
    private_events = PrivateEvent.objects.filter(is_active=True)[:2]

    context = {
        "menu_items": menu_items,
        "private_events": private_events,
    }

    return render(request, "restaurant/home.html", context)

@require_POST
def contact_create(request):
    name = request.POST.get("name", "").strip()
    email = request.POST.get("email", "").strip()
    phone = request.POST.get("phone", "").strip()
    message = request.POST.get("message", "").strip()

    if not name or not email or not phone or not message:
        return JsonResponse(
            {
                "success": False,
                "message": "Please fill in all fields.",
            },
            status=400,
        )

    ContactMessage.objects.create(
        name=name,
        email=email,
        phone=phone,
        message=message,
    )

    return JsonResponse(
        {
            "success": True,
            "message": "Message sent successfully.",
        }
    )