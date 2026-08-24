from django.contrib import admin
from django.utils.html import format_html
from .models import Resort, Room, Service, Booking, Inquiry, NewsletterSubscriber, Banner

# Customize Django Admin Branding
admin.site.site_header = "Sandeep Luxury Resorts — Admin Control Center"
admin.site.site_title = "Sandeep Luxury Resorts Admin"
admin.site.index_title = "Sanctuaries, Estates & Guest Operations"


def get_admin_image_url(image_field):
    if not image_field:
        return ""
    try:
        url = image_field.url
    except Exception:
        url = str(image_field)
    
    url = url.strip()
    if not url:
        return ""
    if url.startswith("http://") or url.startswith("https://"):
        return url
    if url.startswith("/media/"):
        return url
    if url.startswith("/images/"):
        return "/media" + url
    if url.startswith("images/"):
        return "/media/" + url
    if not url.startswith("/"):
        return "/media/" + url
    return url


class RoomInline(admin.TabularInline):
    model = Room
    extra = 1
    fields = ('room_type', 'price', 'is_available', 'image', 'interior_image')


class ServiceInline(admin.TabularInline):
    model = Service
    extra = 1
    fields = ('name', 'category', 'description', 'image')


@admin.register(Resort)
class ResortAdmin(admin.ModelAdmin):
    list_display = ('name', 'location', 'region', 'priceStart', 'rating', 'image_thumbnail')
    list_filter = ('region',)
    search_fields = ('name', 'location', 'region')
    ordering = ('name',)
    list_editable = ('priceStart', 'rating')
    prepopulated_fields = {'slug': ('name',)}
    inlines = [RoomInline, ServiceInline]
    save_on_top = True
    fieldsets = (
        ('General Information', {
            'fields': ('name', 'slug', 'location', 'region', 'tagline', 'rating', 'description')
        }),
        ('Investment & Inclusions', {
            'fields': ('priceStart', 'inclusions')
        }),
        ('Resort Hero Image', {
            'fields': ('image',)
        }),
    )

    def image_thumbnail(self, obj):
        url = get_admin_image_url(obj.image)
        if url:
            return format_html('<img src="{}" style="height: 40px; width: 60px; object-fit: cover; border-radius: 6px; border: 1px solid #d4af37;" />', url)
        return "-"
    image_thumbnail.short_description = "Hero Image"


@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = ('id', 'room_type', 'resort', 'price', 'is_available', 'exterior_thumbnail', 'interior_thumbnail')
    list_filter = ('resort', 'is_available')
    search_fields = ('room_type', 'resort__name')
    list_editable = ('price', 'is_available')
    ordering = ('id',)
    save_on_top = True
    fieldsets = (
        ('Sanctuary Information', {
            'fields': ('resort', 'room_type', 'is_available')
        }),
        ('Investment Rate', {
            'fields': ('price',)
        }),
        ('Sanctuary Media', {
            'fields': ('image', 'interior_image'),
            'description': 'Upload exterior and interior imagery for this sanctuary.'
        }),
    )

    def exterior_thumbnail(self, obj):
        url = get_admin_image_url(obj.image)
        if url:
            return format_html('<img src="{}" style="height: 40px; width: 60px; object-fit: cover; border-radius: 6px; border: 1px solid #d4af37;" />', url)
        return "-"
    exterior_thumbnail.short_description = "Exterior Image"

    def interior_thumbnail(self, obj):
        url = get_admin_image_url(obj.interior_image)
        if url:
            return format_html('<img src="{}" style="height: 40px; width: 60px; object-fit: cover; border-radius: 6px; border: 1px solid #d4af37;" />', url)
        return "-"
    interior_thumbnail.short_description = "Interior Image"


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'resort', 'service_thumbnail')
    list_filter = ('category', 'resort')
    search_fields = ('name', 'resort__name')
    list_editable = ('category',)
    ordering = ('name',)
    save_on_top = True
    fieldsets = (
        ('Service Details', {
            'fields': ('resort', 'name', 'category', 'description')
        }),
        ('Service Imagery', {
            'fields': ('image',)
        }),
    )

    def service_thumbnail(self, obj):
        url = get_admin_image_url(obj.image)
        if url:
            return format_html('<img src="{}" style="height: 40px; width: 60px; object-fit: cover; border-radius: 6px; border: 1px solid #d4af37;" />', url)
        return "-"
    service_thumbnail.short_description = "Service Image"


@admin.register(Banner)
class BannerAdmin(admin.ModelAdmin):
    list_display = ('page', 'title', 'banner_thumbnail', 'has_custom_image')
    search_fields = ('page', 'title', 'subtitle')
    ordering = ('page',)
    actions = ['clear_selected_banner_images']
    save_on_top = True
    fieldsets = (
        ('Banner Location & Target Page', {
            'fields': ('page', 'title', 'subtitle')
        }),
        ('Banner Hero Image', {
            'fields': ('image',),
            'description': 'Upload a custom hero image for this page banner. Tick "[x] Clear" checkbox or leave empty to clear the custom image and revert to default website banner.'
        }),
    )

    def banner_thumbnail(self, obj):
        url = get_admin_image_url(obj.image)
        if url:
            return format_html('<img src="{}" style="height: 40px; width: 80px; object-fit: cover; border-radius: 6px; border: 1px solid #d4af37;" />', url)
        return format_html('<span style="color: #888; font-size: 11px; font-style: italic;">[Default Website Image]</span>')
    banner_thumbnail.short_description = "Banner Image"

    def has_custom_image(self, obj):
        return bool(obj.image)
    has_custom_image.boolean = True
    has_custom_image.short_description = "Custom Image Uploaded?"

    @admin.action(description="Clear / Reset selected banner images to default")
    def clear_selected_banner_images(self, request, queryset):
        count = 0
        for banner in queryset:
            if banner.image:
                banner.image.delete(save=False)
                banner.image = None
                banner.save()
                count += 1
        self.message_user(request, f"Successfully cleared custom image for {count} banner(s). Website will now display default banner image.")


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'room', 'start_date', 'end_date', 'total_price', 'status', 'created_at')
    list_filter = ('status', 'start_date', 'end_date')
    search_fields = ('user__username', 'user__email', 'room__room_type', 'room__resort__name')
    readonly_fields = ('total_price', 'created_at')
    ordering = ('-created_at',)
    fieldsets = (
        ('Guest & Room Information', {
            'fields': ('user', 'room', 'status')
        }),
        ('Stay Dates & Guests', {
            'fields': ('start_date', 'end_date', 'guests')
        }),
        ('Financials & Requests', {
            'fields': ('total_price', 'special_requests', 'created_at')
        }),
    )


@admin.register(Inquiry)
class InquiryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'email', 'phone', 'resort', 'subject', 'created_at')
    list_filter = ('created_at', 'resort')
    search_fields = ('name', 'email', 'resort', 'subject', 'message')
    readonly_fields = ('created_at',)
    ordering = ('-created_at',)


@admin.register(NewsletterSubscriber)
class NewsletterSubscriberAdmin(admin.ModelAdmin):
    list_display = ('id', 'email', 'subscribed_at')
    search_fields = ('email',)
    readonly_fields = ('subscribed_at',)
    ordering = ('-subscribed_at',)
