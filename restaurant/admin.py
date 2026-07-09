from .models import Booking, ContactMessage, MenuItem, PrivateEvent, StaticBlock

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

@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "phone", "created_at")
    search_fields = ("name", "email", "phone", "message")
    readonly_fields = ("created_at",)

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "phone", "people", "date", "time", "created_at")
    search_fields = ("name", "email", "phone")
    readonly_fields = ("created_at",)

@admin.register(StaticBlock)
class StaticBlockAdmin(admin.ModelAdmin):
    list_display = ("key", "title", "image")
    search_fields = ("key", "title", "subtitle", "text")