from django.urls import path

from . import views


app_name = "restaurant"

urlpatterns = [
    path("", views.home, name="home"),
    path("contact/create/", views.contact_create, name="contact_create"),
]