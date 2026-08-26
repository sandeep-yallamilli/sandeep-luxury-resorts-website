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
from django.http import Http404, JsonResponse, HttpResponse

def serve_smart_image(request, path):
    # Clean leading slashes or prefixes
    clean_path = path.lstrip('/')
    if clean_path.startswith('media/'):
        clean_path = clean_path[6:]
    if clean_path.startswith('images/'):
        clean_path = clean_path[7:]

    if not clean_path:
        raise Http404("Image path is empty")

    images_dir = settings.MEDIA_ROOT / 'images'
    root_dir = settings.MEDIA_ROOT

    # 1. Direct path check in images dir
    if (images_dir / clean_path).exists() and (images_dir / clean_path).is_file():
        return serve(request, clean_path, document_root=images_dir)

    # 2. Direct path check in media root
    if (root_dir / clean_path).exists() and (root_dir / clean_path).is_file():
        return serve(request, clean_path, document_root=root_dir)

    # 3. Known aliases map (e.g. Fiji_Villa -> Fiji_Yasawa_Villa)
    clean_lower = clean_path.lower()
    alias_map = {
        'fiji_villa.webp': 'Fiji_Yasawa_Villa.webp',
        'fiji_villa.png': 'Fiji_Yasawa_Villa.webp',
        'fiji.png': 'fiji.webp',
        'fiji.webp': 'fiji.webp',
    }
    if clean_lower in alias_map:
        target_alias = alias_map[clean_lower]
        if (images_dir / target_alias).exists() and (images_dir / target_alias).is_file():
            return serve(request, target_alias, document_root=images_dir)

    # 4. Case-insensitive & space/underscore normalized scan
    target_clean = clean_lower.replace('_', ' ')
    if images_dir.exists():
        for f in images_dir.iterdir():
            if f.is_file() and (f.name.lower() == clean_lower or f.name.lower().replace('_', ' ') == target_clean):
                return serve(request, f.name, document_root=images_dir)

    if root_dir.exists():
        for f in root_dir.iterdir():
            if f.is_file() and (f.name.lower() == clean_lower or f.name.lower().replace('_', ' ') == target_clean):
                return serve(request, f.name, document_root=root_dir)

    raise Http404(f"Image '{path}' not found")

def root_home(request):
    if 'text/html' in request.META.get('HTTP_ACCEPT', ''):
        html_content = """
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Sandeep Luxury Resorts API</title>
            <style>
                body { font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; background: #090d16; color: #f8fafc; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
                .card { background: #111827; padding: 2.5rem; border-radius: 1.25rem; border: 1px solid #1f2937; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7); max-width: 520px; width: 90%; text-align: center; }
                h1 { color: #f59e0b; margin-top: 0; font-size: 1.75rem; font-weight: 600; letter-spacing: -0.025em; }
                p { color: #9ca3af; line-height: 1.6; font-size: 0.95rem; }
                .badge { display: inline-flex; align-items: center; gap: 0.5rem; background: rgba(16, 185, 129, 0.1); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.3); padding: 0.35rem 0.85rem; border-radius: 9999px; font-size: 0.85rem; font-weight: 600; margin-bottom: 1.25rem; }
                .pulse { width: 8px; height: 8px; background: #10b981; border-radius: 50%; box-shadow: 0 0 8px #10b981; }
                .btn { display: inline-block; background: #f59e0b; color: #000; padding: 0.75rem 1.75rem; border-radius: 0.5rem; text-decoration: none; font-weight: 600; margin-top: 1.25rem; transition: all 0.2s ease; }
                .btn:hover { background: #d97706; color: #fff; }
                .endpoint { background: #030712; border: 1px solid #1f2937; padding: 0.65rem 1rem; border-radius: 0.5rem; font-family: ui-monospace, monospace; color: #38bdf8; margin: 0.75rem 0; font-size: 0.9rem; }
            </style>
        </head>
        <body>
            <div class="card">
                <div class="badge"><div class="pulse"></div> System Operational & Connected to Supabase</div>
                <h1>Sandeep Luxury Resorts API</h1>
                <p>The Django backend is active and serving REST API resources.</p>
                <div class="endpoint">GET /api/resorts/</div>
                <a href="/api/resorts/" class="btn">Explore API Endpoints</a>
            </div>
        </body>
        </html>
        """
        return HttpResponse(html_content)
    return JsonResponse({
        "status": "online",
        "service": "Sandeep Luxury Resorts Backend API",
        "version": "1.0.0",
        "endpoints": {
            "api_root": "/api/",
            "resorts": "/api/resorts/",
            "rooms": "/api/rooms/",
            "services": "/api/services/",
            "admin": "/admin/"
        }
    })

urlpatterns = [
    path('', root_home, name='root_home'),
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    re_path(r'^images/(?P<path>.*)$', serve_smart_image),
    re_path(r'^media/images/(?P<path>.*)$', serve_smart_image),
    re_path(r'^media/(?P<path>.*)$', serve_smart_image),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

