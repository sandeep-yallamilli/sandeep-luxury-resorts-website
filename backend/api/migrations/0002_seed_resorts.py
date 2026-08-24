from django.db import migrations
import json

def seed_resorts(apps, schema_editor):
    Resort = apps.get_model('api', 'Resort')
    Room = apps.get_model('api', 'Room')
    Service = apps.get_model('api', 'Service')

    RESORT_DATA = [
        {
            "slug": "maldives",
            "name": "Sandeep Maldives Private Pavilion",
            "location": "Maldives, Indian Ocean",
            "description": "Suspended entirely over crystal clear lagoons. Experience direct ocean access, glass-bottom floors, and elite butler service.",
            "tagline": "Ultra-luxury overwater solitude in a private lagoon sanctuary.",
            "rating": 5.0,
            "priceStart": 2900,
            "region": "ocean",
            "image": "/images/maldives.png",
            "inclusions": ["All-inclusive Michelin breakfasts & dinners", "24/7 dedicated personal butler service", "Private airport pickup via luxury yacht transfer", "Complimentary 60-minute daily spa treatment"]
        },
        {
            "slug": "bali",
            "name": "Sandeep Bali Forest Sanctuary",
            "location": "Ubud, Indonesia",
            "description": "Jungle-shrouded pavilions sculpted into volcanic canyons overlooking sacred rivers and lush rice paddies.",
            "tagline": "Rejuvenating forest dwellings sculpted along volcano canyons.",
            "rating": 4.9,
            "priceStart": 2400,
            "region": "asia",
            "image": "/images/bali.png",
            "inclusions": ["Daily morning temple yoga sessions", "Ayurvedic consultation with master doctor", "Complimentary airport transfers", "Traditional Balinese oil body massage"]
        },
        {
            "slug": "kyoto",
            "name": "Sandeep Kyoto Zen Pavilion",
            "location": "Kyoto, Japan",
            "description": "Minimalist sanctuaries built with traditional cypress joinery adjacent to ancient temple rock gardens.",
            "tagline": "Serenity built with ancient timber overlooking historic rock gardens.",
            "rating": 4.9,
            "priceStart": 2600,
            "region": "asia",
            "image": "/images/kyoto.png",
            "inclusions": ["Daily private tea ceremonies", "Unlimited mineral spring onsen baths", "Bespoke kimono dress fitment", "Guided mountain forest walks"]
        },
        {
            "slug": "alps",
            "name": "Sandeep Alps Snow Chalet",
            "location": "Zermatt, Switzerland",
            "description": "Ski-in/ski-out timber chalet framing the soaring Matterhorn. Complete with private sauna and glass observatory roof.",
            "tagline": "Ski-in luxury alpine chalets facing the dramatic Matterhorn peak.",
            "rating": 4.8,
            "priceStart": 3100,
            "region": "europe",
            "image": "/images/alps.png",
            "inclusions": ["All-day ski equipment and mountain passes", "Private mountain guide tours", "Nightly wine tasting led by estate sommelier", "Heated outdoor chalet spa pool access"]
        },
        {
            "slug": "santorini",
            "name": "Sandeep Santorini Caldera Cliffside",
            "location": "Santorini, Greece",
            "description": "White-washed cliffside cave suites hanging over the Aegean Caldera with private plunge pools.",
            "tagline": "Cliffside infinity pool with volcanic vineyard tasting cellar.",
            "rating": 4.9,
            "priceStart": 3700,
            "region": "europe",
            "image": "/images/santorini.png",
            "inclusions": ["Volcanic wine tasting session", "Private catamaran sunset cruise", "Helicopter transfers", "Daily cliffside breakfast"]
        },
        {
            "slug": "amalfi",
            "name": "Sandeep Amalfi Coast Cliff Manor",
            "location": "Positano, Italy",
            "description": "Terraced citrus garden villa hanging high above Tyrrhenian Sea in Positano.",
            "tagline": "Hanging high above Positano surrounded by lemon groves.",
            "rating": 4.9,
            "priceStart": 4100,
            "region": "europe",
            "image": "/images/amalfi.png",
            "inclusions": ["Private Riva boat charter", "7-course Michelin lemon garden table", "Personal sommelier service", "Positano coast tours"]
        },
        {
            "slug": "borabora",
            "name": "Sandeep Bora Bora Overwater Lagoon",
            "location": "Bora Bora, French Polynesia",
            "description": "Overwater coral bungalows under Mount Otemanu peak with glass floor viewing chambers.",
            "tagline": "Overwater coral lagoon sanctuary under Mount Otemanu.",
            "rating": 5.0,
            "priceStart": 4600,
            "region": "ocean",
            "image": "/images/borabora.png",
            "inclusions": ["Outrigger canoe breakfast delivery", "Private lagoon shark & ray safari", "Polynesian massage", "24/7 dedicated butler"]
        },
        {
            "slug": "serengeti",
            "name": "Sandeep Serengeti Wildlife Sanctuary",
            "location": "Serengeti, Tanzania",
            "description": "Tented luxury safari pavilions situated along the Great Migration wildlife corridor.",
            "tagline": "Savanna luxury tented pavilion along the Great Migration.",
            "rating": 4.9,
            "priceStart": 3300,
            "region": "africa",
            "image": "/images/serengeti.png",
            "inclusions": ["Dawn hot air balloon safari", "Private 4x4 wildlife ranger tracking", "Starlit campfire banquet", "Bush dinner setup"]
        },
        {
            "slug": "seychelles",
            "name": "Sandeep Seychelles Granite Ocean Sanctuary",
            "location": "Praslin, Seychelles",
            "description": "Private granite cliffside villa overlooking pristine Indian Ocean reserves with secluded beaches.",
            "tagline": "Granite cliffside ocean sanctuary with private cove beaches.",
            "rating": 4.9,
            "priceStart": 4400,
            "region": "ocean",
            "image": "/images/seychelles.png",
            "inclusions": ["Private beach cove dining", "Giant tortoise sanctuary tour", "Seafood chef masterclass", "Deep sea fishing"]
        },
        {
            "slug": "marrakech",
            "name": "Sandeep Marrakech Royal Oasis Riad",
            "location": "Marrakech, Morocco",
            "description": "Opulent terracotta palace riad surrounded by olive groves, marble hammams, and private courtyard pools.",
            "tagline": "Royal imperial riad surrounded by ancient olive groves.",
            "rating": 4.8,
            "priceStart": 3800,
            "region": "africa",
            "image": "/images/marrakech.png",
            "inclusions": ["Private marble hammam spa", "Atlas Mountain chopper excursion", "Moroccan culinary dining", "Spiced herbal tea ritual"]
        },
        {
            "slug": "zanzibar",
            "name": "Zanzibar Spice Island Resort",
            "location": "Zanzibar, Tanzania",
            "description": "Pristine white-sand coral reef beach sanctuary with carved mahogany doors and spice gardens.",
            "tagline": "Sultan beach pavilion on turquoise spice island waters.",
            "rating": 4.8,
            "priceStart": 3500,
            "region": "africa",
            "image": "/images/zanzibar.png",
            "inclusions": ["Traditional dhow boat sunset sail", "Spice estate guided walk", "Coral reef night diving", "Private beach BBQ"]
        },
        {
            "slug": "kerala",
            "name": "Sandeep Kerala Backwaters Wellness Retreat",
            "location": "Kerala, India",
            "description": "Floating teak houseboats and private palm-lined wellness villas overlooking tropical backwaters.",
            "tagline": "Ayurvedic Panchakarma wellness sanctuary on serene lagoons.",
            "rating": 4.9,
            "priceStart": 3200,
            "region": "asia",
            "image": "/images/kerala.png",
            "inclusions": ["Master Ayurvedic Panchakarma treatment", "Lotus lake canoe yoga", "Kathakali performance", "Teak houseboat cruise"]
        },
        {
            "slug": "himalayas",
            "name": "Sandeep Himalayan Cedar & Snow Sanctuary",
            "location": "Himachal Pradesh, India",
            "description": "Pine-scented cedar chalets nestled in Himalayan snow valleys with private outdoor hot springs.",
            "tagline": "Cedar snow peak chalet framing serene Himalayan valleys.",
            "rating": 4.9,
            "priceStart": 3600,
            "region": "asia",
            "image": "/images/himalayas.png",
            "inclusions": ["Thermal hot spring bath access", "High altitude sherpa trek", "Starlit glass observatory viewing", "Pine cedar fireside tea"]
        },
        {
            "slug": "thailand",
            "name": "Sandeep Thailand Emerald Bay Cliff Sanctuary",
            "location": "Phuket, Thailand",
            "description": "Secluded limestone ocean cliffside villas surrounded by emerald Andaman Sea waters.",
            "tagline": "Emerald bay cliffside pool villa over Andaman Sea.",
            "rating": 4.8,
            "priceStart": 3400,
            "region": "asia",
            "image": "/images/thailand.png",
            "inclusions": ["Andaman sea longtail boat tour", "Royal Thai herbal compress spa", "Private seafood banquet", "Cliffside infinity pool access"]
        },
        {
            "slug": "fiji",
            "name": "Sandeep Fiji Private Island Sanctuary",
            "location": "Yasawa Islands, Fiji",
            "description": "Perched over pristine turquoise South Pacific lagoons in the Yasawa Islands with overwater plunge pools.",
            "tagline": "Ultra-exclusive private island overwater sanctuary in Fiji.",
            "rating": 5.0,
            "priceStart": 4500,
            "region": "ocean",
            "image": "/images/fiji.png",
            "inclusions": ["Private helicopter island transfer", "24/7 Polynesian personal butler", "Overwater glass plunge pool", "Coral reef snorkeling tour"]
        }
    ]

    for data in RESORT_DATA:
        resort, created = Resort.objects.get_or_create(
            slug=data["slug"],
            defaults={
                "name": data["name"],
                "location": data["location"],
                "description": data["description"],
                "tagline": data["tagline"],
                "rating": data["rating"],
                "priceStart": data["priceStart"],
                "region": data["region"],
                "image": data["image"],
                "inclusions": json.dumps(data["inclusions"])
            }
        )
        if created:
            Room.objects.create(resort=resort, room_type="Standard", price=data["priceStart"])
            Service.objects.create(resort=resort, name="Spa Treatment", description="Relaxing " + data["name"])

def remove_resorts(apps, schema_editor):
    Resort = apps.get_model('api', 'Resort')
    Resort.objects.all().delete()

class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(seed_resorts, reverse_code=remove_resorts),
    ]
