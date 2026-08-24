import os
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from django.db.models.signals import post_delete, pre_save
from django.dispatch import receiver

class Resort(models.Model):
    slug = models.SlugField(max_length=100, unique=True, null=True, blank=True)
    name = models.CharField(max_length=200)
    location = models.CharField(max_length=200)
    description = models.TextField()
    tagline = models.CharField(max_length=300, null=True, blank=True)
    rating = models.FloatField(default=5.0)
    priceStart = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    region = models.CharField(max_length=100, default='all')
    image = models.ImageField(upload_to='images/', max_length=500, null=True, blank=True)
    inclusions = models.TextField(default='[]', blank=True)

    def __str__(self):
        return self.name

class Room(models.Model):
    resort = models.ForeignKey(Resort, on_delete=models.CASCADE, related_name='rooms')
    room_type = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    is_available = models.BooleanField(default=True)
    image = models.ImageField(upload_to='images/', max_length=500, null=True, blank=True)
    interior_image = models.ImageField(upload_to='images/', max_length=500, null=True, blank=True)

    def __str__(self):
        return f"{self.room_type} at {self.resort.name}"

class Service(models.Model):
    CATEGORY_CHOICES = [
        ('wellness', 'Wellness & Spa'),
        ('dining', 'Fine Dining & Culinary'),
        ('experiences', 'Experiences & Adventures'),
        ('general', 'General Resort Service'),
    ]

    resort = models.ForeignKey(Resort, on_delete=models.CASCADE, related_name='services', null=True, blank=True)
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='general', db_index=True)
    description = models.TextField()
    image = models.ImageField(upload_to='images/', max_length=500, null=True, blank=True)

    def __str__(self):
        return f"{self.name} ({self.get_category_display()})"

class Booking(models.Model):
    STATUS_CHOICES = [
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
        ('completed', 'Completed'),
    ]

    PAYMENT_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('paid', 'Paid'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
    ]

    PAYMENT_METHOD_CHOICES = [
        ('card', 'Credit / Debit Card (Stripe)'),
        ('upi', 'UPI (Google Pay, PhonePe, Paytm, BHIM)'),
        ('netbanking', 'Indian NetBanking & Wallets'),
        ('razorpay', 'Razorpay Gateway'),
        ('express_concierge', 'Sandeep Luxury VIP Express Pay'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookings')
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='bookings')
    start_date = models.DateField()
    end_date = models.DateField()
    guests = models.IntegerField(default=2)
    special_requests = models.TextField(blank=True, default='')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='confirmed')
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='paid')
    payment_method = models.CharField(max_length=50, choices=PAYMENT_METHOD_CHOICES, default='card')
    payment_id = models.CharField(max_length=100, blank=True, default='')
    paid_at = models.DateTimeField(null=True, blank=True)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Booking #{self.id} - {self.user.username} at {self.room.resort.name} ({self.status} - {self.payment_status})"

class Inquiry(models.Model):
    name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=50, blank=True, default='')
    resort = models.CharField(max_length=200, blank=True, default='')
    subject = models.CharField(max_length=300, blank=True, default='')
    message = models.TextField()
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Inquiry from {self.name} ({self.email})"

class NewsletterSubscriber(models.Model):
    email = models.EmailField(unique=True)
    subscribed_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.email


class Banner(models.Model):
    page = models.CharField(max_length=100, unique=True, help_text="e.g. home_hero, villas_hero, experiences_hero, wellness_hero, dining_hero, weddings_hero, membership_hero, sustainability_hero")
    title = models.CharField(max_length=200, blank=True, default='')
    subtitle = models.CharField(max_length=300, blank=True, default='')
    image = models.ImageField(upload_to='images/', max_length=500, blank=True, null=True, help_text="Upload custom banner image. Check '[x] Clear' or leave empty to use default website image.")

    def __str__(self):
        return f"Banner for {self.page}"


# Automatic Cleanup Signals for Media Files
def _delete_file_if_exists(file_field):
    if not file_field or not getattr(file_field, 'name', None):
        return
    try:
        file_path = file_field.path
        if not file_path or not os.path.isfile(file_path):
            return
        
        # Protect shared default system images from deletion
        base_name = os.path.basename(file_path).lower()
        if 'service' in base_name or 'hero' in base_name or 'villa' in base_name or 'interior' in base_name:
            return
        if base_name in ['maldives.png', 'bali.png', 'kyoto.png', 'alps.png', 'rajasthan.png', 
                         'santorini.png', 'amalfi.png', 'borabora.png', 'serengeti.png', 
                         'seychelles.png', 'marrakech.png', 'zanzibar.png', 'kerala.png', 
                         'himalayas.png', 'thailand.png', 'fiji.png', 'membership_club.png']:
            return

        os.remove(file_path)
    except Exception:
        pass

def auto_delete_file_on_delete(sender, instance, **kwargs):
    """Deletes file from filesystem when corresponding model instance is deleted."""
    for field_name in ['image', 'interior_image']:
        if hasattr(instance, field_name):
            _delete_file_if_exists(getattr(instance, field_name))

def auto_delete_file_on_change(sender, instance, **kwargs):
    """Deletes old file from filesystem when corresponding model instance image is replaced or cleared."""
    if not instance.pk:
        return
    try:
        old_instance = sender.objects.get(pk=instance.pk)
    except sender.DoesNotExist:
        return

    for field_name in ['image', 'interior_image']:
        if hasattr(instance, field_name) and hasattr(old_instance, field_name):
            old_file = getattr(old_instance, field_name)
            new_file = getattr(instance, field_name)
            if old_file and old_file != new_file:
                _delete_file_if_exists(old_file)

# Register signals for all models containing ImageFields
for model in [Resort, Room, Service, Banner]:
    post_delete.connect(auto_delete_file_on_delete, sender=model)
    pre_save.connect(auto_delete_file_on_change, sender=model)


