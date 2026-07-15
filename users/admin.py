from django.contrib import admin

from .models import User, PasswordResetRequest


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ("email", "is_staff", "is_active", "date_joined")
    search_fields = ("email",)
    list_filter = ("is_staff", "is_active")
    readonly_fields = ("date_joined", "last_login")

@admin.register(PasswordResetRequest)
class PasswordResetRequestAdmin(admin.ModelAdmin):
    list_display = ("email", "is_used", "created_at", "used_at")
    search_fields = ("email",)
    list_filter = ("is_used",)
    readonly_fields = ("token", "created_at", "used_at")