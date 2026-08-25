import os
import sys
import json
import django

# Set up Django environment
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'resort_backend.settings')
django.setup()

from api.models import Resort, Room, Service, Banner

def seed():
    print("Starting Distinct Room Image Seeding & Database Sync...")

    # ---------------------------------------------------------
    # 0. CLEANUP OLD / DUPLICATE ROOMS & SERVICES
    # Delete generic "Standard" rooms or mismatched room names
    # ---------------------------------------------------------
    Room.objects.filter(room_type="Standard").delete()
    Room.objects.filter(room_type="Grand Sunset Pavilion").delete()
    Service.objects.filter(name="Spa Treatment").delete()

    # ---------------------------------------------------------
    # 1. BANNERS & FEATURE HEROES
    # ---------------------------------------------------------
    banners_data = [
        {"page": "home_hero", "title": "Sandeep Luxury Sanctuaries", "subtitle": "Ultra-Luxury Solitude Across Earth's Most Sacred Landscapes", "image": "images/sandeep_luxury_hero.webp"},
        {"page": "villas_hero", "title": "Private Sanctuary Dwellings", "subtitle": "Architectural Masterpieces Sculpted Into Nature", "image": "images/villas_hero.webp"},
        {"page": "experiences_hero", "title": "Expeditions & Private Adventures", "subtitle": "Unforgettable Journeys Crafted By Local Masters", "image": "images/experiences_hero.webp"},
        {"page": "wellness_hero", "title": "Ayurvedic & Holistic Sanctuary", "subtitle": "Ancient Healing Rituals for Soul, Body & Mind", "image": "images/wellness_hero.webp"},
        {"page": "dining_hero", "title": "Gastronomic Excellence", "subtitle": "Michelin Culinary Artistry Under Starlit Skies", "image": "images/dining_hero.webp"},
        {"page": "weddings_hero", "title": "Sacred Celebration & Ceremonies", "subtitle": "Bespoke Weddings Facing Majestic Oceans and Canyons", "image": "images/weddings_hero.webp"},
        {"page": "membership_hero", "title": "Sandeep Elite Private Club", "subtitle": "Exclusive Access & Unlimited Villa Solitude", "image": "images/Membership_Club.webp"},
        {"page": "sustainability_hero", "title": "Ecological Harmony", "subtitle": "Pioneering Zero-Carbon Architectural Sanctuaries", "image": "images/sustainable_ecological_sanctuary.webp"},
        {"page": "home_dining", "title": "Michelin Gastronomic Artistry", "subtitle": "Undersea & Cliffside Fine Dining Experiences", "image": "images/home_dining.webp"},
        {"page": "home_wedding", "title": "Sacred Ocean & Cliffside Wedding Sanctuaries", "subtitle": "Unforgettable Ceremonies Crafted by World-Class Masters", "image": "images/home_wedding.webp"},
        {"page": "home_wellness", "title": "Ayurvedic & Holistic Health Healing", "subtitle": "Ancient Earth Spa Treatments for Soul and Rejuvenation", "image": "images/home_wellness.webp"},
    ]

    for b in banners_data:
        obj, created = Banner.objects.update_or_create(
            page=b["page"],
            defaults={"title": b["title"], "subtitle": b["subtitle"], "image": b["image"]}
        )
        print(f"[{'CREATED' if created else 'UPDATED'}] Banner: {b['page']}")

    # ---------------------------------------------------------
    # 2. RESORTS & DISTINCT ROOM IMAGES (Matching disk images 100%)
    # ---------------------------------------------------------
    resorts_data = [
        {
            "slug": "maldives",
            "name": "Sandeep Maldives Private Pavilion",
            "location": "Maldives, Indian Ocean",
            "description": "Suspended entirely over crystal clear lagoons. Experience direct ocean access, glass-bottom floors, and elite butler service.",
            "tagline": "Ultra-luxury overwater solitude in a private lagoon sanctuary.",
            "rating": 5.0,
            "priceStart": 2900,
            "region": "ocean",
            "image": "images/maldives.webp",
            "inclusions": ["All-inclusive Michelin breakfasts & dinners", "24/7 dedicated personal butler service", "Private airport pickup via luxury yacht transfer", "Complimentary 60-minute daily spa treatment"],
            "rooms": [
                {"room_type": "Overwater Pool Villa", "price": 2900, "image": "images/maldives_villa.webp", "interior_image": "images/Maldives_interior.webp"},
            ]
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
            "image": "images/bali.webp",
            "inclusions": ["Daily morning temple yoga sessions", "Ayurvedic consultation with master doctor", "Complimentary airport transfers", "Traditional Balinese oil body massage"],
            "rooms": [
                {"room_type": "Canopy Jungle Pool Villa", "price": 2400, "image": "images/Bali_Forest_villa.webp", "interior_image": "images/Bali_Forest_interior.webp"},
            ]
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
            "image": "images/kyoto.webp",
            "inclusions": ["Daily private tea ceremonies", "Unlimited mineral spring onsen baths", "Bespoke kimono dress fitment", "Guided mountain forest walks"],
            "rooms": [
                {"room_type": "Traditional Cypress Onsen Suite", "price": 2600, "image": "images/Kyoto_villa.webp", "interior_image": "images/Kyoto_interior.webp"},
            ]
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
            "image": "images/alps.webp",
            "inclusions": ["All-day ski equipment and mountain passes", "Private mountain guide tours", "Nightly wine tasting led by estate sommelier", "Heated outdoor chalet spa pool access"],
            "rooms": [
                {"room_type": "Matterhorn View Chalet Suite", "price": 3100, "image": "images/Alps_villa.webp", "interior_image": "images/Alps_interior.webp"},
            ]
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
            "image": "images/santorini.webp",
            "inclusions": ["Volcanic wine tasting session", "Private catamaran sunset cruise", "Helicopter transfers", "Daily cliffside breakfast"],
            "rooms": [
                {"room_type": "Caldera Infinity Plunge Pool Suite", "price": 3700, "image": "images/Santorini_villa.webp", "interior_image": "images/Santorini_interior.webp"},
            ]
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
            "image": "images/amalfi.webp",
            "inclusions": ["Private Riva boat charter", "7-course Michelin lemon garden table", "Personal sommelier service", "Positano coast tours"],
            "rooms": [
                {"room_type": "Cliffside Lemon Grove Villa", "price": 4100, "image": "images/Amalfi_villa.webp", "interior_image": "images/Amalfi_interior.webp"},
            ]
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
            "image": "images/borabora.webp",
            "inclusions": ["Outrigger canoe breakfast delivery", "Private lagoon shark & ray safari", "Polynesian massage", "24/7 dedicated butler"],
            "rooms": [
                {"room_type": "Mount Otemanu Overwater Villa", "price": 4600, "image": "images/Bora_Bora_Villa.webp", "interior_image": "images/Bora_Bora_interior.webp"},
            ]
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
            "image": "images/serengeti.webp",
            "inclusions": ["Dawn hot air balloon safari", "Private 4x4 wildlife ranger tracking", "Starlit campfire banquet", "Bush dinner setup"],
            "rooms": [
                {"room_type": "Great Migration Tented Pavilion", "price": 3300, "image": "images/Serengeti_Villa.webp", "interior_image": "images/Serengeti_interior.webp"},
            ]
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
            "image": "images/seychelles.webp",
            "inclusions": ["Private beach cove dining", "Giant tortoise sanctuary tour", "Seafood chef masterclass", "Deep sea fishing"],
            "rooms": [
                {"room_type": "Granite Cliffside Ocean Villa", "price": 4400, "image": "images/Seychelles_villa.webp", "interior_image": "images/Seychelles_interior.webp"},
            ]
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
            "image": "images/marrakech.webp",
            "inclusions": ["Private marble hammam spa", "Atlas Mountain chopper excursion", "Moroccan culinary dining", "Spiced herbal tea ritual"],
            "rooms": [
                {"room_type": "Royal Terracotta Palace Riad", "price": 3800, "image": "images/Marrakech_villa.webp", "interior_image": "images/Marrakech_interior.webp"},
            ]
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
            "image": "images/zanzibar.webp",
            "inclusions": ["Traditional dhow boat sunset sail", "Spice estate guided walk", "Coral reef night diving", "Private beach BBQ"],
            "rooms": [
                {"room_type": "Sultan White Sand Beach Bungalow", "price": 3500, "image": "images/Zanzibar_Villa.webp", "interior_image": "images/Zanzibar_interior.webp"},
            ]
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
            "image": "images/kerala.webp",
            "inclusions": ["Master Ayurvedic Panchakarma treatment", "Lotus lake canoe yoga", "Kathakali performance", "Teak houseboat cruise"],
            "rooms": [
                {"room_type": "Palm Backwater Wellness Villa", "price": 3200, "image": "images/Kerala_villa.webp", "interior_image": "images/Kerala_interior.webp"},
            ]
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
            "image": "images/himalayas.webp",
            "inclusions": ["Thermal hot spring bath access", "High altitude sherpa trek", "Starlit glass observatory viewing", "Pine cedar fireside tea"],
            "rooms": [
                {"room_type": "Himalayan Snow Peak Chalet", "price": 3600, "image": "images/Himalayan_villa.webp", "interior_image": "images/Himalayan_interior.webp"},
            ]
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
            "image": "images/thailand.webp",
            "inclusions": ["Andaman sea longtail boat tour", "Royal Thai herbal compress spa", "Private seafood banquet", "Cliffside infinity pool access"],
            "rooms": [
                {"room_type": "Emerald Bay Ocean Plunge Villa", "price": 3400, "image": "images/Thailand_villa.webp", "interior_image": "images/Thailand_interior.webp"},
            ]
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
            "image": "images/Fiji_Yasawa_Villa.webp",
            "inclusions": ["Private helicopter island transfer", "24/7 Polynesian personal butler", "Overwater glass plunge pool", "Coral reef snorkeling tour"],
            "rooms": [
                {"room_type": "Yasawa Overwater Plunge Pool Villa", "price": 4500, "image": "images/Fiji_Yasawa_Villa.webp", "interior_image": "images/Fiji_interior.webp"},
            ]
        },
        {
            "slug": "rajasthan",
            "name": "Sandeep Rajasthan Desert Fort Palace",
            "location": "Jaisalmer, India",
            "description": "Golden sandstone fortress palace in the Thar Desert with royal courtyards and private pool suites.",
            "tagline": "Royal sandstone desert fort palace framing golden dunes.",
            "rating": 4.9,
            "priceStart": 3500,
            "region": "asia",
            "image": "images/rajasthan.webp",
            "inclusions": ["Royal Thar desert camel safari", "Starlit sitar & folk dance dinner", "Private marble courtyard pool", "Royal Ayurvedic spa"],
            "rooms": [
                {"room_type": "Sandstone Fort Royal Suite", "price": 3500, "image": "images/Rajasthan_villa.webp", "interior_image": "images/Rajasthan_interior.webp"},
            ]
        }
    ]

    for r in resorts_data:
        resort_obj, created = Resort.objects.update_or_create(
            slug=r["slug"],
            defaults={
                "name": r["name"],
                "location": r["location"],
                "description": r["description"],
                "tagline": r["tagline"],
                "rating": r["rating"],
                "priceStart": r["priceStart"],
                "region": r["region"],
                "image": r["image"],
                "inclusions": json.dumps(r["inclusions"])
            }
        )
        print(f"[{'CREATED' if created else 'UPDATED'}] Resort: {r['name']}")

        # Ensure only the exact valid room types exist for this resort
        valid_types = [room["room_type"] for room in r["rooms"]]
        Room.objects.filter(resort=resort_obj).exclude(room_type__in=valid_types).delete()

        for room in r["rooms"]:
            rm_obj, rm_created = Room.objects.update_or_create(
                resort=resort_obj,
                room_type=room["room_type"],
                defaults={
                    "price": room["price"],
                    "image": room["image"],
                    "interior_image": room["interior_image"],
                    "is_available": True
                }
            )
            print(f"   -> Room ({'CREATED' if rm_created else 'UPDATED'}): {room['room_type']} | Main Image: {room['image']} | Interior: {room['interior_image']}")

    # ---------------------------------------------------------
    # 3. SERVICES (WELLNESS, DINING, EXPERIENCES, GENERAL)
    # ---------------------------------------------------------
    services_data = [
        # WELLNESS
        {
            "name": "Sunrise Temple Morning Yoga & Meditation Ritual",
            "category": "wellness",
            "description": "Revitalizing morning Hatha yoga and breathwork sessions guided by master yogis facing volcanic mountain valleys.",
            "image": "images/morning_ritual_yoga_service.webp"
        },
        {
            "name": "Balinese Canopy Scrub & Organic Floral Bath",
            "category": "wellness",
            "description": "Exfoliating wild ginger scrub followed by a warm bath infused with 1,000 fresh tropical flower petals overlooking rainforest gorges.",
            "image": "images/organic_balinese_floral_bath_and_canopy_body_scrub_service.webp"
        },
        {
            "name": "Master Panchakarma Detox & Herbal Oil Abhyanga",
            "category": "wellness",
            "description": "Authentic Ayurvedic body rejuvenation with warm herbal medicated oils administered by master Vaidya doctors.",
            "image": "images/ayurvedic_master_panchakarma_detox_service.webp"
        },
        {
            "name": "Black Pearl & Coral Powder Body Treatment",
            "category": "wellness",
            "description": "Rare Polynesian black pearl dust massage restoring skin luster and deep muscular cellular energy.",
            "image": "images/black_pearl_spa_treatment_service.webp"
        },
        {
            "name": "Polynesian Monoi Oil Deep Relaxation Massage",
            "category": "wellness",
            "description": "Lomi-Lomi rhythmic wave massage using gardenia-infused coconut Monoi oil under open ocean air.",
            "image": "images/polynesian_monoi_oil_deep_relaxation_massage_service.webp"
        },
        {
            "name": "Eucalyptus Marble Hammam & Black Soap Ritual",
            "category": "wellness",
            "description": "Traditional Moroccan steam bath, kessa glove exfoliation, and pure organic Argan oil hydration.",
            "image": "images/eucalyptus_hammam_ritual_service.webp"
        },
        {
            "name": "Royal Thai Herbal Compress & Acupressure",
            "category": "wellness",
            "description": "Warm steamed sachets of lemongrass, turmeric, and camphor pressed along body meridian pathways.",
            "image": "images/royal_thai_herbal_compress_spa_service.webp"
        },
        {
            "name": "Thermal Alpine Hydrotherapy & Sauna Circuit",
            "category": "wellness",
            "description": "Contrast hot pine sauna and glacier water plunge pools framing views of Matterhorn peaks.",
            "image": "images/thermal_spring_hydrotherapy_service.webp"
        },
        {
            "name": "Himalayan Cedarwood Aromatherapy Ritual",
            "category": "wellness",
            "description": "Warm cedar oil massage relieving high-altitude tension while soothing body energy.",
            "image": "images/himalayan_cedarwood_aromatherapy_ritual_service.webp"
        },
        {
            "name": "Tibetan Singing Bowl Sound Therapy",
            "category": "wellness",
            "description": "Vibrational acoustic sound bath balancing chakras with handcrafted seven-metal bowls.",
            "image": "images/singing_bowl_sound_bath_and_energy_balancing_service.webp"
        },
        {
            "name": "Ayurvedic Copper Vessel Warm Water Ritual",
            "category": "wellness",
            "description": "Soothing Shirodhara continuous warm oil stream over third-eye chakra in solid copper vessels.",
            "image": "images/ayurvedic_copper_bath_ritual_service.webp"
        },
        {
            "name": "Volcanic Sulphur Thermal Spring Soak",
            "category": "wellness",
            "description": "Natural volcanic thermal spring plunge rich in mineral salts overlooking the Aegean Caldera.",
            "image": "images/volcanic_mineral_thermal_spring_soak_service.webp"
        },
        {
            "name": "Sunrise Lotus Lake Yoga & Pranayama",
            "category": "wellness",
            "description": "Guided breathwork and gentle Vinyasa yoga on floating lotus pavilions at dawn.",
            "image": "images/sunrise_lotus_lake_meditation_service.webp"
        },

        # DINING
        {
            "name": "Amalfi Coast Lemons & Handcrafted Pasta Cooking Masterclass",
            "category": "dining",
            "description": "Hands-on culinary class with Michelin-starred Italian chefs crafting fresh handmade pasta and citrus desserts.",
            "image": "images/amalfi_cooking_masterclass_service.webp"
        },
        {
            "name": "Santorini Volcanic Assyrtiko Wine & Cheese Sommelier Masterclass",
            "category": "dining",
            "description": "Private tasting of indigenous volcanic Greek wines paired with artisanal island cheeses inside ancient cliff caves.",
            "image": "images/assyrtiko_wine_masterclass_service.webp"
        },
        {
            "name": "Private Estate Wine Cellar Reserve Tasting",
            "category": "dining",
            "description": "Exclusive access to rare vintage wine vaults with master sommeliers and charcuterie pairings.",
            "image": "images/private_wine_cellar_tasting_service.webp"
        },
        {
            "name": "Glass-Dome Underwater Coral Reef Dining",
            "category": "dining",
            "description": "Five-meter submerged glass restaurant surrounded by sea turtles and vibrant coral ecosystems.",
            "image": "images/underwater_dining_service.webp"
        },
        {
            "name": "Positano Michelin Lemon Garden Table",
            "category": "dining",
            "description": "Seven-course tasting menu under century-old Positano lemon trees paired with vintage Barolo wines.",
            "image": "images/michelin_lemon_garden_dinner_service.webp"
        },
        {
            "name": "Overwater Lagoon Floating Sunset Breakfast",
            "category": "dining",
            "description": "Handcrafted floating wicker tray laden with tropical fruits, champagne, and warm pastries delivered to your pool.",
            "image": "images/overwater_lagoon_floating_sunset_breakfast_service.webp"
        },
        {
            "name": "Starlit Serengeti Savanna Campfire Banquet",
            "category": "dining",
            "description": "Gourmet game tasting prepared by open flame under African constellations with live Maasai chanting.",
            "image": "images/starlit_savanna_banquet_service.webp"
        },
        {
            "name": "Royal Moroccan Rooftop Tagine Feast",
            "category": "dining",
            "description": "Slow-cooked saffron lamb tagine served on private silk pillow rooftop lounges overlooking Marrakech medina.",
            "image": "images/royal_moroccan_rooftop_tagine_banquet_service.webp"
        },
        {
            "name": "Secluded Granite Cove Sunset Seafood Banquet",
            "category": "dining",
            "description": "Fresh Seychelles red snapper and lobster grilled tableside on private white granite coves.",
            "image": "images/sunset_cliffside_seafood_banquet_service.webp"
        },
        {
            "name": "Granite Cliffside Ocean View Table",
            "category": "dining",
            "description": "Private candlelight dining perched on dramatic ocean granite cliffs overlooking Praslin island.",
            "image": "images/granite_cliffside_dinner_service.webp"
        },
        {
            "name": "Himalayan Cedar Fireplace Fondue & Wine Dinner",
            "category": "dining",
            "description": "Artisanal Alpine cheese fondue and slow-roasted pine nut meats served beside glowing cedar wood fires.",
            "image": "images/himalayan_cedar_fireplace_dinner_service.webp"
        },
        {
            "name": "Polynesian Outrigger Canoe Sunset Dinner",
            "category": "dining",
            "description": "Private outrigger canoe journey to a deserted sandbank for a candlelit Tahitian feast.",
            "image": "images/outrigger_canoe_sunset_dining_service.webp"
        },
        {
            "name": "Marrakech Palmeraie Courtyard Candlelight Banquet",
            "category": "dining",
            "description": "Private marble fountain dining illuminated by hundreds of brass lantern candles.",
            "image": "images/palmeraie_courtyard_dining_service.webp"
        },
        {
            "name": "Volcanic Vineyard Private Cellar Sommelier Table",
            "category": "dining",
            "description": "Private cave tasting room pairing rare Assyrtiko vintages with smoked Greek cheeses.",
            "image": "images/volcanic_vineyard_sommelier_selection_dinner_service.webp"
        },

        # EXPERIENCES
        {
            "name": "Deep Ocean Coral Lagoon Snorkeling Expedition",
            "category": "experiences",
            "description": "Guided marine biologist snorkeling excursion through pristine protected coral barrier reefs.",
            "image": "images/deep-ocean_lagoon_snorkel_service.webp"
        },
        {
            "name": "Balinese Rainforest Jungle & Waterfall Trekking Expedition",
            "category": "experiences",
            "description": "Trek through sacred volcanic valleys, hidden waterfalls, and ancient rainforest canopies.",
            "image": "images/jungle_trekking_expedition_service.webp"
        },
        {
            "name": "Royal Rajasthan Private Bengal Tiger Safari Expedition",
            "category": "experiences",
            "description": "Custom 4x4 open jeep safari tracking wild Bengal tigers through historic royal forest reserves.",
            "image": "images/private_tiger_safari_service.webp"
        },
        {
            "name": "Serengeti Dawn Wildlife Tracking Scenic Flight",
            "category": "experiences",
            "description": "Low-altitude morning aircraft tracking of massive wildebeest and zebra herds across savanna plains.",
            "image": "images/serengeti_dawn_wildlife_tracking_flight_service.webp"
        },
        {
            "name": "Aegean Sunset Catamaran Luxury Charter",
            "category": "experiences",
            "description": "Private sunset sailing charter along volcanic calderas with gourmet tapas and champagne.",
            "image": "images/sunset_catamaran_cruise_service.webp"
        },
        {
            "name": "Private Luxury Superyacht Sunset Charter",
            "category": "experiences",
            "description": "Bespoke evening yacht cruise along azure ocean coastlines with personal captain and crew.",
            "image": "images/sunset_yacht_charter_service.webp"
        },
        {
            "name": "Private Catamaran Sunset Reef Charter",
            "category": "experiences",
            "description": "Exclusive 50ft catamaran sailing along secluded reef lagoons with personal butler service.",
            "image": "images/private_catamaran_sunset_reef_charter_service.webp"
        },
        {
            "name": "Dawn Serengeti Hot Air Balloon Safari",
            "category": "experiences",
            "description": "Soar above the Great Migration herds at dawn followed by a champagne bush breakfast.",
            "image": "images/dawn_hot_air_balloon_safari_service.webp"
        },
        {
            "name": "Great Migration Wildlife 4x4 Tracking",
            "category": "experiences",
            "description": "Customized 4x4 open Land Cruiser wildlife tracking guided by senior Maasai rangers.",
            "image": "images/great_migration_private_tracking_service.webp"
        },
        {
            "name": "Riva Yacht Capri & Amalfi Coast Expedition",
            "category": "experiences",
            "description": "Charter a classic mahogany Riva boat to explore hidden sea caves and Capri Blue Grotto.",
            "image": "images/riva_yacht_capri_expedition_service.webp"
        },
        {
            "name": "Atlas Mountain Private Helicopter Excursion",
            "category": "experiences",
            "description": "Scenic helicopter flight landing at high mountain Berber villages for authentic mint tea.",
            "image": "images/atlas_mountain_helicopter_tour_service.webp"
        },
        {
            "name": "Guided High Altitude Snow Trek & Glaciers",
            "category": "experiences",
            "description": "Excursion guided by expert Alpine sherpas framing dramatic Matterhorn glaciers.",
            "image": "images/guided_high_altitude_snow_trek_service.webp"
        },
        {
            "name": "Private Heli-Skiing Alpine Expedition",
            "category": "experiences",
            "description": "Drop onto virgin untouched powder snow peaks with private mountain rescue guides.",
            "image": "images/heli_skiing_expedition_service.webp"
        },
        {
            "name": "Manta Ray & Coral Lagoon Safari",
            "category": "experiences",
            "description": "Snorkel with gentle giant manta rays in crystal clear protected marine sanctuaries.",
            "image": "images/manta_ray_lagoon_safari_service.webp"
        },
        {
            "name": "Wild Dolphin Snorkel Excursion",
            "category": "experiences",
            "description": "Swim alongside wild spinner dolphin pods in turquoise South Pacific waters.",
            "image": "images/dolphin_snorkel_safari_service.webp"
        },
        {
            "name": "Coral Reef Night Dive & Bio-Luminescence",
            "category": "experiences",
            "description": "Guided night dive uncovering glowing bioluminescent plankton and nocturnal sea life.",
            "image": "images/coral_reef_night_dive_service.webp"
        },
        {
            "name": "Traditional Wooden Dhow Sunset Sail",
            "category": "experiences",
            "description": "Romantic sunset sail on handcrafted mahogany dhow boats along Zanzibar spice coasts.",
            "image": "images/traditional_dhow_sunset_cruise_service.webp"
        },
        {
            "name": "Kerala Houseboat Backwater Cruise",
            "category": "experiences",
            "description": "Private teak houseboat navigation through tranquil palm-fringed Kerala backwater canals.",
            "image": "images/private_houseboat_sunset_cruise_service.webp"
        },
        {
            "name": "Andaman Sea Limestone Cave Longtail Charter",
            "category": "experiences",
            "description": "Private longtail boat exploration of hidden limestone sea caves and emerald lagoons.",
            "image": "images/andaman_sea_longtail_charter_service.webp"
        },
        {
            "name": "Private Kyoto Zen Tea Ceremony",
            "category": "experiences",
            "description": "Authentic Matcha tea preparation guided by 15th-generation Grand Tea Masters.",
            "image": "images/private_tea_ceremony_service.webp"
        },
        {
            "name": "Geisha Cultural Evening & Shamisen Concert",
            "category": "experiences",
            "description": "Exclusive private dinner with authentic Geiko and Maiko artists in Gion Kyoto.",
            "image": "images/geisha_cultural_evening_service.webp"
        },
        {
            "name": "Zen Calligraphy & Ink Masterclass",
            "category": "experiences",
            "description": "Brushwork calligraphy meditation using traditional sumi ink and rice paper.",
            "image": "images/zen_calligraphy_workshop_service.webp"
        },
        {
            "name": "Water Temple Blessing Ceremony",
            "category": "experiences",
            "description": "Purification ritual led by Balinese high priests at sacred jungle holy water springs.",
            "image": "images/water_temple_ceremony_service.webp"
        },
        {
            "name": "Giant Tortoise Sanctuary Conservation Walk",
            "category": "experiences",
            "description": "Guided sanctuary walk feeding 100-year-old Aldabra giant tortoises in Seychelles.",
            "image": "images/giant_turtle_conservation_walk_service.webp"
        },
        {
            "name": "Spice Island Botanical & Heritage Walk",
            "category": "experiences",
            "description": "Discover organic clove, nutmeg, and vanilla spice plantations with resident botanists.",
            "image": "images/spice_lsland_botanical_tour_service.webp"
        },
        {
            "name": "Royal Sandstone Fort Starlit Sitar Concert",
            "category": "experiences",
            "description": "Hypnotic classical Indian sitar performance under Thar desert night skies.",
            "image": "images/starlit_sitar_performance_service.webp"
        },
        {
            "name": "Glass Dome Observatory Stargazing Night",
            "category": "experiences",
            "description": "Private astronomer telescope tour identifying deep space nebula and constellations.",
            "image": "images/glass_dome_stargazing_night_service.webp"
        },
        {
            "name": "Helicopter Aegean Caldera Flyover",
            "category": "experiences",
            "description": "Breathtaking aerial flyover of whitewashed Santorini villages and volcanic craters.",
            "image": "images/helicopter_caldera_tour_service.webp"
        }
    ]

    for s in services_data:
        obj, created = Service.objects.update_or_create(
            name=s["name"],
            defaults={
                "category": s["category"],
                "description": s["description"],
                "image": s["image"]
            }
        )
        print(f"[{'CREATED' if created else 'UPDATED'}] Service ({s['category']}): {s['name']}")

    print("\nDistinct Room Image Seeding & Database Sync Completed Successfully!")

if __name__ == "__main__":
    seed()
