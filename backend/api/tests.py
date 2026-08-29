from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from rest_framework.authtoken.models import Token
from .models import Resort, Room, Service, Booking, Inquiry, NewsletterSubscriber, Banner


class ResortApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.resort = Resort.objects.create(
            name="Aura Sanctuary Maldives",
            slug="aura-sanctuary-maldives",
            location="Baa Atoll, Maldives",
            description="Luxury overwater villas surrounded by turquoise lagoons.",
            tagline="Private island sanctuary",
            rating=4.9,
            priceStart=1200.0,
            region="Indian Ocean"
        )

    def test_get_resorts(self):
        response = self.client.get('/api/resorts/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)
        resort_names = [r['name'] for r in response.data]
        self.assertIn("Aura Sanctuary Maldives", resort_names)

    def test_get_resort_detail(self):
        response = self.client.get(f'/api/resorts/{self.resort.slug}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], "Aura Sanctuary Maldives")
        self.assertEqual(response.data['slug'], "aura-sanctuary-maldives")


class RoomApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.resort = Resort.objects.create(
            name="Alpine Horizon Chalet",
            slug="alpine-horizon-chalet",
            location="Zermatt, Switzerland",
            description="Mountain retreat"
        )
        self.room = Room.objects.create(
            resort=self.resort,
            room_type="Presidential Suite",
            price=2500.00,
            is_available=True
        )

    def test_get_rooms(self):
        response = self.client.get('/api/rooms/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)
        room_types = [r['room_type'] for r in response.data]
        self.assertIn("Presidential Suite", room_types)


class ServiceApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.resort = Resort.objects.create(
            name="Serenity Bay",
            slug="serenity-bay",
            location="Bali, Indonesia",
            description="Coastal paradise"
        )
        self.spa_service = Service.objects.create(
            resort=self.resort,
            name="Ayurvedic Lotus Spa",
            category="wellness",
            description="Holistic rejuvenating massage ritual"
        )
        self.dining_service = Service.objects.create(
            resort=self.resort,
            name="Starlight Michelin Dinner",
            category="dining",
            description="Fine private beachfront dining"
        )

    def test_get_services(self):
        response = self.client.get('/api/services/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 2)

    def test_filter_services_by_category(self):
        response = self.client.get('/api/services/?category=wellness')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        categories = [s['category'] for s in response.data]
        self.assertTrue(all(c == 'wellness' or 'spa' in s['name'].lower() for s, c in zip(response.data, categories)))


class BookingApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user1 = User.objects.create_user(username='guest1', password='Password123!', email='guest1@example.com')
        self.user2 = User.objects.create_user(username='guest2', password='Password123!', email='guest2@example.com')
        self.resort = Resort.objects.create(
            name="Desert Oasis",
            slug="desert-oasis",
            location="Dubai, UAE",
            description="Royal dunes"
        )
        self.room = Room.objects.create(
            resort=self.resort,
            room_type="Royal Villa",
            price=1500.00,
            is_available=True
        )

    def test_create_booking_authenticated(self):
        self.client.force_authenticate(user=self.user1)
        data = {
            'room': self.room.id,
            'start_date': '2026-10-01',
            'end_date': '2026-10-05',
            'guests': 2,
            'special_requests': 'Late check-in please'
        }
        response = self.client.post('/api/bookings/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['guests'], 2)
        # 4 days * 1500 = 6000.00
        self.assertEqual(float(response.data['total_price']), 6000.00)

    def test_create_booking_invalid_dates(self):
        self.client.force_authenticate(user=self.user1)
        data = {
            'room': self.room.id,
            'start_date': '2026-10-05',
            'end_date': '2026-10-01',
            'guests': 2
        }
        response = self.client.post('/api/bookings/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_booking_unauthenticated(self):
        data = {
            'room': self.room.id,
            'start_date': '2026-10-01',
            'end_date': '2026-10-05',
            'guests': 2
        }
        response = self.client.post('/api/bookings/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_user_sees_only_own_bookings(self):
        Booking.objects.create(
            user=self.user1,
            room=self.room,
            start_date='2026-11-01',
            end_date='2026-11-03',
            guests=2,
            total_price=3000.00
        )
        Booking.objects.create(
            user=self.user2,
            room=self.room,
            start_date='2026-12-01',
            end_date='2026-12-03',
            guests=1,
            total_price=3000.00
        )

        self.client.force_authenticate(user=self.user1)
        response = self.client.get('/api/bookings/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['guests'], 2)


class InquiryApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_create_inquiry(self):
        data = {
            'name': 'Alex Morgan',
            'email': 'alex@example.com',
            'phone': '+1 555-0199',
            'subject': 'Private Island Buyout',
            'message': 'Inquiring about full island buyout for wedding event.'
        }
        response = self.client.post('/api/inquiries/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Inquiry.objects.count(), 1)
        self.assertEqual(Inquiry.objects.first().name, 'Alex Morgan')


class NewsletterApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_subscribe_newsletter(self):
        response = self.client.post('/api/subscribe/', {'email': 'vip@luxurytravel.com'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(NewsletterSubscriber.objects.filter(email='vip@luxurytravel.com').exists())

    def test_subscribe_duplicate_email(self):
        NewsletterSubscriber.objects.create(email='vip@luxurytravel.com')
        response = self.client.post('/api/subscribe/', {'email': 'vip@luxurytravel.com'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(NewsletterSubscriber.objects.filter(email='vip@luxurytravel.com').count(), 1)


class AuthAndProfileApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_register_user_success(self):
        data = {
            'username': 'royalguest',
            'password': 'SecurePassword#2026'
        }
        response = self.client.post('/api/register/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('token', response.data)
        self.assertTrue(User.objects.filter(username='royalguest').exists())

    def test_register_duplicate_username(self):
        User.objects.create_user(username='existinguser', password='password123')
        data = {
            'username': 'existinguser',
            'password': 'Password456!'
        }
        response = self.client.post('/api/register/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_success(self):
        User.objects.create_user(username='loginuser', password='Password123!')
        data = {
            'username': 'loginuser',
            'password': 'Password123!'
        }
        response = self.client.post('/api/login/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('token', response.data)

    def test_login_invalid_credentials(self):
        User.objects.create_user(username='loginuser', password='Password123!')
        data = {
            'username': 'loginuser',
            'password': 'WrongPassword'
        }
        response = self.client.post('/api/login/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_profile_endpoint(self):
        user = User.objects.create_user(username='profileuser', password='Password123!', email='profile@example.com')
        token = Token.objects.create(user=user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)

        response = self.client.get('/api/profile/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], 'profileuser')
        self.assertEqual(response.data['email'], 'profile@example.com')
        self.assertEqual(response.data['tier'], 'Silver Member')


class BannerApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        Banner.objects.create(
            page='home',
            title='Experience The Unrivaled Sanctuary',
            subtitle='Ultra-luxury resorts & private estates across the globe'
        )

    def test_get_banners(self):
        response = self.client.get('/api/banners/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)
