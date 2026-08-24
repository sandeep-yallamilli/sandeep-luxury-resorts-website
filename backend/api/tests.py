from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from .models import Resort, Room
from django.contrib.auth.models import User

class ResortApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.resort = Resort.objects.create(name="Test Resort", location="Test Loc", description="Test Desc")

    def test_get_resorts(self):
        response = self.client.get('/api/resorts/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 6)

class BookingApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='password')
        self.resort = Resort.objects.create(name="Test Resort", location="Loc", description="Desc")
        self.room = Room.objects.create(resort=self.resort, room_type="Suite", price=100.00)

    def test_create_booking(self):
        self.client.force_authenticate(user=self.user)
        data = {
            'user': self.user.id,
            'room': self.room.id,
            'start_date': '2026-07-02',
            'end_date': '2026-07-05'
        }
        response = self.client.post('/api/bookings/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
