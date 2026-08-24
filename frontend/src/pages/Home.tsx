import { apiClient, getBackendImageUrl, useBanner, handleImageError } from "@/lib/api";
import { useEffect, useState, useLayoutEffect, useRef, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import BookingWidget from "@/components/ui/booking-widget";
import { Star, Sparkles, Utensils, Compass, Check, Heart, Award, Shield, Globe, ArrowRight } from "lucide-react";
import gsap from "gsap";

// Lazy load heavy below-fold components to maximize initial page loading speed
const InteractiveGlobe = lazy(() => import("@/components/ui/interactive-globe"));
const VillaExplorer = lazy(() => import("@/components/ui/villa-explorer"));
const JourneyBuilder = lazy(() => import("@/components/ui/journey-builder"));
const ConciergeChat = lazy(() => import("@/components/ui/concierge-chat"));

function GlobeSkeleton() {
  return (
    <div className="w-full h-125 md:h-150 flex flex-col items-center justify-center bg-background text-foreground rounded-2xl border border-gold/10 shadow-2xl relative overflow-hidden">
      <div className="flex flex-col items-center space-y-4 text-center p-6 animate-pulse">
        <Globe className="w-12 h-12 text-gold/40 animate-spin-slow" />
        <h3 className="font-editorial text-2xl text-gold">Initializing Global Sanctuaries Map...</h3>
        <p className="text-xs text-foreground/50 max-w-sm font-sans">Preparing 3D sphere coordinates across islands, peaks, and temples.</p>
      </div>
    </div>
  );
}

function VillaExplorerSkeleton() {
  return (
    <div className="w-full h-96 sm:h-120 bg-background/50 rounded-2xl border border-gold/10 p-6 flex items-center justify-center animate-pulse">
      <div className="text-center space-y-3">
        <Sparkles className="w-8 h-8 text-gold/40 mx-auto animate-spin-slow" />
        <span className="text-xs text-foreground/50 uppercase tracking-widest block font-sans">
          Loading Signature Villa Explorer...
        </span>
      </div>
    </div>
  );
}

function JourneyBuilderSkeleton() {
  return (
    <div className="w-full h-80 sm:h-96 bg-background/50 rounded-2xl border border-gold/10 p-6 flex items-center justify-center animate-pulse">
      <div className="text-center space-y-3">
        <Compass className="w-8 h-8 text-gold/40 mx-auto animate-spin-slow" />
        <span className="text-xs text-foreground/50 uppercase tracking-widest block font-sans">
          Loading Bespoke Journey Builder...
        </span>
      </div>
    </div>
  );
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const heroBanner = useBanner("home_hero", "/images/sandeep_luxury_hero.webp");
  const wellnessBanner = useBanner("home_wellness", "/images/home_wellness.webp");
  const diningBanner = useBanner("home_dining", "/images/home_dining.webp");
  const weddingBanner = useBanner("home_wedding", "/images/home_wedding.webp");

  useLayoutEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    apiClient.getResorts().catch(() => {
      // Non-critical prefetch
    });
  }, []);

  useEffect(() => {
    if (!mounted || !containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(".hero-reveal", {
        y: 80,
        opacity: 0,
        duration: 1.6,
        ease: "power4.out",
        stagger: 0.2
      });
      gsap.from(".hero-sub", {
        opacity: 0,
        duration: 2.0,
        delay: 0.8,
        ease: "power2.out"
      });
      gsap.from(".hero-widget", {
        y: 40,
        opacity: 0,
        duration: 1.2,
        delay: 1.2,
        ease: "power3.out"
      });
    }, containerRef);
    return () => ctx.revert();
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div ref={containerRef}>
      <Header />

      <main className="flex-1 bg-background overflow-hidden">

        {/* SECTION 1: Cinematic Hero */}
        <section className="relative min-h-[92dvh] sm:min-h-screen flex flex-col justify-between pt-24 sm:pt-32 pb-10 sm:pb-16 px-4 sm:px-6 bg-background overflow-hidden">
          {/* Hero Backdrop */}
          {heroBanner.image ? (
            <div className="absolute inset-0 z-0 overflow-hidden">
              <img
                src={heroBanner.image}
                alt={heroBanner.title || "Ultra Luxury Resort Hero Sunset"}
                loading="eager"
                className="w-full h-full object-cover opacity-85 scale-105 filter contrast-105 saturate-105"
                onError={handleImageError}
              />
              <div className="absolute inset-0 bg-linear-to-b from-slate-950/75 via-slate-950/35 to-background" />
            </div>
          ) : null}

          {/* Ambient Lighting Accents */}
          <div className="ambient-glow-gold top-1/4 left-1/2 -translate-x-1/2 opacity-60 pointer-events-none" />
          <div className="ambient-glow-teal bottom-10 right-10 opacity-30 pointer-events-none" />

          {/* Main Hero Copy */}
          <div className="relative z-10 max-w-300 mx-auto w-full my-auto flex flex-col items-center text-center px-2 sm:px-6">
            <span className="hero-sub text-gold tracking-[0.2em] sm:tracking-[0.3em] text-[9px] sm:text-[10px] uppercase mb-4 sm:mb-8 inline-flex items-center justify-center gap-1.5 sm:gap-2 font-bold px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full border border-gold/40 bg-background/60 backdrop-blur-md shadow-xl">
              <Award className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gold animate-pulse shrink-0" /> WORLD'S #1 LUXURY SANCTUARY COLLECTION 2026
            </span>
            <h1 className="font-editorial text-4xl sm:text-6xl md:text-8xl lg:text-9xl text-foreground leading-[0.95] sm:leading-[0.9] tracking-tighter mb-6 sm:mb-10">
              <span className="hero-reveal block font-light">Enter a World of</span>
              <span className="hero-reveal block text-gold-shimmer font-bold drop-shadow-2xl">Pure Serenity</span>
            </h1>
            <p className="hero-sub text-foreground/90 text-xs sm:text-sm md:text-base max-w-xl leading-relaxed tracking-wider font-sans mb-6 sm:mb-10">
              Experience hand-crafted architecture merging seamlessly into natural horizons across islands, peaks, and ancient shrines.
            </p>
          </div>

          {/* Floating Booking Widget */}
          <div className="hero-widget relative z-10 w-full max-w-5xl mx-auto px-0 sm:px-4">
            <BookingWidget />
          </div>
        </section>


        {/* SECTION 2: Brand Manifesto */}
        <section className="py-16 sm:py-24 md:py-32 px-4 sm:px-8 bg-background">
          <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-10">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-gold mx-auto" />
            <span className="text-gold tracking-[0.25em] sm:tracking-[0.3em] text-[9.5px] sm:text-[10px] uppercase block font-semibold">The Sandeep Philosophy</span>
            <h2 className="font-editorial text-2xl sm:text-4xl md:text-6xl text-foreground leading-[1.15] sm:leading-[1.1]">
              &quot;We do not build resorts. We restore the spaces between the earth, the sky, and the human spirit.&quot;
            </h2>
            <div className="w-16 sm:w-24 h-px bg-gold/30 mx-auto" />
            <p className="text-foreground/70 text-xs sm:text-sm md:text-base leading-relaxed max-w-2xl mx-auto font-sans tracking-[0.02em]">
              Founded on the pillars of silence, isolation, and spatial integrity, our sanctuaries represent a global footprint of ultra-luxury. We provide spaces designed to let you disconnect, rejuvenate, and experience curated, immersive storytelling.
            </p>
          </div>
        </section>


        {/* SECTION 3: Global Destinations Map */}
        <section className="py-16 sm:py-24 md:py-28 px-4 sm:px-8 bg-background text-foreground border-t border-gold/10">
          <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-4 space-y-5 sm:space-y-8">
              <span className="text-gold tracking-[0.25em] sm:tracking-[0.3em] text-[9.5px] sm:text-[10px] uppercase block font-semibold">Resort Discovery</span>
              <h2 className="font-editorial text-2xl sm:text-4xl md:text-5xl text-foreground">Explore Our Global Sanctuaries</h2>
              <p className="text-foreground/60 text-xs sm:text-sm leading-relaxed font-sans tracking-[0.02em]">
                Each Sandeep destination is a custom masterpiece built to honor the geography and heritage of its environment. Use our interactive Three.js globe to map coordinates across islands, peaks, and temples.
              </p>
              <div className="pt-1 sm:pt-2">
                <Link
                  to="/resorts"
                  className="px-6 sm:px-8 py-3 sm:py-3.5 bg-gold hover:bg-gold/90 text-background font-bold text-xs tracking-[0.18em] uppercase rounded-xl transition-all shadow-lg inline-flex items-center gap-2"
                >
                  <span>View Collections</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-8">
              <Suspense fallback={<GlobeSkeleton />}>
                <InteractiveGlobe />
              </Suspense>
            </div>
          </div>
        </section>


        {/* SECTION 4: Signature Villas */}
        <section className="py-16 sm:py-24 md:py-32 px-4 sm:px-8 bg-background">
          <div className="max-w-[1600px] mx-auto space-y-10 sm:space-y-16">
            <div className="text-center max-w-2xl mx-auto space-y-3 sm:space-y-4">
              <span className="text-gold tracking-[0.25em] sm:tracking-[0.3em] text-[9.5px] sm:text-[10px] uppercase block font-semibold">Architectural Mastery</span>
              <h2 className="font-editorial text-3xl sm:text-4xl md:text-6xl text-foreground">The Signature Villas</h2>
              <p className="text-foreground/70 text-xs sm:text-sm leading-relaxed font-sans tracking-[0.02em]">
                Step inside our award-winning villa collection. Interact with floor plans, room configurations, and experience 360-degree panoramas.
              </p>
            </div>
            <Suspense fallback={<VillaExplorerSkeleton />}>
              <VillaExplorer />
            </Suspense>
          </div>
        </section>


        {/* SECTION 5: Wellness Retreats */}
        <section className="py-16 sm:py-24 md:py-32 px-4 sm:px-8 bg-background border-t border-gold/10 transition-colors duration-500">
          <div className="max-w-[1600px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-14 lg:gap-20 items-center mb-12 sm:mb-20">

              <div className="space-y-5 sm:space-y-8">
                <span className="text-gold tracking-[0.3em] sm:tracking-[0.4em] text-[9.5px] sm:text-[10px] uppercase font-semibold block">The Wellness Platform</span>
                <h2 className="font-editorial text-3xl sm:text-5xl md:text-7xl text-foreground leading-none sm:leading-[0.9]">Personalized Spa &amp; Yoga Journeys</h2>
                <p className="text-foreground/70 text-xs sm:text-sm leading-relaxed font-sans tracking-[0.02em]">
                  Escape the clutter of noise with our bespoke spa programs. Our retreats are staffed by Ayurveda masters, meditation practitioners, and physical therapists. We curate nutrition plans, aromatherapy, and crystal energy rituals.
                </p>

                <div className="pt-2 sm:pt-4 flex flex-wrap gap-5 sm:gap-8">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold shrink-0">
                      <Compass className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <h4 className="font-sans font-semibold text-xs text-foreground tracking-wider uppercase">Ayurvedic Cleansing</h4>
                      <p className="text-[10.5px] sm:text-[11px] text-foreground/50 leading-relaxed font-sans mt-0.5">Deep cellular detoxification.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold shrink-0">
                      <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <h4 className="font-sans font-semibold text-xs text-foreground tracking-wider uppercase">Sound Healing</h4>
                      <p className="text-[10.5px] sm:text-[11px] text-foreground/50 leading-relaxed font-sans mt-0.5">Tibetan bowl soundscapes.</p>
                    </div>
                  </div>
                </div>
              </div>

              {wellnessBanner.image ? (
                <div className="relative aspect-4/3 w-full overflow-hidden border border-gold/20 rounded-2xl shadow-2xl">
                  <img
                    src={wellnessBanner.image}
                    alt={wellnessBanner.title || "Overwater Spa Hydrotherapy Sanctuary"}
                    loading="lazy"
                    className="w-full h-full object-cover absolute inset-0"
                    onError={handleImageError}
                  />
                </div>
              ) : null}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              <div className="bg-background/80 border border-gold/20 p-6 sm:p-8 md:p-10 hover:border-gold/50 transition-all duration-500 rounded-2xl shadow-lg flex flex-col justify-between">
                <div>
                  <span className="text-[9px] uppercase tracking-[0.3em] text-gold font-semibold">3-Day Retreat</span>
                  <h4 className="font-editorial text-2xl sm:text-3xl text-foreground mt-2 sm:mt-3 mb-2 sm:mb-3">Silent Sanctum</h4>
                  <p className="text-foreground/60 text-xs leading-relaxed font-sans mb-6 sm:mb-8">Comprehensive digital detox, holistic body massages, and private herbal steam therapy.</p>
                </div>
                <Link to="/wellness" className="text-xs text-gold uppercase tracking-[0.2em] font-semibold hover:underline inline-flex items-center gap-1.5">
                  <span>Explore Programme</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="bg-background/80 border border-gold/20 p-6 sm:p-8 md:p-10 hover:border-gold/50 transition-all duration-500 rounded-2xl shadow-lg flex flex-col justify-between">
                <div>
                  <span className="text-[9px] uppercase tracking-[0.3em] text-gold font-semibold">5-Day Retreat</span>
                  <h4 className="font-editorial text-2xl sm:text-3xl text-foreground mt-2 sm:mt-3 mb-2 sm:mb-3">Rejuvenation Journey</h4>
                  <p className="text-foreground/60 text-xs leading-relaxed font-sans mb-6 sm:mb-8">Ayurvedic consults, crystal sound therapy, personalized physical therapy, and daily spa therapies.</p>
                </div>
                <Link to="/wellness" className="text-xs text-gold uppercase tracking-[0.2em] font-semibold hover:underline inline-flex items-center gap-1.5">
                  <span>Explore Programme</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>


        {/* SECTION 6: Michelin Culinary Experiences */}
        <section className="py-16 sm:py-24 md:py-32 px-4 sm:px-8 bg-background">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 items-center">

            {/* Visual element */}
            {diningBanner.image ? (
              <div className="lg:col-span-6 relative aspect-square rounded-2xl overflow-hidden border border-gold/15 shadow-2xl">
                <img
                  src={diningBanner.image}
                  className="w-full h-full object-cover absolute inset-0"
                  alt={diningBanner.title || "Intimate cliffside dining table under stars"}
                  loading="lazy"
                  onError={handleImageError}
                />
                <div className="absolute inset-0 bg-linear-to-t from-background/90 via-background/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 z-10 p-4 sm:p-6 rounded-xl border border-gold/25 bg-background/80 backdrop-blur-md text-foreground shadow-xl">
                  <Utensils className="w-4 h-4 sm:w-5 sm:h-5 text-gold mb-1.5 sm:mb-2" />
                  <h4 className="font-editorial text-lg sm:text-xl text-foreground">Destination Private Dining</h4>
                  <p className="text-[11px] sm:text-xs text-foreground/70 font-sans mt-1">Candlelit cliffside dining, private sommelier pairings, and barefoot beach banquets.</p>
                </div>
              </div>
            ) : null}

            {/* Content Details */}
            <div className="lg:col-span-6 space-y-4 sm:space-y-6">
              <span className="text-gold tracking-[0.25em] sm:tracking-[0.28em] text-[9.5px] sm:text-[10px] uppercase block font-semibold">Culinary Pleasures</span>
              <h2 className="font-editorial text-3xl sm:text-4xl md:text-5xl text-foreground">Fine Dining Masterpieces</h2>
              <p className="text-foreground/70 text-xs sm:text-sm leading-relaxed font-sans">
                Each sanctuary presents Michelin-grade gastronomy under the direction of international culinary masters. Our tables are carefully arranged to offer ultimate acoustic isolation and panoramic vantage views.
              </p>
              <ul className="space-y-2.5 sm:space-y-3 text-xs text-foreground/80 font-sans">
                <li className="flex items-center gap-2.5"><Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold shrink-0" /> Organic estate gardens supplying local botanicals</li>
                <li className="flex items-center gap-2.5"><Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold shrink-0" /> Custom pairings supervised by master sommeliers</li>
                <li className="flex items-center gap-2.5"><Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold shrink-0" /> Private chef table degustations in your villa quarters</li>
              </ul>
              <div className="pt-2">
                <Link to="/dining" className="px-6 sm:px-8 py-3 sm:py-3.5 bg-gold hover:bg-gold/90 text-background font-bold text-xs tracking-[0.18em] uppercase rounded-xl transition-all shadow-lg inline-flex items-center gap-2">
                  <span>Reserve Destination Table</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

          </div>
        </section>


        {/* SECTION 7: Luxury Journey Builder */}
        <section className="py-16 sm:py-20 md:py-28 px-4 sm:px-8 bg-background border-t border-b border-gold/15">
          <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12">
            <div className="text-center max-w-xl mx-auto space-y-2 sm:space-y-3">
              <span className="text-gold tracking-[0.25em] sm:tracking-[0.28em] text-[9.5px] sm:text-[10px] uppercase block font-semibold">Design Your Stay</span>
              <h2 className="font-editorial text-3xl sm:text-4xl md:text-5xl text-foreground font-medium">Curate Your Bespoke Journey</h2>
              <p className="text-foreground/70 text-xs sm:text-sm leading-relaxed font-sans">
                Use our automated experience coordinator to build your luxury vacation. Pick a destination, choose villas, and bundle spa journeys or sunset cruises.
              </p>
            </div>
            <Suspense fallback={<JourneyBuilderSkeleton />}>
              <JourneyBuilder />
            </Suspense>
          </div>
        </section>


        {/* SECTION 8: Weddings & Celebrations */}
        <section className="py-16 sm:py-24 md:py-32 px-4 sm:px-8 bg-background">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 items-center">

            {/* Visual Photo Card */}
            {weddingBanner.image ? (
              <div className="lg:col-span-6 relative aspect-4/3 rounded-2xl overflow-hidden border border-gold/15 shadow-2xl">
                <img
                  src={weddingBanner.image}
                  alt={weddingBanner.title || "Luxury Oceanfront Wedding Altar"}
                  className="w-full h-full object-cover absolute inset-0"
                  loading="lazy"
                  onError={handleImageError}
                />
                <div className="absolute inset-0 bg-linear-to-t from-background/80 via-transparent to-transparent flex items-end p-5 sm:p-8">
                  <span className="text-gold text-[11px] sm:text-xs uppercase tracking-widest font-semibold font-sans">Maldives Oceanfront Altar</span>
                </div>
              </div>
            ) : null}

            <div className="lg:col-span-6 space-y-4 sm:space-y-6">
              <span className="text-gold tracking-[0.25em] sm:tracking-[0.28em] text-[9.5px] sm:text-[10px] uppercase block font-semibold">Bespoke Gatherings</span>
              <h2 className="font-editorial text-3xl sm:text-4xl md:text-5xl text-foreground">Exclusive Weddings &amp; Ceremonies</h2>
              <p className="text-foreground/70 text-xs sm:text-sm leading-relaxed font-sans">
                Exchange vows on private Maldivian sandbanks, amidst ancient Balinese jungle shrines, or inside majestic Rajasthani desert fortresses. We design complete packages including charter flights, gourmet caterers, and luxury decorations.
              </p>
              <div className="pt-2">
                <Link to="/weddings" className="px-6 sm:px-8 py-3 sm:py-3.5 bg-gold hover:bg-gold/90 text-background font-bold text-xs tracking-[0.18em] uppercase rounded-xl transition-all shadow-lg inline-flex items-center gap-2">
                  <span>Inquire About Event Spaces</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

          </div>
        </section>


        {/* SECTION 9: Membership Club */}
        <section className="py-16 sm:py-24 px-4 sm:px-8 bg-background text-foreground border-t border-gold/10">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-16 items-center">
            <div className="space-y-4 sm:space-y-6">
              <span className="text-gold tracking-[0.25em] sm:tracking-[0.28em] text-[9.5px] sm:text-[10px] uppercase block font-semibold">The Membership Club</span>
              <h2 className="font-editorial text-3xl sm:text-4xl md:text-5xl">VIP Sandeep Club</h2>
              <p className="text-foreground/70 text-xs sm:text-sm leading-relaxed font-sans">
                Join our private guest tier to unlock prioritized benefits: automatic suite upgrades on availability, direct private jet logistics, 24/7 personal concierges, and unique access to global dining takeovers.
              </p>
              <div className="grid grid-cols-3 gap-2 sm:gap-3 border-t border-gold/10 pt-4 sm:pt-6">
                <div>
                  <h4 className="text-gold font-editorial text-lg sm:text-2xl font-bold">Silver</h4>
                  <p className="text-[8.5px] sm:text-[9px] text-foreground/50 uppercase mt-0.5 sm:mt-1">Priority Booking</p>
                </div>
                <div>
                  <h4 className="text-gold font-editorial text-lg sm:text-2xl font-bold">Gold</h4>
                  <p className="text-[8.5px] sm:text-[9px] text-foreground/50 uppercase mt-0.5 sm:mt-1">Suite Upgrades</p>
                </div>
                <div>
                  <h4 className="text-gold font-editorial text-lg sm:text-2xl font-bold">Royal Diamond</h4>
                  <p className="text-[8.5px] sm:text-[9px] text-foreground/50 uppercase mt-0.5 sm:mt-1">Private Jet Charter</p>
                </div>
              </div>
              <div className="pt-2 sm:pt-4">
                <Link to="/membership" className="px-6 sm:px-8 py-3 sm:py-3.5 bg-gold hover:bg-gold/90 text-background font-bold text-xs tracking-[0.18em] uppercase rounded-xl transition-all shadow-lg inline-flex items-center gap-2">
                  <span>Apply for Club Entry</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Visual Membership Card mockup */}
            <div className="glass-panel p-6 sm:p-10 md:p-12 border border-gold/40 rounded-3xl aspect-auto sm:aspect-[1.6/1] w-full max-w-xl mx-auto flex flex-col justify-between shadow-2xl relative overflow-hidden bg-linear-to-br from-navy/95 via-background to-navy/90 hover:border-gold/70 transition-all duration-700 group space-y-6 sm:space-y-0">
              <div className="absolute top-0 right-0 w-48 h-48 bg-gold/10 blur-3xl rounded-full group-hover:bg-gold/20 transition-all duration-700" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gold/10 blur-2xl rounded-full" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--color-gold)_0%,transparent_70%)] opacity-10 pointer-events-none" />

              <div className="flex justify-between items-start relative z-10">
                <div className="space-y-1">
                  <span className="text-gold text-xs sm:text-sm uppercase tracking-[0.25em] sm:tracking-[0.3em] font-semibold block">Sandeep Luxury Resorts</span>
                  <span className="text-foreground/60 text-[8.5px] sm:text-[9px] font-sans tracking-widest block uppercase">Global Passport VIP System</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-9 h-6 sm:w-10 sm:h-7 rounded-md bg-linear-to-r from-gold/60 via-amber-200 to-gold/80 border border-gold/40 flex items-center justify-center shadow-md">
                    <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-background" />
                  </div>
                </div>
              </div>

              <div className="relative z-10 py-3 sm:py-6">
                <span className="text-foreground text-base sm:text-xl md:text-2xl tracking-[0.25em] sm:tracking-[0.35em] font-mono block font-bold text-shadow-md">
                  8890 •••• •••• 8899
                </span>
                <span className="text-[8.5px] sm:text-[9px] text-gold/80 uppercase tracking-widest block mt-1 font-mono">
                  VALID WORLDWIDE • SANCTUARY LEVEL 01
                </span>
              </div>

              <div className="flex justify-between items-end relative z-10 pt-3 sm:pt-4 border-t border-gold/20">
                <div>
                  <span className="text-[8.5px] sm:text-[9px] text-foreground/50 uppercase tracking-widest block mb-0.5">Cardholder</span>
                  <span className="text-foreground text-xs sm:text-sm md:text-base uppercase font-sans font-semibold tracking-wider block">
                    LORD SANDEEP
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[8.5px] sm:text-[9px] text-foreground/50 uppercase tracking-widest block mb-0.5">Membership Tier</span>
                  <span className="text-gold font-editorial text-sm sm:text-base md:text-xl italic font-semibold block">
                    Royal Diamond
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* SECTION 10: Sustainability */}
        <section className="py-16 sm:py-24 px-4 sm:px-8 bg-background">
          <div className="max-w-4xl mx-auto text-center space-y-4 sm:space-y-6">
            <span className="text-gold tracking-[0.25em] sm:tracking-[0.28em] text-[9.5px] sm:text-[10px] uppercase block font-semibold">Ecological Integrity</span>
            <h2 className="font-editorial text-2xl sm:text-3xl md:text-5xl text-foreground">Zero Carbon Luxury</h2>
            <p className="text-foreground/70 text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto font-sans">
              All Sandeep resorts are engineered to operate with zero single-use plastics, passive solar heating, local greywater recycling systems, and carbon offsetting programs. We believe luxury is unsustainable unless it honors the ecology of our hosts.
            </p>
            <div className="pt-2">
              <Link to="/sustainability" className="text-gold text-xs font-semibold hover:underline inline-flex items-center gap-1.5 uppercase tracking-widest">
                <span>Read our Ecological Promise</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>


        {/* SECTION 11: Testimonials */}
        <section className="py-14 sm:py-20 bg-background text-foreground text-center px-4 sm:px-8">
          <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6">
            <div className="flex justify-center gap-1 text-gold">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />)}
            </div>
            <p className="font-editorial text-lg sm:text-2xl md:text-3xl text-foreground/90 leading-relaxed italic">
              &quot;The sense of isolation at Sandeep Maldives is absolute. I sat on my private overwater hammock at midnight, surrounded by silence, stars, and bioluminescent waves. It is truly a transformational haven.&quot;
            </p>
            <div>
              <span className="text-gold text-xs font-semibold uppercase tracking-wider block">Lady Elizabeth V.</span>
              <span className="text-[10px] text-foreground/50 block font-mono mt-0.5">Stayed Winter 2025</span>
            </div>
          </div>
        </section>


        {/* SECTION 12: Press & Awards */}
        <section className="py-12 sm:py-16 px-4 sm:px-8 bg-background border-t border-gold/15">
          <div className="max-w-7xl mx-auto flex flex-wrap justify-center items-center gap-6 sm:gap-12 md:gap-24 opacity-60">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 sm:w-5 sm:h-5 text-gold shrink-0" />
              <span className="font-editorial text-xs sm:text-sm tracking-wider uppercase text-foreground">Awwwards 2025 Winner</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-gold shrink-0" />
              <span className="font-editorial text-xs sm:text-sm tracking-wider uppercase text-foreground">Condé Nast Gold List</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-gold shrink-0" />
              <span className="font-editorial text-xs sm:text-sm tracking-wider uppercase text-foreground">Luxury Hotel Guild</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-gold shrink-0" />
              <span className="font-editorial text-xs sm:text-sm tracking-wider uppercase text-foreground">Michelin Key 2026</span>
            </div>
          </div>
        </section>

      </main>
      <Suspense fallback={null}>
        <ConciergeChat />
      </Suspense>

      <Footer />
    </div>
  );
}
