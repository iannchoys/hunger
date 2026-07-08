from django.shortcuts import render

from .models import MenuItem, PrivateEvent

def home(request):
    menu_items = MenuItem.objects.filter(on_main=True)[:21]
    private_events = PrivateEvent.objects.filter(is_active=True)[:2]

    context = {
        "menu_items": menu_items,
        "private_events": private_events,
    }

    return render(request, "restaurant/home.html", context)
