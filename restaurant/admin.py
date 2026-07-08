from django.contrib import admin

from .models import MenuItem


@admin.register(MenuItem)
class MenuItemAdmin(admin.ModelAdmin):
    list_display = ("title", "category", "price", "on_main")
    list_filter = ("category", "on_main")
    search_fields = ("title", "subtitle")