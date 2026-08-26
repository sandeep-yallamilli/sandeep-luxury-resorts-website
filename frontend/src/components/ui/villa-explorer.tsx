import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Eye, Layout, Info, Check, Play, Pause, Compass, RotateCcw, MoveHorizontal, Sparkles, Feather, Building2 } from "lucide-react";
import { apiClient, getBackendImageUrl, handleImageError } from "@/lib/api";

interface Villa {
  id: string;
  name: string;
  resort: string;
  size: number;
  capacity: number;
  price: number;
  features: string[];
  desc: string;
  image: string;
  Interiordesign: string;
}

const SIGNATURE_VILLAS: Villa[] = [
  {
    id: "maldives-pavilion",
    name: "Sandeep Maldives Overwater Pavilion",
    resort: "Sandeep Maldives Private Pavilion",
    size: 450,
    capacity: 4,
    price: 420000,
    features: ["Private overwater infinity pool", "24/7 Personal Butler", "Glass floor viewing chamber", "Private chef kitchen", "Private reef access"],
    desc: "Perched over the turquoise Indian Ocean in the Maldives, this overwater pavilion offers unmatched isolation and a sunken pool lounge suspended above the sea.",
    image: "/images/maldives_villa.webp",
    Interiordesign: "/images/Maldives_interior.webp"
  },
  {
    id: "borabora-villa",
    name: "Sandeep Bora Bora Otemanu Lagoon Villa",
    resort: "Sandeep Bora Bora Overwater Lagoon",
    size: 470,
    capacity: 4,
    price: 460000,
    features: ["Mount Otemanu peak views", "Outrigger canoe breakfast", "Private coral glass chamber", "Glass infinity plunge pool"],
    desc: "Overwater coral bungalow under Mount Otemanu in French Polynesia with glass floor lagoon viewing chambers and private outrigger butler delivery.",
    image: "/images/Bora_Bora_Villa.webp",
    Interiordesign: "/images/Bora_Bora_interior.webp"
  },
  {
    id: "seychelles-pavilion",
    name: "Sandeep Seychelles Granite Ocean Pavilion",
    resort: "Sandeep Seychelles Granite Ocean Sanctuary",
    size: 480,
    capacity: 4,
    price: 440000,
    features: ["Granite cliffside infinity pool", "Giant turtle guide access", "Private beach cove", "Seafood chef dining"],
    desc: "Private granite cliffside villa in Seychelles overlooking pristine Indian Ocean reserves with secluded beaches and giant turtle sanctuaries.",
    image: "/images/Seychelles_villa.webp",
    Interiordesign: "/images/Seychelles_interior.webp"
  },
  {
    id: "serengeti-pavilion",
    name: "Sandeep Serengeti Great Migration Safari Pavilion",
    resort: "Sandeep Serengeti Wildlife Sanctuary",
    size: 510,
    capacity: 6,
    price: 510000,
    features: ["Great Migration savanna views", "Dawn hot air balloon launch", "Private 4x4 wildlife ranger", "Starlit campfire banquet"],
    desc: "Savanna luxury tented pavilion in Tanzania nestled along the Great Migration wildlife corridor with private ranger tracking.",
    image: "/images/Serengeti_Villa.webp",
    Interiordesign: "/images/Serengeti_interior.webp"
  },
  {
    id: "marrakech-riad",
    name: "Sandeep Marrakech Royal Imperial Riad",
    resort: "Sandeep Marrakech Royal Oasis Riad",
    size: 490,
    capacity: 6,
    price: 380000,
    features: ["Private marble hammam spa", "Courtyard plunge pool", "Atlas mountain chopper trip", "Terracotta palace terrace"],
    desc: "Opulent terracotta palace riad in Marrakech surrounded by olive groves, marble hammams, and private courtyard pools.",
    image: "/images/Marrakech_villa.webp",
    Interiordesign: "/images/Marrakech_interior.webp"
  },
  {
    id: "zanzibar-pavilion",
    name: "Sandeep Zanzibar Sultan Beach Pavilion",
    resort: "Sandeep Zanzibar Spice Island Resort",
    size: 460,
    capacity: 4,
    price: 350000,
    features: ["Carved mahogany doors", "Traditional dhow boat sail", "Spice garden walk", "Coral reef night diving"],
    desc: "Pristine white-sand coral reef beach sanctuary in Zanzibar with carved mahogany doors, spice gardens, and turquoise lagoon dining.",
    image: "/images/Zanzibar_Villa.webp",
    Interiordesign: "/images/Zanzibar_interior.webp"
  },
  {
    id: "rajasthan-estate",
    name: "Sandeep Rajasthan Maharaja Desert Estate",
    resort: "Sandeep Rajasthan Desert Tent",
    size: 520,
    capacity: 6,
    price: 390000,
    features: ["Hand-carved copper plunge tub", "Private tiger tracking naturalist", "Open sky stargazing courtyard", "Rajasthani silk canopies", "Live sitar evening recitals"],
    desc: "An opulent royal estate at the edge of Ranthambore tiger sanctuary in Rajasthan, India. Features handcrafted copper baths and regal silk interiors.",
    image: "/images/Rajasthan_villa.webp",
    Interiordesign: "/images/Rajasthan_interior.webp"
  },
  {
    id: "kerala-villa",
    name: "Sandeep Kerala Heritage Backwater Villa",
    resort: "Sandeep Kerala Backwaters Wellness Retreat",
    size: 440,
    capacity: 4,
    price: 320000,
    features: ["Private teak houseboat cruise", "Master Ayurvedic Panchakarma", "Lotus lake canoe yoga", "Kathakali cultural performance"],
    desc: "Floating teak houseboats and private palm-lined wellness villas in Kerala, India overlooking serene tropical backwaters.",
    image: "/images/Kerala_villa.webp",
    Interiordesign: "/images/Kerala_interior.webp"
  },
  {
    id: "himalayas-chalet",
    name: "Sandeep Himalayan Snow Peak Cedar Chalet",
    resort: "Sandeep Himalayan Cedar & Snow Sanctuary",
    size: 450,
    capacity: 6,
    price: 360000,
    features: ["Thermal hot spring bath", "High altitude sherpa trek", "Pine wood cedar fireplace", "Snow peak glass windows"],
    desc: "Pine-scented cedar chalets nestled high in the Himalayan snow valleys of Himachal Pradesh, India with private outdoor hot springs.",
    image: "/images/Himalayan_villa.webp",
    Interiordesign: "/images/Himalayan_interior.webp"
  },
  {
    id: "bali-treehouse",
    name: "Sandeep Bali Forest Canopy Treehouse",
    resort: "Sandeep Bali Forest Sanctuary",
    size: 410,
    capacity: 4,
    price: 360000,
    features: ["Cantilevered infinity plunge pool", "Sacred river valley view", "Floating bamboo daybeds", "Morning yoga deck", "Organic botanical bath spa"],
    desc: "Sculpted high into Ubud's sacred forest canopy in Bali, offering breathtaking aerial views over the Ayung river valley with an infinity pool suspended directly above the mist.",
    image: "/images/Bali_Forest_villa.webp",
    Interiordesign: "/images/Bali_Forest_interior.webp"
  },
  {
    id: "kyoto-sanctuary",
    name: "Sandeep Kyoto Zen Sanctuary",
    resort: "Sandeep Kyoto Zen Pavilion",
    size: 320,
    capacity: 2,
    price: 350000,
    features: ["Private dry stone Zen garden", "Cypress wood mineral onsen", "Traditional tea salon room", "Premium tatami weave floors", "Personal tea master service"],
    desc: "Constructed without a single metallic nail using traditional Japanese woodcraft in Kyoto. Features paper shoji screens framing 400-year-old rock gardens.",
    image: "/images/Kyoto_villa.webp",
    Interiordesign: "/images/Kyoto_interior.webp"
  },
  {
    id: "thailand-villa",
    name: "Sandeep Thailand Emerald Cliffside Pool Villa",
    resort: "Sandeep Thailand Emerald Bay Cliff Sanctuary",
    size: 470,
    capacity: 4,
    price: 340000,
    features: ["Andaman sea longtail cruise", "Royal Thai herbal compress spa", "Phang Nga bay cliff views", "Private chef seafood banquet"],
    desc: "Secluded limestone ocean cliffside villas surrounded by emerald Andaman Sea waters in Phuket, Thailand.",
    image: "/images/Thailand_villa.webp",
    Interiordesign: "/images/Thailand_interior.webp"
  },
  {
    id: "alps-chalet",
    name: "Sandeep Alps Starlight Glass Chalet",
    resort: "Sandeep Alps Snow Chalet",
    size: 380,
    capacity: 6,
    price: 420000,
    features: ["Glass dome bedroom roof", "Private sauna & steam room", "Grand stone fireplace", "Ski-in / Ski-out access", "Wine cellar collection"],
    desc: "A multi-level chalet in Zermatt, Switzerland outlining Matterhorn peaks. Watch snow fall through the heated glass dome in absolute alpine luxury.",
    image: "/images/Alps_villa.webp",
    Interiordesign: "/images/Alps_interior.webp"
  },
  {
    id: "santorini-suite",
    name: "Sandeep Santorini Caldera Sunset Suite",
    resort: "Sandeep Santorini Caldera Cliffside",
    size: 480,
    capacity: 4,
    price: 540000,
    features: ["Cliffside infinity plunge pool", "Private volcanic wine cellar", "Panoramic Caldera sunset terrace", "White cave architecture", "Helicopter pad transfer access"],
    desc: "Suspended directly over the azure Aegean Sea in Santorini, Greece. Features cliffside plunge pools, white cave architecture, and private wine cellars.",
    image: "/images/Santorini_villa.webp",
    Interiordesign: "/images/Santorini_interior.webp"
  },
  {
    id: "amalfi-villa",
    name: "Sandeep Amalfi Cliffside Manor Villa",
    resort: "Sandeep Amalfi Coast Cliff Manor",
    size: 500,
    capacity: 6,
    price: 460000,
    features: ["Terraced citrus grove pool", "Private Riva mahogany boat access", "Cliffside dining pavilion", "Personal sommelier service", "Positano coast views"],
    desc: "Hanging high above Positano on Italy's Amalfi Coast, surrounded by private organic lemon groves and sweeping Tyrrhenian Sea views.",
    image: "/images/Amalfi_villa.webp",
    Interiordesign: "/images/Amalfi_interior.webp"
  },
  {
    id: "fiji-villa",
    name: "Sandeep Fiji Yasawa Sunset Lagoon Villa",
    resort: "Sandeep Fiji Private Island Sanctuary",
    size: 490,
    capacity: 4,
    price: 450000,
    features: ["Private overwater plunge pool", "24/7 Polynesian Butler", "Glass lagoon viewing chamber", "Helicopter pad transfer", "Private coral reef access"],
    desc: "Perched over pristine turquoise South Pacific lagoons in the Yasawa Islands of Fiji with overwater glass plunge pools and private coral reef coves.",
    image: "/images/Fiji_Yasawa_Villa.webp",
    Interiordesign: "/images/Fiji_interior.webp"
  }
];

interface VillaExplorerProps {
  initialResortSlug?: string;
  initialVillaId?: string;
}

export default function VillaExplorer({ initialResortSlug, initialVillaId }: VillaExplorerProps = {}) {
  const [villas, setVillas] = useState<Villa[]>(SIGNATURE_VILLAS);
  const [activeVilla, setActiveVilla] = useState<Villa | null>(() => {
    if (initialResortSlug) {
      const match = SIGNATURE_VILLAS.find(
        (v) =>
          v.id.toLowerCase().includes(initialResortSlug.toLowerCase()) ||
          v.resort.toLowerCase().includes(initialResortSlug.toLowerCase())
      );
      if (match) return match;
    }
    if (initialVillaId) {
      const match = SIGNATURE_VILLAS.find((v) => v.id === initialVillaId);
      if (match) return match;
    }
    return SIGNATURE_VILLAS[0] || null;
  });
  const [activeTab, setActiveTab] = useState<"details" | "exterior" | "Interiordesign" | "tour">("details");

  // 360 Tour Interactive State with Dual View Modes (Exterior & Interior)
  const [tourViewMode, setTourViewMode] = useState<"exterior" | "interior">("exterior");
  const [tourAngle, setTourAngle] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef<number>(0);
  const dragStartAngle = useRef<number>(0);

  useEffect(() => {
    apiClient.getRooms().then((backendRooms) => {
      if (backendRooms && backendRooms.length > 0) {
        const mapped: Villa[] = backendRooms.map((rm) => {
          const matchedSignature = SIGNATURE_VILLAS.find(
            (sv) =>
              sv.name.toLowerCase() === rm.room_type.toLowerCase() ||
              sv.resort.toLowerCase() === (rm.resort_name || "").toLowerCase()
          );
          return {
            id: String(rm.id),
            name: rm.room_type,
            resort: rm.resort_name || "Sandeep Luxury Resort",
            size: matchedSignature?.size || 350 + (rm.id * 20) % 150,
            capacity: matchedSignature?.capacity || 2 + (rm.id % 4),
            price: parseFloat(rm.price) || matchedSignature?.price || 350000,
            features: matchedSignature?.features || ["Private Pool / Hot Tub", "24/7 Butler Service", "Panoramic Horizon View", "Organic Spa Amenities"],
            desc: matchedSignature?.desc || `Luxury ${rm.room_type} located at ${rm.resort_name || 'our exclusive sanctuary'}. Crafted for ultimate serenity and private relaxation.`,
            image: rm.image || matchedSignature?.image || "/images/Fiji_Yasawa_Villa.webp",
            Interiordesign: rm.interior_image || matchedSignature?.Interiordesign || "/images/Fiji_interior.webp",
          };
        });
        setVillas(mapped);
        if (initialResortSlug) {
          const match = mapped.find(
            (v) =>
              v.resort.toLowerCase().includes(initialResortSlug.toLowerCase()) ||
              v.name.toLowerCase().includes(initialResortSlug.toLowerCase())
          );
          if (match) {
            setActiveVilla(match);
            return;
          }
        }
        if (initialVillaId) {
          const match = mapped.find((v) => v.id === initialVillaId);
          if (match) {
            setActiveVilla(match);
            return;
          }
        }
        setActiveVilla((curr) => {
          if (curr) {
            const found = mapped.find(
              (m) => m.name.toLowerCase() === curr.name.toLowerCase() || m.resort.toLowerCase() === curr.resort.toLowerCase()
            );
            if (found) return found;
          }
          return mapped[0];
        });
      }
    }).catch(console.error);
  }, [initialResortSlug, initialVillaId]);

  // 360 Auto-Rotation Effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (activeTab === "tour" && isAutoRotating && !isDragging) {
      interval = setInterval(() => {
        setTourAngle((prev) => (prev + 0.3) % 360);
      }, 30);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeTab, isAutoRotating, isDragging]);

  // Mouse Drag Handlers for 360 Tour
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartX.current = e.clientX;
    dragStartAngle.current = tourAngle;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartX.current;
    const sensitivity = 0.4;
    let newAngle = (dragStartAngle.current - deltaX * sensitivity) % 360;
    if (newAngle < 0) newAngle += 360;
    setTourAngle(newAngle);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch Drag Handlers for Mobile 360 Tour
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      dragStartX.current = e.touches[0].clientX;
      dragStartAngle.current = tourAngle;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - dragStartX.current;
    const sensitivity = 0.4;
    let newAngle = (dragStartAngle.current - deltaX * sensitivity) % 360;
    if (newAngle < 0) newAngle += 360;
    setTourAngle(newAngle);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Helper for cardinal compass heading
  const getCompassHeading = (degree: number) => {
    const deg = (degree % 360 + 360) % 360;
    if (deg >= 337.5 || deg < 22.5) return "N (North)";
    if (deg >= 22.5 && deg < 67.5) return "NE (North-East)";
    if (deg >= 67.5 && deg < 112.5) return "E (East)";
    if (deg >= 112.5 && deg < 157.5) return "SE (South-East)";
    if (deg >= 157.5 && deg < 202.5) return "S (South)";
    if (deg >= 202.5 && deg < 247.5) return "SW (South-West)";
    if (deg >= 247.5 && deg < 292.5) return "W (West)";
    return "NW (North-West)";
  };

  if (!activeVilla) return null;

  return (
    <div className="w-full bg-background text-foreground rounded-2xl border border-gold/15 overflow-hidden shadow-2xl">
      {/* Horizontal Villa Selector Pills */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2.5 sm:pb-3 scrollbar-none px-3 sm:px-6 pt-3 sm:pt-4 border-b border-gold/15 bg-background/90 backdrop-blur-md">
        {villas.map((villa) => {
          const shortName = villa.name.startsWith("Sandeep ")
            ? villa.name
              .replace("Sandeep ", "")
              .replace(" Private", "")
              .replace(" Pavilion", "")
              .replace(" Villa", "")
              .replace(" Sanctuary", "")
              .replace(" Retreat", "")
              .replace(" Resort", "")
              .replace(" Chalet", "")
              .replace(" Tent", "")
              .replace(" Manor", "")
            : villa.name;

          return (
            <button
              key={villa.id}
              onClick={() => {
                setActiveVilla(villa);
                setActiveTab("details");
              }}
              className={`px-3 py-1.5 text-[10px] sm:text-xs tracking-wider uppercase font-semibold rounded-full border transition-all duration-300 cursor-pointer shrink-0 ${activeVilla.id === villa.id
                ? "border-gold text-gold bg-gold/15 shadow-sm"
                : "border-gold/15 text-foreground/60 hover:text-foreground hover:border-gold/40 hover:bg-gold/5"
                }`}
              title={villa.name}
            >
              {shortName}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">

        {/* Left Side: Media Preview & 360 Tour Canvas */}
        <div className="lg:col-span-7 relative h-72 sm:h-96 md:h-110 lg:h-130 bg-background/20 select-none overflow-hidden">
          {activeTab === "details" && (
            <div className="relative w-full h-full">
              {activeVilla.image ? (
                <img
                  src={getBackendImageUrl(activeVilla.image)}
                  alt={activeVilla.name}
                  className="w-full h-full object-cover transition-opacity duration-500 absolute inset-0"
                  loading="lazy"
                  onError={handleImageError}
                />
              ) : null}
              <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 bg-background/80 backdrop-blur-md border border-gold/20 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full flex items-center gap-1.5 sm:gap-2 max-w-[80%] sm:max-w-none">
                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gold shrink-0" />
                <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-gold font-semibold truncate">Architectural Framing</span>
              </div>
            </div>
          )}

          {activeTab === "exterior" && (
            <div className="relative w-full h-full">
              {activeVilla.image ? (
                <img
                  src={getBackendImageUrl(activeVilla.image)}
                  alt={`${activeVilla.name} Exterior`}
                  className="w-full h-full object-cover img-clear transition-opacity duration-500 absolute inset-0"
                  loading="eager"
                  onError={handleImageError}
                />
              ) : null}
              <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 bg-background/80 backdrop-blur-md border border-gold/20 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full flex items-center gap-1.5 sm:gap-2 max-w-[80%] sm:max-w-none">
                <Building2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gold shrink-0" />
                <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-gold font-semibold truncate">Exterior Facade</span>
              </div>
            </div>
          )}

          {activeTab === "Interiordesign" && (
            <div className="relative w-full h-full">
              {activeVilla.Interiordesign ? (
                <img
                  src={getBackendImageUrl(activeVilla.Interiordesign)}
                  alt={`${activeVilla.name} Interior`}
                  className="w-full h-full object-cover img-clear transition-opacity duration-500 absolute inset-0"
                  loading="eager"
                  onError={handleImageError}
                />
              ) : null}
              <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 bg-background/80 backdrop-blur-md border border-gold/20 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full flex items-center gap-1.5 sm:gap-2 max-w-[80%] sm:max-w-none">
                <Feather className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gold shrink-0" />
                <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-gold font-semibold truncate">Bespoke Interior Craftsmanship</span>
              </div>
            </div>
          )}

          {/* Interactive 360° Virtual Tour Panorama Canvas with Dual Exterior & Interior View Modes */}
          {activeTab === "tour" && (
            <div
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className={`w-full h-full relative overflow-hidden bg-background flex items-center justify-center cursor-${isDragging ? "grabbing" : "grab"}`}
            >
              {/* Seamless Tiling Background Image for 360 Pan */}
              <div
                className="w-full h-full transition-transform duration-75 ease-out"
                style={{
                  backgroundImage: `url(${getBackendImageUrl(tourViewMode === "exterior" ? activeVilla.image : (activeVilla.Interiordesign || activeVilla.image))})`,
                  backgroundSize: "cover",
                  backgroundPosition: `${-tourAngle * 8}px center`,
                  backgroundRepeat: "repeat-x",
                }}
              />

              {/* 360 Tour Controls Overlay */}
              <div className="absolute inset-0 bg-linear-to-b from-background/70 via-transparent to-background/80 flex flex-col justify-between p-3 sm:p-5 md:p-6 pointer-events-none">

                {/* Top Bar: Compass & Dual Exterior/Interior Switcher */}
                <div className="flex flex-wrap items-center justify-between gap-1.5 sm:gap-2 pointer-events-auto">
                  <div className="flex items-center gap-1.5 bg-background/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-gold/30 shadow-lg">
                    <Compass className="w-3 h-3 text-gold animate-spin-slow" />
                    <span className="text-[9px] sm:text-[10px] font-mono tracking-widest text-gold uppercase font-semibold">
                      360° {tourViewMode.toUpperCase()} • {getCompassHeading(tourAngle)}
                    </span>
                  </div>

                  {/* 360 Exterior vs Interior View Switcher */}
                  <div className="flex items-center gap-1 bg-background/90 backdrop-blur-md p-0.5 sm:p-1 rounded-full border border-gold/30 shadow-lg">
                    <button
                      onClick={() => setTourViewMode("exterior")}
                      className={`flex items-center gap-1 text-[8.5px] sm:text-[9px] uppercase tracking-widest font-semibold px-2.5 sm:px-3 py-1 rounded-full transition-all cursor-pointer ${tourViewMode === "exterior"
                        ? "bg-gold text-background shadow-sm"
                        : "text-gold/70 hover:text-gold"
                        }`}
                    >
                      <Building2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> 360° Exterior
                    </button>
                    <button
                      onClick={() => setTourViewMode("interior")}
                      className={`flex items-center gap-1 text-[8.5px] sm:text-[9px] uppercase tracking-widest font-semibold px-2.5 sm:px-3 py-1 rounded-full transition-all cursor-pointer ${tourViewMode === "interior"
                        ? "bg-gold text-background shadow-sm"
                        : "text-gold/70 hover:text-gold"
                        }`}
                    >
                      <Layout className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> 360° Interior
                    </button>
                  </div>

                  <button
                    onClick={() => setIsAutoRotating(!isAutoRotating)}
                    className="flex items-center gap-1 text-[8.5px] sm:text-[9px] uppercase tracking-widest font-semibold px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border border-gold/30 bg-background/90 backdrop-blur-md text-gold hover:bg-gold/20 transition-all cursor-pointer shadow-lg"
                  >
                    {isAutoRotating ? <Pause className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> : <Play className="w-2.5 h-2.5 sm:w-3 sm:h-3" />}
                    <span>{isAutoRotating ? "Pause" : "Rotate"}</span>
                  </button>
                </div>

                {/* Center Drag Hint Overlay */}
                <div className="hidden sm:flex self-center bg-background/80 backdrop-blur-md border border-gold/20 px-4 py-2 rounded-full items-center gap-2 text-foreground/80 text-[11px] font-sans tracking-wide shadow-xl">
                  <MoveHorizontal className="w-4 h-4 text-gold animate-pulse" />
                  <span>Click & Drag or Swipe to Pan 360° {tourViewMode === "exterior" ? "Exterior Facade" : "Interior Sanctuary"}</span>
                </div>

                {/* Bottom Angle & Reset Control Bar */}
                <div className="flex items-center justify-between gap-3 sm:gap-4 pointer-events-auto bg-background/90 backdrop-blur-md border border-gold/20 p-2 sm:p-3 rounded-xl shadow-xl">
                  <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] uppercase tracking-widest text-gold font-mono">
                    <span>{Math.round(tourAngle % 360)}°</span>
                  </div>

                  <div className="flex-1 max-w-xs flex items-center gap-2">
                    <input
                      type="range"
                      min="0"
                      max="360"
                      value={Math.round(tourAngle % 360)}
                      onChange={(e) => setTourAngle(Number(e.target.value))}
                      className="w-full accent-gold bg-gold/20 h-1.5 rounded-lg cursor-pointer"
                    />
                  </div>

                  <button
                    onClick={() => setTourAngle(0)}
                    className="p-1 sm:p-1.5 rounded-lg border border-gold/20 text-gold hover:bg-gold/10 transition-colors cursor-pointer"
                    title="Reset to 0° North View"
                  >
                    <RotateCcw className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* Absolute overlay price tag */}
          <div className="absolute top-3 right-3 sm:top-6 sm:right-6 bg-background/85 backdrop-blur-md border border-gold/20 p-2 sm:p-3 rounded-lg text-right z-10 pointer-events-none shadow-lg">
            <span className="text-[7.5px] sm:text-[8px] uppercase tracking-widest text-foreground/50 block">Investment</span>
            <span className="font-editorial text-lg sm:text-2xl text-gold font-bold">₹{activeVilla.price.toLocaleString()}</span>
            <span className="text-[9px] sm:text-[10px] text-foreground/50 block">/ night</span>
          </div>
        </div>

        {/* Right Side: Information & Controls */}
        <div className="lg:col-span-5 p-4 sm:p-6 md:p-8 flex flex-col justify-between space-y-4 sm:space-y-6 bg-background/60 border-t lg:border-t-0 lg:border-l border-gold/10">

          {/* Sub-tab navigation bar with Details, Exterior, Interior, 360 Tour */}
          <div className="flex flex-wrap gap-1.5 border-b border-gold/10 pb-4">
            <button
              onClick={() => setActiveTab("details")}
              className={`flex items-center gap-1 text-[10px] uppercase tracking-widest font-semibold px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer ${activeTab === "details" ? "bg-gold/15 border-gold text-gold shadow-sm" : "border-transparent text-foreground/60 hover:text-foreground hover:bg-gold/5"}`}
            >
              <Info className="w-3 h-3" /> Details
            </button>
            <button
              onClick={() => setActiveTab("exterior")}
              className={`flex items-center gap-1 text-[10px] uppercase tracking-widest font-semibold px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer ${activeTab === "exterior" ? "bg-gold/15 border-gold text-gold shadow-sm" : "border-transparent text-foreground/60 hover:text-foreground hover:bg-gold/5"}`}
            >
              <Building2 className="w-3 h-3" /> Exterior
            </button>
            <button
              onClick={() => setActiveTab("Interiordesign")}
              className={`flex items-center gap-1 text-[10px] uppercase tracking-widest font-semibold px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer ${activeTab === "Interiordesign" ? "bg-gold/15 border-gold text-gold shadow-sm" : "border-transparent text-foreground/60 hover:text-foreground hover:bg-gold/5"}`}
            >
              <Layout className="w-3 h-3" /> Interior
            </button>
            <button
              onClick={() => setActiveTab("tour")}
              className={`flex items-center gap-1 text-[10px] uppercase tracking-widest font-semibold px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer ${activeTab === "tour" ? "bg-gold/15 border-gold text-gold shadow-sm" : "border-transparent text-foreground/60 hover:text-foreground hover:bg-gold/5"}`}
            >
              <Eye className="w-3 h-3" /> 360° Tour
            </button>
          </div>

          {/* Details Tab Content */}
          {activeTab === "details" && (
            <div className="space-y-4 flex-1">
              <div>
                <span className="text-[9px] uppercase tracking-[0.2em] text-gold font-semibold block">{activeVilla.resort}</span>
                <h2 className="font-editorial text-2xl text-foreground font-semibold mt-1">{activeVilla.name}</h2>
              </div>

              <p className="text-xs text-foreground/70 leading-relaxed font-sans">
                {activeVilla.desc}
              </p>

              {/* Spec metrics */}
              <div className="grid grid-cols-2 gap-4 py-3 border-y border-gold/10">
                <div>
                  <span className="text-[9px] uppercase tracking-widest text-foreground/50 block">Footprint</span>
                  <span className="font-editorial text-lg text-gold font-medium">{activeVilla.size} m²</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-widest text-foreground/50 block">Capacity</span>
                  <span className="font-editorial text-lg text-gold font-medium">{activeVilla.capacity} Guests</span>
                </div>
              </div>

              {/* Key Amenities */}
              <div className="space-y-2">
                <span className="text-[9px] uppercase tracking-widest text-gold font-semibold block">In-Villa Luxuries</span>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeVilla.features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-2 text-[10px] text-foreground/70">
                      <Check className="w-3 h-3 text-gold shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Exterior Architecture Tab Content */}
          {activeTab === "exterior" && (
            <div className="space-y-4 flex-1">
              <div>
                <span className="text-[9px] uppercase tracking-[0.2em] text-gold font-semibold block">Exterior Facade & Landscape Integration</span>
                <h2 className="font-editorial text-2xl text-foreground font-semibold mt-1">{activeVilla.name} Exterior</h2>
              </div>

              <p className="text-xs text-foreground/70 leading-relaxed font-sans">
                Engineered with zero ecological footprint frameworks, combining native stone masonry, cantilevered plunge pools, and private ocean or mountain horizon decks.
              </p>

              {/* Exterior Specs */}
              <div className="grid grid-cols-2 gap-4 py-3 border-y border-gold/10">
                <div>
                  <span className="text-[9px] uppercase tracking-widest text-foreground/50 block">Outdoor Deck</span>
                  <span className="font-editorial text-base text-gold font-medium">Private Infinity Lounge</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-widest text-foreground/50 block">Landscape</span>
                  <span className="font-editorial text-base text-gold font-medium">Native Flora Garden</span>
                </div>
              </div>

              {/* Exterior Highlights */}
              <div className="space-y-2">
                <span className="text-[9px] uppercase tracking-widest text-gold font-semibold block">Exterior Architecture Highlights</span>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <li className="flex items-center gap-2 text-[10px] text-foreground/70">
                    <Check className="w-3 h-3 text-gold shrink-0" />
                    <span>Private cantilevered infinity pool</span>
                  </li>
                  <li className="flex items-center gap-2 text-[10px] text-foreground/70">
                    <Check className="w-3 h-3 text-gold shrink-0" />
                    <span>Direct reef or mountain access</span>
                  </li>
                  <li className="flex items-center gap-2 text-[10px] text-foreground/70">
                    <Check className="w-3 h-3 text-gold shrink-0" />
                    <span>Sunken outdoor fire lounge</span>
                  </li>
                  <li className="flex items-center gap-2 text-[10px] text-foreground/70">
                    <Check className="w-3 h-3 text-gold shrink-0" />
                    <span>Zero ecological impact materials</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Interior Design Tab Content */}
          {activeTab === "Interiordesign" && (
            <div className="space-y-4 flex-1">
              <div>
                <span className="text-[9px] uppercase tracking-[0.2em] text-gold font-semibold block">Bespoke Materiality & Interior Styling</span>
                <h2 className="font-editorial text-2xl text-foreground font-semibold mt-1">{activeVilla.name} Interior</h2>
              </div>

              <p className="text-xs text-foreground/70 leading-relaxed font-sans">
                Crafted using locally sourced natural stone, hand-loomed silk drapery, acoustic timber panelling, and customized ambient lighting tuned to circadian rhythms.
              </p>

              {/* Interior Layout Spec Highlights */}
              <div className="grid grid-cols-2 gap-4 py-3 border-y border-gold/10">
                <div>
                  <span className="text-[9px] uppercase tracking-widest text-foreground/50 block">Master Suite</span>
                  <span className="font-editorial text-base text-gold font-medium">Custom King Sanctuary</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-widest text-foreground/50 block">En-Suite Bath</span>
                  <span className="font-editorial text-base text-gold font-medium">Stone & Copper Bathing</span>
                </div>
              </div>

              {/* Interior Finishes Checklist */}
              <div className="space-y-2">
                <span className="text-[9px] uppercase tracking-widest text-gold font-semibold block">Crafted Interior Details</span>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <li className="flex items-center gap-2 text-[10px] text-foreground/70">
                    <Check className="w-3 h-3 text-gold shrink-0" />
                    <span>Acoustic timber ceilings</span>
                  </li>
                  <li className="flex items-center gap-2 text-[10px] text-foreground/70">
                    <Check className="w-3 h-3 text-gold shrink-0" />
                    <span>Circadian lighting system</span>
                  </li>
                  <li className="flex items-center gap-2 text-[10px] text-foreground/70">
                    <Check className="w-3 h-3 text-gold shrink-0" />
                    <span>Hand-carved stone bath</span>
                  </li>
                  <li className="flex items-center gap-2 text-[10px] text-foreground/70">
                    <Check className="w-3 h-3 text-gold shrink-0" />
                    <span>Bespoke silk drapery</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* 360 Tour Mode Right Side Panel */}
          {activeTab === "tour" && (
            <div className="space-y-4 flex-1">
              <div>
                <span className="text-[9px] uppercase tracking-[0.2em] text-gold font-semibold block">360° Dual Horizon Exploration</span>
                <h2 className="font-editorial text-2xl text-foreground font-semibold mt-1">{activeVilla.name}</h2>
              </div>
              <p className="text-xs text-foreground/70 leading-relaxed font-sans">
                Experience full 360-degree spatial immersion. Switch seamlessly between exterior architecture and interior sanctuary panoramas.
              </p>

              {/* Dual Mode Switcher on Right Panel */}
              <div className="grid grid-cols-2 gap-2 p-1.5 bg-gold/10 border border-gold/20 rounded-xl">
                <button
                  onClick={() => setTourViewMode("exterior")}
                  className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-[10px] uppercase tracking-widest font-semibold transition-all cursor-pointer ${tourViewMode === "exterior" ? "bg-gold text-background shadow-md font-bold" : "text-gold/80 hover:bg-gold/10"
                    }`}
                >
                  <Building2 className="w-3.5 h-3.5" /> 360° Exterior
                </button>
                <button
                  onClick={() => setTourViewMode("interior")}
                  className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-[10px] uppercase tracking-widest font-semibold transition-all cursor-pointer ${tourViewMode === "interior" ? "bg-gold text-background shadow-md font-bold" : "text-gold/80 hover:bg-gold/10"
                    }`}
                >
                  <Layout className="w-3.5 h-3.5" /> 360° Interior
                </button>
              </div>

              <div className="p-3 bg-gold/5 border border-gold/15 rounded-xl space-y-1.5">
                <span className="text-[10px] text-gold uppercase tracking-widest font-semibold block">Interactive Instructions</span>
                <p className="text-[11px] text-foreground/80 leading-normal">
                  - Drag left/right or swipe to pan 360° horizon.<br />
                  - Toggle Auto-Rotate for continuous motion.<br />
                  - Switch between 360° Exterior and 360° Interior above.
                </p>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="pt-4 border-t border-gold/10 flex items-center justify-between gap-4">
            <Link
              to="/book"
              className="flex-1 text-center py-3 bg-gold hover:bg-gold/90 text-foreground font-semibold text-xs tracking-widest uppercase transition-all rounded-lg cursor-pointer shadow-lg hover:shadow-gold/20"
            >
              Reserve This Sanctuary →
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
