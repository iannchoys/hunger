from django.db import models


class MenuItem(models.Model):
    CATEGORY_SOUPE = "soupe"
    CATEGORY_PIZZA = "pizza"
    CATEGORY_PASTA = "pasta"
    CATEGORY_DESERT = "desert"
    CATEGORY_WINE = "wine"
    CATEGORY_BEER = "beer"
    CATEGORY_DRINKS = "drinks"

    CATEGORY_CHOICES = [
        (CATEGORY_SOUPE, "Soupe"),
        (CATEGORY_PIZZA, "Pizza"),
        (CATEGORY_PASTA, "Pasta"),
        (CATEGORY_DESERT, "Desert"),
        (CATEGORY_WINE, "Wine"),
        (CATEGORY_BEER, "Beer"),
        (CATEGORY_DRINKS, "Drinks"),
    ]

    title = models.CharField(max_length=120)
    subtitle = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    on_main = models.BooleanField(default=True)

    class Meta:
        ordering = ["category", "title"]

    def __str__(self):
        return self.title
    
class PrivateEvent(models.Model):
    title = models.CharField(max_length=120)
    subtitle = models.CharField(max_length=255, blank=True)
    text = models.TextField(blank=True)
    image = models.CharField(max_length=255)
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["order", "title"]

    def __str__(self):
        return self.title

class ContactMessage(models.Model):
    name = models.CharField(max_length=120)
    email = models.EmailField()
    phone = models.CharField(max_length=40)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.name} - {self.email}"