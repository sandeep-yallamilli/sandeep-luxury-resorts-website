import { useEffect, useState } from "react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import SmoothScrollProvider from "@/components/layout/smooth-scroll-provider";
import ServiceBookingModal from "@/components/ui/service-booking-modal";
import { Sparkles, Heart, Flame, Shield, Flower, Sun, Droplet, Smile, CalendarCheck, Leaf, Brain, ArrowRight } from "lucide-react";
import { apiClient, Service, getBackendImageUrl, useBanner, handleImageError } from "@/lib/api";
import { Link } from "react-router-dom";

const ICONS = [Sparkles, Heart, Flame, Shield, Flower, Sun, Droplet, Smile];

const PILLARS = [
  {
    icon: Brain,
    title: "Ancient Wisdom",
    desc: "Therapies rooted in 5,000 years of Ayurvedic, Japanese Onsen, and Balinese healing traditions.",
  },
  {
    icon: Leaf,
    title: "Natural Ingredients",
    desc: "Every treatment uses estate-grown botanicals, volcanic minerals, and sustainably sourced essential oils.",
  },
  {
    icon: Sparkles,
    title: "Master Practitioners",
    desc: "Our therapists are certified masters with a minimum of 10 years of clinical and holistic practice.",
  },
];

function getServiceImage(service: Service): string {
  return service.image ? getBackendImageUrl(service.image) : "";
}

export default function Wellness() {
  const [wellnessServices, setWellnessServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const heroBanner = useBanner("wellness_hero", "/images/wellness_hero.webp");

  useEffect(() => {
    async function loadWellnessServices() {
      setLoading(true);
      try {
        const data = await apiClient.getServices("wellness");
        setWellnessServices(data);
      } catch (err) {
        console.error("Failed to load wellness services:", err);
      } finally {
        setLoading(false);
      }
    }
    loadWellnessServices();
  }, []);

  const handleOpenBooking = (serviceName: string) => {
    setSelectedService(serviceName);
    setIsModalOpen(true);
  };

  return (
    <SmoothScrollProvider>
      <Header />
      <main className="bg-background min-h-screen pt-24 sm:pt-32 pb-16 sm:pb-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-14 sm:space-y-20">

          {/* ── Page Header ── */}
          <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-5">
            <span className="text-gold tracking-[0.25em] sm:tracking-[0.28em] text-[9.5px] sm:text-[10px] uppercase font-semibold block">
              Holistic Sanctuaries
            </span>
            <h1 className="font-editorial text-3xl sm:text-4xl md:text-6xl text-foreground leading-tight">
              Personalised Wellness<br className="hidden md:block" /> Platform
            </h1>
            <p className="text-foreground/60 text-xs sm:text-sm leading-relaxed font-sans">
              Our spas integrate historical therapies with modern physiology. Restore energetic balance,
              detoxify your body, or find absolute calm under the guidance of our resident masters.
            </p>
          </div>

          {/* ── Hero Banner ── */}
          {heroBanner.image ? (
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gold/20 h-72 sm:h-105 md:h-130 group">
              <img
                src={heroBanner.image}
                alt={heroBanner.title || "Luxury Overwater Spa Therapy Sanctuary"}
                className="w-full h-full object-cover absolute inset-0 group-hover:scale-[1.03] transition-transform duration-700"
                loading="lazy"
                onError={handleImageError}
              />
              <div className="absolute inset-0 bg-linear-to-t from-background via-background/20 to-transparent" />
              <div className="absolute bottom-5 left-5 sm:bottom-8 sm:left-8 md:left-14 space-y-1.5 sm:space-y-2">
                <span className="text-gold text-[9px] sm:text-[10px] uppercase tracking-[0.25em] font-semibold block">
                  Overwater Sanctuary Spa
                </span>
                <h2 className="font-editorial text-2xl sm:text-3xl md:text-4xl text-foreground">
                  Hydrotherapy &amp; Mineral Oil Purification
                </h2>
                <p className="text-foreground/50 text-xs font-sans max-w-sm">
                  World-class therapies performed in open-air pavilions suspended above the Indian Ocean.
                </p>
              </div>
            </div>
          ) : null}

          {/* ── Wellness Philosophy Pillars ── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
            {PILLARS.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="group p-5 sm:p-6 bg-background/60 border border-gold/10 hover:border-gold/30 rounded-2xl transition-all duration-300 hover:shadow-lg space-y-2.5 sm:space-y-3 text-center"
              >
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto group-hover:bg-gold/15 transition-colors">
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-gold" />
                </div>
                <h3 className="font-editorial text-base sm:text-lg text-foreground">{title}</h3>
                <p className="text-xs text-foreground/55 leading-relaxed font-sans">{desc}</p>
              </div>
            ))}
          </div>

          {/* ── Services Section ── */}
          <section>
            <div className="text-center mb-8 sm:mb-10 space-y-2.5 sm:space-y-3">
              <span className="text-gold tracking-[0.25em] text-[9.5px] sm:text-[10px] uppercase font-semibold block">
                Curated Experiences
              </span>
              <h2 className="font-editorial text-2xl sm:text-3xl md:text-4xl text-foreground">
                Signature Wellness Offerings
              </h2>
              {!loading && (
                <span className="text-xs text-foreground/40 font-mono">
                  {wellnessServices.length} Wellness Treatments Available
                </span>
              )}
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-background border border-gold/10 rounded-xl overflow-hidden p-5 sm:p-6 space-y-4 animate-pulse">
                    <div className="h-36 sm:h-44 bg-gold/10 rounded-lg w-full mb-4" />
                    <div className="w-6 h-6 bg-gold/20 rounded" />
                    <div className="h-6 bg-foreground/10 rounded w-3/4" />
                    <div className="space-y-2">
                      <div className="h-3 bg-foreground/10 rounded" />
                      <div className="h-3 bg-foreground/10 rounded w-5/6" />
                    </div>
                  </div>
                ))}
              </div>
            ) : wellnessServices.length === 0 ? (
              <div className="text-center py-12 sm:py-16 border border-dashed border-gold/20 rounded-xl">
                <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-gold/40 mx-auto mb-4" />
                <p className="text-foreground/50 text-xs sm:text-sm font-sans">Wellness services are being curated. Please check back soon.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {wellnessServices.map((service, i) => {
                  const Icon = ICONS[i % ICONS.length];
                  const imgSrc = getServiceImage(service);
                  return (
                    <div
                      key={service.id}
                      className="group bg-background text-foreground overflow-hidden rounded-xl border border-gold/15 hover:border-gold/50 transition-all duration-500 flex flex-col shadow-lg hover:shadow-xl"
                    >
                      <div className="relative h-44 sm:h-52 w-full overflow-hidden border-b border-gold/10">
                        {imgSrc ? (
                          <img
                            src={getBackendImageUrl(imgSrc)}
                            alt={service.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 absolute inset-0"
                            loading="lazy"
                            onError={handleImageError}
                          />
                        ) : null}
                        <div className="absolute inset-0 bg-linear-to-t from-background/90 via-transparent to-transparent opacity-80" />
                        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-background/80 backdrop-blur-md border border-gold/30 flex items-center justify-center shadow-lg">
                          <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold" />
                        </div>
                      </div>
                      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-3 sm:space-y-4">
                        <div className="space-y-1.5 sm:space-y-2">
                          <h3 className="font-editorial text-lg sm:text-xl text-foreground font-semibold">{service.name}</h3>
                          <p className="text-xs text-foreground/65 leading-relaxed font-sans">{service.description}</p>
                        </div>
                        <button
                          onClick={() => handleOpenBooking(service.name)}
                          className="w-full py-2.5 px-4 border border-gold/40 text-gold hover:bg-gold hover:text-background text-[10px] uppercase tracking-widest font-semibold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
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
              Begin Your Healing
            </span>
            <h2 className="font-editorial text-2xl sm:text-3xl md:text-5xl text-foreground relative z-10">
              Begin Your Wellness Journey
            </h2>
            <p className="text-foreground/50 text-xs sm:text-sm font-sans max-w-xl mx-auto relative z-10">
              Reserve your sanctuary and unlock a personalised wellness programme curated
              by our master practitioners — delivered before you arrive.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 relative z-10">
              <button
                onClick={() => handleOpenBooking("Custom Wellness Programme")}
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 bg-gold hover:bg-gold/90 text-background font-bold text-xs tracking-[0.15em] uppercase rounded-lg transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer"
              >
                Reserve Sanctuary Experience <ArrowRight className="w-3.5 h-3.5" />
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
