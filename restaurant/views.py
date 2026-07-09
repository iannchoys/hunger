from django.conf import settings
from django.core.mail import send_mail
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.http import require_POST

from .models import Booking, ContactMessage, MenuItem, PrivateEvent, StaticBlock, Speciality


def home(request):
    menu_items = MenuItem.objects.filter(on_main=True)[:21]
    private_events = PrivateEvent.objects.filter(is_active=True)[:2]
    specialities = Speciality.objects.filter(is_active=True)

    static_blocks = {
        block.key: block
        for block in StaticBlock.objects.filter(key__in=["about", "team"])
    }

    context = {
        "menu_items": menu_items,
        "private_events": private_events,
        "about_block": static_blocks.get("about"),
        "team_block": static_blocks.get("team"),
        "specialities": specialities,
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

@require_POST
def booking_create(request):
    name = request.POST.get("name", "").strip()
    email = request.POST.get("email", "").strip()
    phone = request.POST.get("phone", "").strip()
    people = request.POST.get("people", "").strip()
    date = request.POST.get("date", "").strip()
    time = request.POST.get("time", "").strip()

    if not name or not email or not phone or not people or not date or not time:
        return JsonResponse(
            {
                "success": False,
                "message": "Please fill in all fields.",
            },
            status=400,
        )

    booking = Booking.objects.create(
        name=name,
        email=email,
        phone=phone,
        people=people,
        date=date,
        time=time,
    )

    email_text = (
        f"New table booking\n\n"
        f"Name: {booking.name}\n"
        f"Email: {booking.email}\n"
        f"Phone: {booking.phone}\n"
        f"People: {booking.people}\n"
        f"Date: {booking.date}\n"
        f"Time: {booking.time}\n"
        f"Created at: {booking.created_at}\n"
    )

    send_mail(
        subject="New table booking",
        message=email_text,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[settings.DEFAULT_FROM_EMAIL],
        fail_silently=True,
    )

    return JsonResponse(
        {
            "success": True,
            "message": "Booking sent successfully.",
        }
    )