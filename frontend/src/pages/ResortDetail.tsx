import { useEffect, useState, lazy, Suspense } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import SmoothScrollProvider from "@/components/layout/smooth-scroll-provider";
import { Star, MapPin, Check, Sparkles, CalendarCheck, Shield, Clock, Compass, ArrowRight } from "lucide-react";
import { apiClient, Resort, Service, getBackendImageUrl, handleImageError } from "@/lib/api";

const VillaExplorer = lazy(() => import("@/components/ui/villa-explorer"));
const ServiceBookingModal = lazy(() => import("@/components/ui/service-booking-modal"));

function VillaExplorerSkeleton() {
  return (
    <div className="w-full h-96 sm:h-120 bg-background/50 rounded-2xl border border-gold/10 p-6 flex items-center justify-center animate-pulse">
      <div className="text-center space-y-3">
        <Sparkles className="w-8 h-8 text-gold/40 mx-auto animate-spin-slow" />
        <span className="text-xs text-foreground/50 uppercase tracking-widest block font-sans">
          Loading Sanctuary Villas...
        </span>
      </div>
    </div>
  );
}

export default function ResortDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [resort, setResort] = useState<Resort | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (slug) {
      apiClient.getResort(slug).then(setResort).catch(console.error);
      apiClient.getServices().then((allSvcs) => {
        const match = allSvcs.filter((s) => s.resort && resort && s.resort === resort.id);
        if (match.length > 0) {
          setServices(match);
        } else {
          const slugMatch = allSvcs.filter((s) => {
            const text = (s.name + " " + s.description).toLowerCase();
            return slug ? text.includes(slug) : false;
          });
          setServices(slugMatch.length > 0 ? slugMatch : allSvcs.slice(0, 3));
        }
      }).catch(console.error);
    }
  }, [slug, resort?.id]);

  const handleOpenBooking = (serviceName: string) => {
    setSelectedService(serviceName);
    setIsModalOpen(true);
  };

  if (!resort) {
    return (
      <SmoothScrollProvider>
        <Header />
        <main className="bg-background min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
        </main>
      </SmoothScrollProvider>
    );
  }

  return (
    <SmoothScrollProvider>
      <Header />
      <main className="bg-background min-h-screen">

        {/* ── Banner Hero ── */}
        <section className="relative h-[50vh] sm:h-[65vh] md:h-[75vh] flex items-end pb-10 sm:pb-16 px-4 sm:px-6 md:px-8 text-white group">
          {resort.image ? (
            <div className="absolute inset-0 z-0 overflow-hidden">
              <img
                src={getBackendImageUrl(resort.image)}
                alt={resort.name}
                className="w-full h-full object-cover opacity-60 absolute inset-0 group-hover:scale-105 transition-transform duration-1000"
                loading="eager"
                onError={handleImageError}
              />
              <div className="absolute inset-0 bg-linear-to-t from-background via-background/40 to-transparent" />
            </div>
          ) : null}

          <div className="relative z-10 max-w-[1600px] mx-auto w-full space-y-2.5 sm:space-y-4">
            <div className="flex items-center gap-2 text-gold text-[9px] sm:text-[10px] uppercase tracking-[0.25em] sm:tracking-[0.3em] font-semibold bg-background/60 backdrop-blur-md px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full w-fit border border-gold/30">
              <MapPin className="w-3 sm:w-3.5 h-3 sm:h-3.5" /> {resort.location}
            </div>
            <h1 className="font-editorial text-3xl sm:text-5xl md:text-8xl text-white tracking-tight leading-tight">{resort.name}</h1>
            <p className="text-white/80 text-xs sm:text-sm md:text-lg max-w-2xl font-sans italic tracking-wide">{resort.tagline}</p>
          </div>
        </section>

        {/* ── Quick Highlights Band ── */}
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 -mt-6 relative z-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-gold/20 rounded-2xl overflow-hidden border border-gold/20 shadow-2xl backdrop-blur-md">
            <div className="bg-background/95 p-3.5 sm:p-6 text-center space-y-1">
              <span className="text-[8.5px] sm:text-[10px] text-foreground/40 uppercase tracking-widest block font-medium">Guest Rating</span>
              <div className="flex items-center justify-center gap-1 sm:gap-1.5">
                <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold fill-gold" />
                <span className="font-editorial text-lg sm:text-2xl text-gold font-semibold">{resort.rating.toFixed(1)} / 5.0</span>
              </div>
            </div>
            <div className="bg-background/95 p-3.5 sm:p-6 text-center space-y-1">
              <span className="text-[8.5px] sm:text-[10px] text-foreground/40 uppercase tracking-widest block font-medium">Estate Seclusion</span>
              <span className="font-editorial text-lg sm:text-2xl text-foreground">&lt; 30 Villas</span>
            </div>
            <div className="bg-background/95 p-3.5 sm:p-6 text-center space-y-1">
              <span className="text-[8.5px] sm:text-[10px] text-foreground/40 uppercase tracking-widest block font-medium">Butler Service</span>
              <span className="font-editorial text-lg sm:text-2xl text-gold">24/7 Dedicated</span>
            </div>
            <div className="bg-background/95 p-3.5 sm:p-6 text-center space-y-1">
              <span className="text-[8.5px] sm:text-[10px] text-foreground/40 uppercase tracking-widest block font-medium">Starting Rate</span>
              <span className="font-editorial text-lg sm:text-2xl text-gold">₹{Number(resort.priceStart).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* ── Content Details ── */}
        <section className="py-12 sm:py-20 px-4 sm:px-6 md:px-8 max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-8 space-y-8 sm:space-y-12">
            <div className="space-y-3 sm:space-y-4">
              <span className="text-gold text-[9.5px] sm:text-[10px] uppercase tracking-[0.28em] block font-semibold">The Sanctuary Experience</span>
              <h2 className="font-editorial text-2xl sm:text-4xl md:text-5xl text-foreground">A Legacy of Pure Isolation</h2>
              <p className="text-foreground/70 text-xs sm:text-sm md:text-base leading-relaxed font-sans">{resort.description}</p>
            </div>

            <div className="border-t border-gold/10 pt-6 sm:pt-10 space-y-4 sm:space-y-6">
              <h3 className="font-editorial text-2xl sm:text-3xl text-foreground">Signature Sanctuary Inclusions</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {resort.inclusions.map((inc, i) => (
                  <li key={i} className="flex items-start gap-3 p-3.5 sm:p-4 rounded-xl bg-background/60 border border-gold/10 text-xs text-foreground/80 leading-relaxed font-sans">
                    <span className="p-1 rounded-lg bg-gold/15 text-gold mt-0.5 shrink-0"><Check className="w-3.5 h-3.5" /></span>
                    {inc}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar Booking Card */}
          <div className="lg:col-span-4 bg-background/90 text-foreground p-5 sm:p-8 md:p-10 rounded-2xl border border-gold/25 shadow-2xl flex flex-col justify-between space-y-6 sm:space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-gold/5 blur-3xl rounded-full pointer-events-none" />
            
            <div className="space-y-4 sm:space-y-6">
              <div className="flex justify-between items-center pb-3.5 sm:pb-4 border-b border-gold/15">
                <span className="text-[9.5px] sm:text-[10px] text-gold tracking-[0.28em] uppercase font-semibold">Sanctuary Rates</span>
                <div className="flex items-center gap-1.5 text-gold">
                  <Star className="w-4 h-4 fill-gold" />
                  <span className="text-xs font-semibold">{resort.rating.toFixed(1)}</span>
                </div>
              </div>

              <div>
                <span className="text-[9.5px] sm:text-[10px] text-foreground/50 uppercase tracking-widest block font-medium">Nightly Rates From</span>
                <h3 className="font-editorial text-2xl sm:text-4xl text-gold font-semibold mt-1">
                  ₹{Number(resort.priceStart).toLocaleString()} <span className="text-xs text-foreground/40 font-sans font-normal">/ night</span>
                </h3>
              </div>

              <div className="space-y-2.5 sm:space-y-3 text-xs text-foreground/70 border-t border-gold/10 pt-4">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-gold shrink-0" />
                  <span>VIP airport transit (Helicopter/Speedboat)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-gold shrink-0" />
                  <span>Personal Butler with 24/7 availability</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-gold shrink-0" />
                  <span>Daily in-villa Champagne breakfast</span>
                </div>
              </div>
            </div>

            <Link
              to={`/book?destination=${slug}`}
              className="w-full text-center py-3.5 sm:py-4 bg-gold hover:bg-gold/90 text-background font-bold text-xs tracking-[0.18em] uppercase rounded-xl transition-all shadow-xl flex items-center justify-center gap-2"
            >
              <span>Reserve Sanctuary</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>

        {/* ── Exclusive Resort Services Section ── */}
        {services.length > 0 && (
          <section className="py-12 sm:py-20 px-4 sm:px-6 md:px-8 border-t border-gold/10 max-w-[1600px] mx-auto space-y-8 sm:space-y-12">
            <div>
              <span className="text-gold text-[9.5px] sm:text-[10px] uppercase tracking-[0.28em] block font-semibold">Curated Immersions</span>
              <h2 className="font-editorial text-2xl sm:text-4xl text-foreground">Signature Experiences at {resort.name}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {services.map((svc) => (
                <div key={svc.id} className="bg-background border border-gold/15 hover:border-gold/40 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 flex flex-col justify-between p-4 sm:p-6 space-y-4">
                  <div className="space-y-3">
                    {svc.image ? (
                      <div className="relative h-44 sm:h-48 w-full rounded-xl overflow-hidden border border-gold/10 mb-2">
                        <img
                          src={getBackendImageUrl(svc.image)}
                          alt={svc.name}
                          className="w-full h-full object-cover absolute inset-0"
                          loading="lazy"
                          onError={handleImageError}
                        />
                      </div>
                    ) : null}
                    <h4 className="font-editorial text-lg sm:text-xl text-foreground font-semibold">{svc.name}</h4>
                    <p className="text-xs text-foreground/65 leading-relaxed font-sans">{svc.description}</p>
                  </div>
                  <button
                    onClick={() => handleOpenBooking(svc.name)}
                    className="w-full py-2.5 sm:py-3 px-4 border border-gold/30 text-gold hover:bg-gold hover:text-background text-[10px] uppercase tracking-widest font-semibold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <CalendarCheck className="w-3.5 h-3.5" /> Book Experience &rarr;
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Villa Showcase section ── */}
        <section className="py-12 sm:py-20 px-4 sm:px-6 md:px-8 border-t border-gold/10 max-w-[1600px] mx-auto space-y-6 sm:space-y-10">
          <div>
            <span className="text-gold text-[9.5px] sm:text-[10px] uppercase tracking-[0.28em] block font-semibold">Accommodations</span>
            <h2 className="font-editorial text-2xl sm:text-4xl text-foreground">Sanctuary Villas &amp; Pavilions</h2>
          </div>
          <Suspense fallback={<VillaExplorerSkeleton />}>
            <VillaExplorer initialResortSlug={resort.slug} />
          </Suspense>
        </section>

      </main>

      <Suspense fallback={null}>
        <ServiceBookingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          serviceName={selectedService || undefined}
          defaultSanctuary={resort.name}
        />
      </Suspense>

      <Footer />
    </SmoothScrollProvider>
  );
}
