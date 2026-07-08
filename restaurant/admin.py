from .models import MenuItem, PrivateEvent

from django.contrib import admin


@admin.register(MenuItem)
class MenuItemAdmin(admin.ModelAdmin):
    list_display = ("title", "category", "price", "on_main")
    list_filter = ("category", "on_main")
    search_fields = ("title", "subtitle")

@admin.register(PrivateEvent)
class PrivateEventAdmin(admin.ModelAdmin):
    list_display = ("title", "order", "is_active")
    list_filter = ("is_active",)
    search_fields = ("title", "subtitle", "text")