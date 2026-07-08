from django.shortcuts import render

from .models import MenuItem


def home(request):
    menu_items = MenuItem.objects.filter(on_main=True)[:21]

    context = {
        "menu_items": menu_items,
    }

    return render(request, "restaurant/home.html", context)