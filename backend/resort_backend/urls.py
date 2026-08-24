"""resort_backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
import os
from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.views.static import serve
from django.http import Http404

def serve_smart_image(request, path):
    # Clean leading slashes or prefixes
    clean_path = path.lstrip('/')
    if clean_path.startswith('media/'):
        clean_path = clean_path[6:]
    if clean_path.startswith('images/'):
        clean_path = clean_path[7:]

    if not clean_path:
        raise Http404("Image path is empty")

    # Search in MEDIA_ROOT / 'images'
    target_in_images = settings.MEDIA_ROOT / 'images' / clean_path
    if target_in_images.exists() and target_in_images.is_file():
        return serve(request, clean_path, document_root=settings.MEDIA_ROOT / 'images')

    # Search directly in MEDIA_ROOT
    target_in_root = settings.MEDIA_ROOT / clean_path
    if target_in_root.exists() and target_in_root.is_file():
        return serve(request, clean_path, document_root=settings.MEDIA_ROOT)

    # Search space/underscore normalized filename
    alt_name = clean_path.replace(' ', '_') if ' ' in clean_path else clean_path.replace('_', ' ')
    alt_target_in_images = settings.MEDIA_ROOT / 'images' / alt_name
    if alt_target_in_images.exists() and alt_target_in_images.is_file():
        return serve(request, alt_name, document_root=settings.MEDIA_ROOT / 'images')

    alt_target_in_root = settings.MEDIA_ROOT / alt_name
    if alt_target_in_root.exists() and alt_target_in_root.is_file():
        return serve(request, alt_name, document_root=settings.MEDIA_ROOT)

    raise Http404(f"Image '{path}' not found")

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    re_path(r'^images/(?P<path>.*)$', serve_smart_image),
    re_path(r'^media/images/(?P<path>.*)$', serve_smart_image),
    re_path(r'^media/(?P<path>.*)$', serve_smart_image),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

