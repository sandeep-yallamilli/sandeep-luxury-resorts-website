from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ResortViewSet, RoomViewSet, ServiceViewSet, BookingViewSet, InquiryViewSet, BannerViewSet,
    RegisterView, LoginView, ProfileView, GoogleLoginView, ConciergeView, NewsletterSubscriberView,
    CreatePaymentSessionView, ConfirmPaymentView, PaymentReceiptView
)

router = DefaultRouter()
router.register(r'resorts', ResortViewSet, basename='resort')
router.register(r'rooms', RoomViewSet, basename='room')
router.register(r'services', ServiceViewSet, basename='service')
router.register(r'banners', BannerViewSet, basename='banner')
router.register(r'bookings', BookingViewSet, basename='booking')
router.register(r'inquiries', InquiryViewSet, basename='inquiry')

urlpatterns = [
    path('', include(router.urls)),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('google-login/', GoogleLoginView.as_view(), name='google-login'),
    path('concierge/', ConciergeView.as_view(), name='concierge'),
    path('subscribe/', NewsletterSubscriberView.as_view(), name='subscribe'),
    path('payments/create-session/', CreatePaymentSessionView.as_view(), name='payment-create-session'),
    path('payments/confirm/', ConfirmPaymentView.as_view(), name='payment-confirm'),
    path('payments/receipt/<int:booking_id>/', PaymentReceiptView.as_view(), name='payment-receipt'),
]



