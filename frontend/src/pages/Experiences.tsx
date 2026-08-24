import { useEffect, useState } from "react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import SmoothScrollProvider from "@/components/layout/smooth-scroll-provider";
import ServiceBookingModal from "@/components/ui/service-booking-modal";
import { Sparkles, Compass, CompassIcon, CalendarCheck, ShieldCheck, MapPin, Globe, Star, ArrowRight } from "lucide-react";
import { apiClient, Service, getBackendImageUrl, useBanner, handleImageError } from "@/lib/api";
import { Link } from "react-router-dom";

const WELLNESS_KEYWORDS = [
  "spa", "wellness", "yoga", "ayurved", "hammam", "detox", "meditation",
  "hydrotherapy", "herbal", "tea", "bath", "spring", "massage", "panchakarma",
  "cleansing", "zen", "ritual", "mindfulness", "scrub", "body", "onsen"
];

const DINING_KEYWORDS = [
  "dining", "dinner", "banquet", "wine", "culinary", "chef", "tasting",
  "seafood", "food", "cook", "kaiseki", "menu", "sommelier", "table",
  "bar", "champagne", "gastronomy", "cruise", "barbecue", "breakfast", "tajine"
];

const STATS = [
  { value: "50+", label: "Bespoke Adventures", icon: Compass },
  { value: "5", label: "Continents", icon: Globe },
  { value: "100%", label: "Private Charters", icon: ShieldCheck },
  { value: "5★", label: "Expedition Rating", icon: Star },
];

function getExperienceImage(service: Service): string {
  return service.image ? getBackendImageUrl(service.image) : "";
}

export default function Experiences() {
  const [allServices, setAllServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<"excursions" | "wellness" | "dining" | "all">("excursions");
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const heroBanner = useBanner("experiences_hero", "/images/experiences_hero.webp");

  useEffect(() => {
    apiClient.getServices()
      .then(setAllServices)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredServices = allServices.filter((s) => {
    if (activeCategory === "all") return true;
    if (s.category) {
      if (activeCategory === "excursions") return s.category === "experiences" || s.category === "general";
      return s.category === activeCategory;
    }
    const text = (s.name + " " + s.description).toLowerCase();
    if (activeCategory === "wellness") {
      return WELLNESS_KEYWORDS.some((kw) => text.includes(kw));
    }
    if (activeCategory === "dining") {
      return DINING_KEYWORDS.some((kw) => text.includes(kw));
    }
    if (activeCategory === "excursions") {
      return !WELLNESS_KEYWORDS.some((kw) => text.includes(kw)) && !DINING_KEYWORDS.some((kw) => text.includes(kw));
    }
    return true;
  });

  const handleOpenBooking = (serviceName: string) => {
    setSelectedService(serviceName);
    setIsModalOpen(true);
  };

  return (
    <SmoothScrollProvider>
      <Header />
      <main className="bg-background min-h-screen pt-24 sm:pt-32 pb-16 sm:pb-24 px-4 sm:px-6 md:px-8">
        <div className="max-w-7xl mx-auto space-y-14 sm:space-y-20">

          {/* ── Hero Header ── */}
          <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-5">
            <span className="text-gold tracking-[0.25em] sm:tracking-[0.28em] text-[9.5px] sm:text-[10px] uppercase font-semibold block">
              Global Curations
            </span>
            <h1 className="font-editorial text-3xl sm:text-4xl md:text-6xl text-foreground leading-tight">
              Safaris, Expeditions &amp;<br className="hidden md:block" /> Bespoke Services
            </h1>
            <p className="text-foreground/60 text-xs sm:text-sm leading-relaxed font-sans max-w-2xl mx-auto">
              From dawn hot air balloon flights above the Serengeti to high-altitude Himalayan snow treks
              and private catamaran charters, immerse yourself in rare global adventures.
            </p>
          </div>

          {/* ── Featured Hero Banner ── */}
          {heroBanner.image ? (
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gold/20 h-72 sm:h-105 md:h-130 group">
              <img
                src={heroBanner.image}
                alt={heroBanner.title || "Atlas Mountain Helicopter Tour"}
                className="w-full h-full object-cover object-[center_35%] absolute inset-0 group-hover:scale-[1.03] transition-transform duration-700"
                loading="lazy"
                onError={handleImageError}
              />
              <div className="absolute inset-0 bg-linear-to-t from-background via-background/30 to-transparent flex items-end p-5 sm:p-8 md:p-14">
                <div className="space-y-2 sm:space-y-3 max-w-2xl">
                  <span className="text-gold text-[9px] sm:text-[10px] uppercase tracking-[0.25em] font-semibold block">
                    Signature Expedition
                  </span>
                  <h2 className="font-editorial text-2xl sm:text-3xl md:text-4xl text-foreground">
                    Atlas Mountain Aerial Expedition
                  </h2>
                  <p className="text-foreground/70 text-xs md:text-sm font-sans leading-relaxed">
                    Charter a private helicopter over snow-capped High Atlas peaks, ancient Berber mountain fortresses, and secluded terraced valleys.
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          {/* ── Stats Band ── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-gold/10 rounded-2xl overflow-hidden border border-gold/10">
            {STATS.map(({ value, label, icon: Icon }) => (
              <div key={label} className="bg-background/80 px-3 sm:px-6 py-5 sm:py-8 text-center hover:bg-background transition-colors space-y-1">
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold mx-auto mb-1.5 sm:mb-2" />
                <span className="font-editorial text-2xl sm:text-4xl text-gold block">{value}</span>
                <span className="text-[8px] sm:text-[9px] uppercase tracking-widest text-foreground/40 font-medium">{label}</span>
              </div>
            ))}
          </div>

          {/* ── Category Filter Section ── */}
          <section className="space-y-8 sm:space-y-12">
            <div className="flex flex-col items-center space-y-3 sm:space-y-4">
              <span className="text-gold text-[9.5px] sm:text-[10px] uppercase tracking-[0.28em] font-semibold block">
                Portfolio Filter
              </span>
              <h2 className="font-editorial text-2xl sm:text-3xl md:text-4xl text-foreground text-center">
                Explore Curated Adventures
              </h2>

              <div className="flex flex-wrap justify-center gap-2 sm:gap-2.5 pt-1 sm:pt-2">
                {[
                  { id: "excursions", label: "Safaris & Expeditions" },
                  { id: "wellness", label: "Wellness & Spa" },
                  { id: "dining", label: "Fine Dining" },
                  { id: "all", label: `All Services (${allServices.length})` },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveCategory(tab.id as any)}
                    className={`px-3.5 sm:px-5 py-1.5 sm:py-2 text-[9px] sm:text-[10px] uppercase tracking-widest font-semibold rounded-full border transition-all cursor-pointer ${
                      activeCategory === tab.id
                        ? "bg-gold text-background border-gold shadow-lg"
                        : "border-gold/25 text-foreground/60 hover:border-gold hover:text-foreground"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid of Services */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-background border border-gold/10 rounded-2xl overflow-hidden p-6 space-y-4 animate-pulse">
                    <div className="h-52 bg-gold/10 rounded-xl w-full mb-4" />
                    <div className="h-6 bg-foreground/10 rounded w-3/4" />
                    <div className="h-4 bg-foreground/10 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : filteredServices.length === 0 ? (
              <div className="text-center py-16 sm:py-20 border border-dashed border-gold/20 rounded-2xl space-y-4">
                <Compass className="w-10 h-10 sm:w-12 sm:h-12 text-gold/30 mx-auto" />
                <p className="text-foreground/50 text-sm font-sans">No experiences found in this category.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {filteredServices.map((svc) => {
                  const imgSrc = getExperienceImage(svc);
                  return (
                    <div
                      key={svc.id}
                      className="group bg-background text-foreground border border-gold/15 hover:border-gold/45 transition-all duration-500 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl flex flex-col justify-between"
                    >
                      <div>
                        <div className="relative h-48 sm:h-56 w-full overflow-hidden border-b border-gold/10">
                          {imgSrc ? (
                            <img
                              src={getBackendImageUrl(imgSrc)}
                              alt={svc.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 absolute inset-0"
                              loading="lazy"
                              onError={handleImageError}
                            />
                          ) : null}
                          <div className="absolute inset-0 bg-linear-to-t from-background/90 via-transparent to-transparent opacity-80" />
                          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 px-2.5 sm:px-3 py-0.5 sm:py-1 bg-background/80 backdrop-blur-md border border-gold/30 rounded-full flex items-center gap-1.5 shadow-lg">
                            <CompassIcon className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-gold" />
                            <span className="text-[8.5px] sm:text-[9px] uppercase tracking-widest text-gold font-medium">Curated Journey</span>
                          </div>
                        </div>

                        <div className="p-4 sm:p-6 space-y-2 sm:space-y-3">
                          <h3 className="font-editorial text-xl sm:text-2xl text-foreground font-semibold">{svc.name}</h3>
                          <p className="text-xs text-foreground/65 leading-relaxed font-sans">{svc.description}</p>
                        </div>
                      </div>

                      <div className="p-4 sm:p-6 pt-0">
                        <button
                          onClick={() => handleOpenBooking(svc.name)}
                          className="w-full py-2.5 sm:py-3 px-4 border border-gold/30 text-gold hover:bg-gold hover:text-background text-[10px] uppercase tracking-widest font-semibold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                        >
                          <CalendarCheck className="w-3.5 h-3.5" /> Book Experience &rarr;
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* ── CTA Strip ── */}
          <div className="relative rounded-2xl overflow-hidden border border-gold/20 p-6 sm:p-10 md:p-14 text-center space-y-4 sm:space-y-6 bg-linear-to-br from-[#120e08] via-background to-[#120e08]">
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-100 h-50 bg-gold/8 rounded-full blur-3xl pointer-events-none" />
            <span className="text-gold tracking-[0.25em] text-[9.5px] sm:text-[10px] uppercase font-semibold block relative z-10">
              Personalised Itinerary
            </span>
            <h2 className="font-editorial text-2xl sm:text-3xl md:text-5xl text-foreground relative z-10">
              Curate Your Bespoke Expedition
            </h2>
            <p className="text-foreground/50 text-xs sm:text-sm font-sans max-w-xl mx-auto relative z-10">
              Our 24/7 VIP Concierge arranges private jet charters, helicopter arrivals, custom dive expeditions, and personal security.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 relative z-10">
              <button
                onClick={() => handleOpenBooking("Bespoke Custom Expedition")}
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 bg-gold hover:bg-gold/90 text-background font-bold text-xs tracking-[0.15em] uppercase rounded-lg transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer"
              >
                Request Custom Experience <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <Link
                to="/concierge"
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 border border-gold/30 hover:border-gold text-foreground/70 hover:text-gold text-xs tracking-widest uppercase rounded-lg transition-all text-center"
              >
                Talk to Concierge
              </Link>
            </div>
          </div>

        </div>
      </main>

      <ServiceBookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        serviceName={selectedService || undefined}
      />

      <Footer />
    </SmoothScrollProvider>

  );
}
