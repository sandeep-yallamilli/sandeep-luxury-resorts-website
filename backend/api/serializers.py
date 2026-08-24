import json
from rest_framework import serializers
from .models import Resort, Room, Service, Booking, Inquiry, NewsletterSubscriber, Banner

def format_image_url(val):
    if not val:
        return ""
    s = str(val).replace('\\', '/')
    if s.startswith("http://") or s.startswith("https://"):
        from urllib.parse import urlparse
        s = urlparse(s).path
    
    if 'media/' in s:
        s = s[s.find('media/'):]
    elif 'images/' in s:
        s = s[s.find('images/'):]

    if not s.startswith("/"):
        s = "/" + s
    if not s.startswith("/media/"):
        if s.startswith("/images/"):
            s = "/media" + s
        else:
            s = "/media/" + s.lstrip("/")
    return s

class ResortSerializer(serializers.ModelSerializer):
    inclusions = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()

    class Meta:
        model = Resort
        fields = ['id', 'slug', 'name', 'location', 'description', 'tagline', 'rating', 'priceStart', 'region', 'image', 'inclusions']

    def get_inclusions(self, obj):
        try:
            return json.loads(obj.inclusions)
        except Exception:
            return []

    def get_image(self, obj):
        return format_image_url(obj.image)

class RoomSerializer(serializers.ModelSerializer):
    resort_name = serializers.ReadOnlyField(source='resort.name')
    resort_slug = serializers.ReadOnlyField(source='resort.slug')
    image = serializers.SerializerMethodField()
    interior_image = serializers.SerializerMethodField()

    class Meta:
        model = Room
        fields = ['id', 'resort', 'resort_name', 'resort_slug', 'room_type', 'price', 'is_available', 'image', 'interior_image']

    def get_image(self, obj):
        return format_image_url(obj.image)

    def get_interior_image(self, obj):
        return format_image_url(obj.interior_image)

class ServiceSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = Service
        fields = ['id', 'resort', 'name', 'category', 'description', 'image']

    def get_image(self, obj):
        return format_image_url(obj.image)

class BookingSerializer(serializers.ModelSerializer):
    room_details = RoomSerializer(source='room', read_only=True)

    class Meta:
        model = Booking
        fields = [
            'id', 'user', 'room', 'room_details', 'start_date', 'end_date',
            'guests', 'special_requests', 'status', 'payment_status',
            'payment_method', 'payment_id', 'paid_at', 'total_price', 'created_at'
        ]
        read_only_fields = ['total_price', 'user', 'created_at']

    def validate(self, data):
        start_date = data.get('start_date')
        end_date = data.get('end_date')
        if start_date and end_date and end_date <= start_date:
            raise serializers.ValidationError({'end_date': 'Check-out date must be after check-in date.'})
        return data

    def create(self, validated_data):
        from django.utils import timezone
        start_date = validated_data.get('start_date')
        end_date = validated_data.get('end_date')
        room = validated_data.get('room')
        
        if start_date and end_date and room:
            days = max(1, (end_date - start_date).days)
            validated_data['total_price'] = days * room.price

        if validated_data.get('payment_status') == 'paid' and not validated_data.get('paid_at'):
            validated_data['paid_at'] = timezone.now()
            
        return super().create(validated_data)

class InquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = Inquiry
        fields = ['id', 'name', 'email', 'phone', 'resort', 'subject', 'message', 'created_at']

class NewsletterSubscriberSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsletterSubscriber
        fields = ['id', 'email', 'subscribed_at']


class BannerSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = Banner
        fields = ['id', 'page', 'title', 'subtitle', 'image']

    def get_image(self, obj):
        return format_image_url(obj.image)

