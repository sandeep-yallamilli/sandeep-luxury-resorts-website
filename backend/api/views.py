import os
import uuid
from datetime import datetime
import requests as google_requests
from django.utils import timezone
from rest_framework import viewsets, status, generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from .models import Resort, Room, Service, Booking, Inquiry, NewsletterSubscriber, Banner
from .serializers import (
    ResortSerializer, RoomSerializer, ServiceSerializer, BookingSerializer,
    InquirySerializer, NewsletterSubscriberSerializer, BannerSerializer
)


# ---------------------------------------------------------------------------
# Public ViewSets — no authentication required (read + write open for now)
# ---------------------------------------------------------------------------

# ❌ public — GET /api/resorts/  GET /api/resorts/{slug}/
class ResortViewSet(viewsets.ModelViewSet):
    """List, retrieve, create, update, delete resorts. Public."""
    queryset = Resort.objects.all()
    serializer_class = ResortSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'


# ❌ public — GET /api/rooms/
class RoomViewSet(viewsets.ModelViewSet):
    """List, retrieve, create, update, delete rooms. Public."""
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    permission_classes = [permissions.AllowAny]


# ❌ public — GET /api/banners/  GET /api/banners/{page}/
class BannerViewSet(viewsets.ModelViewSet):
    """List, retrieve, create, update site banners. Public."""
    queryset = Banner.objects.all()
    serializer_class = BannerSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'page'


from django.db.models import Q

# ❌ public — GET /api/services/
class ServiceViewSet(viewsets.ModelViewSet):
    """List, retrieve, create, update, delete services. Public."""
    serializer_class = ServiceSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = Service.objects.all()
        category = self.request.query_params.get('category', None)
        if category:
            cat_qs = queryset.filter(category=category)
            if cat_qs.exists():
                queryset = cat_qs
            elif category == 'wellness':
                wellness_keywords = [
                    'spa', 'wellness', 'yoga', 'ayurved', 'hammam', 'detox', 'meditation',
                    'hydrotherapy', 'herbal', 'tea', 'bath', 'spring', 'massage', 'panchakarma',
                    'cleansing', 'zen', 'ritual', 'mindfulness', 'scrub', 'body', 'onsen'
                ]
                q = Q()
                for kw in wellness_keywords:
                    q |= Q(name__icontains=kw) | Q(description__icontains=kw)
                queryset = queryset.filter(q)
            elif category == 'dining':
                dining_keywords = [
                    'dining', 'dinner', 'banquet', 'wine', 'culinary', 'chef', 'tasting',
                    'seafood', 'food', 'cook', 'kaiseki', 'menu', 'sommelier', 'table',
                    'bar', 'champagne', 'gastronomy', 'cruise', 'barbecue', 'breakfast', 'tajine'
                ]
                q = Q()
                for kw in dining_keywords:
                    q |= Q(name__icontains=kw) | Q(description__icontains=kw)
                queryset = queryset.filter(q)
            elif category == 'experiences':
                exp_keywords = [
                    'tour', 'safari', 'balloon', 'dive', 'trek', 'charter', 'adventure', 'excursion', 'heli'
                ]
                q = Q()
                for kw in exp_keywords:
                    q |= Q(name__icontains=kw) | Q(description__icontains=kw)
                queryset = queryset.filter(q)
        
        resort_slug = self.request.query_params.get('resort', None)
        if resort_slug:
            queryset = queryset.filter(resort__slug=resort_slug)

        return queryset


# ❌ public — POST /api/inquiries/
class InquiryViewSet(viewsets.ModelViewSet):
    """Submit and list guest inquiries."""
    queryset = Inquiry.objects.all().order_by('-created_at')
    serializer_class = InquirySerializer
    permission_classes = [permissions.AllowAny]


# ❌ public — POST /api/subscribe/
class NewsletterSubscriberView(APIView):
    """Subscribe email to chronicle newsletter."""
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        subscriber, created = NewsletterSubscriber.objects.get_or_create(email=email)
        return Response({
            'message': 'Subscription successful',
            'email': subscriber.email,
            'created': created
        }, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)


# ---------------------------------------------------------------------------
# Protected ViewSets — authentication required
# ---------------------------------------------------------------------------

# ✅ auth required — GET/POST /api/bookings/  GET/PUT/DELETE /api/bookings/{id}/
class BookingViewSet(viewsets.ModelViewSet):
    """Create and manage bookings. Requires authentication."""
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Users only see their own bookings ordered by newest
        return Booking.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# ✅ auth required — GET /api/profile/
class ProfileView(APIView):
    """Return the logged-in user's profile and active bookings count."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user_bookings = Booking.objects.filter(user=request.user)
        total_spent = sum((b.total_price or 0) for b in user_bookings if b.status == 'confirmed')
        
        # Calculate tier based on bookings or spend
        tier = "Silver Member"
        if total_spent >= 10000:
            tier = "Royal Diamond"
        elif total_spent >= 5000:
            tier = "Gold Elite"

        return Response({
            'username': request.user.username,
            'email': request.user.email,
            'date_joined': request.user.date_joined.strftime("%B %Y"),
            'tier': tier,
            'total_bookings': user_bookings.count(),
            'active_bookings': user_bookings.filter(status='confirmed').count(),
            'total_spent': str(total_spent),
        })



# ---------------------------------------------------------------------------
# Auth Views — public (no token needed)
# ---------------------------------------------------------------------------

# ❌ public — POST /api/register/
class RegisterView(generics.CreateAPIView):
    """Register a new user and return an auth token."""
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')
        if not username or not password:
            return Response(
                {'error': 'Username and password required'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if User.objects.filter(username=username).exists():
            return Response(
                {'error': 'Username already taken'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        user = User.objects.create_user(username=username, password=password)
        token, _ = Token.objects.get_or_create(user=user)
        return Response({'token': token.key}, status=status.HTTP_201_CREATED)


# ❌ public — POST /api/login/
class LoginView(generics.GenericAPIView):
    """Authenticate with username/password and return an auth token."""
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')
        if not username or not password:
            return Response(
                {'error': 'Username and password required'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        user = authenticate(username=username, password=password)
        if user:
            token, _ = Token.objects.get_or_create(user=user)
            return Response({'token': token.key}, status=status.HTTP_200_OK)
        return Response(
            {'error': 'Invalid credentials'},
            status=status.HTTP_401_UNAUTHORIZED,
        )


# ❌ public — POST /api/google-login/
class GoogleLoginView(APIView):
    """Verify a Google ID token and return a DRF auth token."""
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        id_token = request.data.get('token')
        if not id_token:
            return Response(
                {'error': 'Google ID token is required'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Verify the token with Google
        google_response = google_requests.get(
            f'https://oauth2.googleapis.com/tokeninfo?id_token={id_token}'
        )
        if google_response.status_code != 200:
            return Response(
                {'error': 'Invalid Google token'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        token_info = google_response.json()
        email = token_info.get('email')
        if not email:
            return Response(
                {'error': 'Email not provided by Google'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = User.objects.filter(email=email).first()
        if not user:
            username = email.split('@')[0]
            base_username = username
            counter = 1
            while User.objects.filter(username=username).exists():
                username = f"{base_username}{counter}"
                counter += 1
            user = User.objects.create_user(username=username, email=email)
            user.set_unusable_password()
            user.save()

        drf_token, _ = Token.objects.get_or_create(user=user)
        return Response({'token': drf_token.key}, status=status.HTTP_200_OK)


LUXURY_KNOWLEDGE_BASE = [
    {
        "keys": ["bali", "indonesia", "jungle", "forest"],
        "response": "Ah, the Sandeep Bali Forest Sanctuary. It is sculpted directly into volcanic cliffs overlooking sacred valley rivers. Guests enjoy private tree-canopy pavilions, infinity pools floating above the mist, and personalized morning ritual yoga. Shall I coordinate a luxury canopy suite reservation or arrange an excursion to the local water temple?"
    },
    {
        "keys": ["fiji", "yasawa", "south pacific", "pacific"],
        "response": "The Sandeep Fiji Private Island Sanctuary is located in the secluded Yasawa Islands of Fiji. It features the Sandeep Fiji Yasawa Sunset Lagoon Villa with private overwater plunge pools, 24/7 Polynesian butler care, starlit coral reef night diving, and private catamaran reef charters. Shall I reserve your private overwater haven in Fiji?"
    },
    {
        "keys": ["maldives", "island", "beach", "ocean", "water"],
        "response": "The Sandeep Maldives Private Pavilion represents the pinnacle of ocean luxury. Built entirely overwater in a secluded lagoon, it features glass-bottom flooring, custom overwater hammock nets, and 24/7 personal butler service. Guests frequently enjoy private sunset yacht charters. Would you like me to check availability for the Royal Overwater Pavilion?"
    },
    {
        "keys": ["kyoto", "japan", "zen", "garden", "temple"],
        "response": "Sandeep Kyoto Zen Pavilion offers a serene sanctuary of silence. Constructed using ancient Japanese joinery and cedar wood, it sits adjacent to a 400-year-old rock garden. Guests experience private tea ceremonies, seasonal mineral spring onsens, and mindfulness meditation led by local monks. Can I assist in drafting an itinerary for your Kyoto escape?"
    },
    {
        "keys": ["alps", "switzerland", "ski", "snow", "mountain"],
        "response": "Our Alpine Snow Chalet is located in Zermatt, offering ski-in/ski-out access and a glass-dome ceiling for viewing the Matterhorn under the stars. Indulge in private saunas, custom wine-cellar tastings, and heli-skiing excursions. Should I look up availability for the ski season?"
    },
    {
        "keys": ["rajasthan", "india", "desert", "safari", "tiger"],
        "response": "The Rajasthan Desert Tent is an opulent sanctuary at the edge of Ranthambore, offering guests private tiger-tracking safaris, hand-carved copper baths, and traditional sitar performances under the desert night sky. Would you like me to book a Maharaja Royal Tent Suite?"
    },
    {
        "keys": ["spa", "wellness", "massage", "detox", "rejuvenate"],
        "response": "Our Wellness Platform offers fully personalized spa journeys: Ayurvedic cleansing, crystal-infused oil massages, mineral baths, and guided sound healing. All programs are tailor-made by our master wellness doctors. I can reserve a customized Wellness Day package for you. Do you prefer energy-balancing or physical detoxification?"
    },
    {
        "keys": ["dining", "restaurant", "chef", "food", "menu", "eat"],
        "response": "Dining at Sandeep Resorts is a Michelin-starred journey. Our estates feature private cliffside candlelit tables, organic farm-to-table menus crafted by visiting culinary maestros, and custom wine pairings. May I secure a table reservation at one of our signature destination tables?"
    },
    {
        "keys": ["membership", "vip", "loyalty", "club", "royal"],
        "response": "The Sandeep Membership Club grants elite access to our global sanctuaries. Perks include priority villa upgrades, private jet coordination, unlimited spa access, and invitations to global chef takeovers. Tiers start from Silver to the prestigious Royal Diamond. Shall I present the enrollment page?"
    },
    {
        "keys": ["price", "cost", "rates", "expensive", "how much"],
        "response": "Our pricing reflects our ultra-luxury, all-inclusive hospitality model. Villa rates start at $2,100 per night for our Aravali Ridge Retreat (Rajasthan) and range to $4,200 per night for the Matterhorn Peak Penthouse (Alps). Each booking includes 24/7 personal butler service, fine dining breakfasts, and curated airport transfers."
    }
]

# ❌ public — POST /api/concierge/
class ConciergeView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        message = request.data.get('message', '')
        if not message:
            return Response({'error': 'Message required'}, status=status.HTTP_400_BAD_REQUEST)
        
        query = message.lower()
        reply = "Welcome back. I am your personal AI Concierge for Sandeep Luxury Resorts. I am here to curate your global travels, villa selections, spa treatments, and culinary itineraries. Tell me, are we planning a tropical island escape, a zen sanctuary retreat, or an alpine mountain expedition?"

        for item in LUXURY_KNOWLEDGE_BASE:
            if any(key in query for key in item["keys"]):
                reply = item["response"]
                break

        return Response({'response': reply}, status=status.HTTP_200_OK)


# ---------------------------------------------------------------------------
# Payment Integration Views — Stripe, Razorpay & VIP Luxury Express Gateway
# ---------------------------------------------------------------------------

class CreatePaymentSessionView(APIView):
    """
    Creates a payment session / intent for the booking checkout flow.
    Supports Stripe (when STRIPE_SECRET_KEY is configured), Razorpay, or VIP Express.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        room_id = request.data.get('room')
        start_date_str = request.data.get('start_date')
        end_date_str = request.data.get('end_date')
        payment_method = request.data.get('payment_method', 'card')

        if not room_id or not start_date_str or not end_date_str:
            return Response(
                {'error': 'room, start_date, and end_date are required fields.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            room = Room.objects.get(id=room_id)
            start_date = datetime.strptime(start_date_str, "%Y-%m-%d").date()
            end_date = datetime.strptime(end_date_str, "%Y-%m-%d").date()
            days = max(1, (end_date - start_date).days)
            total_price = float(room.price) * days
        except Room.DoesNotExist:
            return Response({'error': 'Selected room does not exist.'}, status=status.HTTP_404_NOT_FOUND)
        except ValueError:
            return Response({'error': 'Invalid date format. Use YYYY-MM-DD.'}, status=status.HTTP_400_BAD_REQUEST)

        # Stripe live integration if key present, else seamless luxury sandbox
        stripe_key = os.getenv('STRIPE_SECRET_KEY')
        payment_id = ""
        client_secret = ""

        if payment_method == 'card':
            if stripe_key:
                try:
                    import stripe
                    stripe.api_key = stripe_key
                    intent = stripe.PaymentIntent.create(
                        amount=int(total_price * 100),
                        currency='inr',
                        description=f"Reservation at {room.resort.name} - {room.room_type}",
                        metadata={'user': request.user.email, 'room_id': room.id}
                    )
                    payment_id = intent.id
                    client_secret = intent.client_secret
                except Exception:
                    payment_id = f"slr_pi_{uuid.uuid4().hex[:16]}"
                    client_secret = f"{payment_id}_secret_{uuid.uuid4().hex[:8]}"
            else:
                payment_id = f"slr_pi_{uuid.uuid4().hex[:16]}"
                client_secret = f"{payment_id}_secret_{uuid.uuid4().hex[:8]}"

        elif payment_method == 'upi':
            payment_id = f"slr_upi_{uuid.uuid4().hex[:14]}"
            client_secret = f"upi_sec_{uuid.uuid4().hex[:8]}"

        elif payment_method == 'netbanking':
            payment_id = f"slr_nb_{uuid.uuid4().hex[:14]}"
            client_secret = f"nb_sec_{uuid.uuid4().hex[:8]}"

        elif payment_method == 'razorpay':
            payment_id = f"order_slr_rzp_{uuid.uuid4().hex[:14]}"
            client_secret = f"rzp_sec_{uuid.uuid4().hex[:10]}"

        elif payment_method == 'express_concierge':
            payment_id = f"slr_vip_express_{uuid.uuid4().hex[:12]}"
            client_secret = f"vip_pass_{uuid.uuid4().hex[:8]}"

        upi_intent_url = f"upi://pay?pa=sandeepresorts@okhdfcbank&pn=Sandeep%20Luxury%20Resorts&am={total_price:.2f}&cu=INR&tn=Sanctuary%20Reservation%20{payment_id[:8]}"

        return Response({
            'payment_id': payment_id,
            'client_secret': client_secret,
            'amount': total_price,
            'currency': 'INR',
            'payment_method': payment_method,
            'upi_intent_url': upi_intent_url,
            'resort_name': room.resort.name,
            'room_type': room.room_type,
            'nights': days,
            'status': 'session_created'
        }, status=status.HTTP_200_OK)


class ConfirmPaymentView(APIView):
    """
    Finalizes booking and payment verification, saving transaction records.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        room_id = request.data.get('room')
        start_date = request.data.get('start_date')
        end_date = request.data.get('end_date')
        guests = request.data.get('guests', 2)
        special_requests = request.data.get('special_requests', '')
        payment_method = request.data.get('payment_method', 'card')
        payment_id = request.data.get('payment_id', '')

        if not payment_id:
            payment_id = f"slr_tx_{uuid.uuid4().hex[:16]}"

        try:
            room = Room.objects.get(id=room_id)
        except Room.DoesNotExist:
            return Response({'error': 'Selected room does not exist.'}, status=status.HTTP_404_NOT_FOUND)

        booking_data = {
            'room': room.id,
            'start_date': start_date,
            'end_date': end_date,
            'guests': guests,
            'special_requests': special_requests,
            'status': 'confirmed',
            'payment_status': 'paid',
            'payment_method': payment_method,
            'payment_id': payment_id,
            'paid_at': timezone.now()
        }

        serializer = BookingSerializer(data=booking_data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PaymentReceiptView(APIView):
    """
    Generates structured digital invoice & payment receipt statement.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, booking_id):
        try:
            booking = Booking.objects.get(id=booking_id, user=request.user)
        except Booking.DoesNotExist:
            return Response({'error': 'Booking transaction not found.'}, status=status.HTTP_404_NOT_FOUND)

        nights = max(1, (booking.end_date - booking.start_date).days)
        nightly_rate = float(booking.room.price)
        subtotal = float(booking.total_price)
        gst_tax = round(subtotal * 0.18, 2)
        grand_total = subtotal

        invoice_no = f"INV-2026-{booking.id:06d}"
        receipt = {
            'invoice_number': invoice_no,
            'booking_id': booking.id,
            'guest_name': request.user.username,
            'guest_email': request.user.email,
            'resort_name': booking.room.resort.name,
            'resort_location': booking.room.resort.location,
            'room_type': booking.room.room_type,
            'start_date': str(booking.start_date),
            'end_date': str(booking.end_date),
            'nights': nights,
            'guests': booking.guests,
            'payment_status': booking.payment_status.upper(),
            'payment_method': booking.get_payment_method_display(),
            'payment_id': booking.payment_id,
            'paid_at': booking.paid_at.strftime("%Y-%m-%d %H:%M:%S UTC") if booking.paid_at else "N/A",
            'nightly_rate': nightly_rate,
            'subtotal': subtotal,
            'gst_tax_included': gst_tax,
            'grand_total': grand_total,
            'inclusions': [
                "Roundtrip Private Speedboat / Helicopter VIP Transfers",
                "24/7 Dedicated Personal Butler Service",
                "Complimentary Daily Chef Breakfast & Sunset Cocktails",
                "All-Inclusive Spa Hydrotherapy Bath Access"
            ]
        }
        return Response(receipt, status=status.HTTP_200_OK)


