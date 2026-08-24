import { lazy, Suspense } from "react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import SmoothScrollProvider from "@/components/layout/smooth-scroll-provider";
import { useBanner, handleImageError } from "@/lib/api";
import { Link } from "react-router-dom";
import {
  Users, Maximize2, Waves, ChefHat, ConciergeBell,
  BedDouble, Sparkles, ShieldCheck, Star, ArrowRight,
} from "lucide-react";

const VillaExplorer = lazy(() => import("@/components/ui/villa-explorer"));

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

/* ── Inclusion cards ── */
const INCLUSIONS = [
  {
    icon: ConciergeBell,
    title: "24 / 7 Butler Service",
    desc: "A dedicated personal butler coordinates every detail — from private dining reservations to bespoke excursions — around the clock.",
  },
  {
    icon: Waves,
    title: "Private Soundproof Pools",
    desc: "Infinity pools with acoustic-absorption walls deliver complete audio isolation while your horizon stretches to open sea or mountain range.",
  },
  {
    icon: BedDouble,
    title: "Bespoke Bedding Charter",
    desc: "Pre-configure pillow firmness, linen thread counts, and ambient bedroom scents through our AI Concierge before you land.",
  },
  {
    icon: ChefHat,
    title: "In-Villa Private Chef",
    desc: "A Michelin-trained chef curates each meal using hyper-local, seasonal produce — served exactly when and where you desire.",
  },
  {
    icon: ShieldCheck,
    title: "Full Privacy Guarantee",
    desc: "No shared facilities, no crowded lobbies. Every estate caps occupancy to ensure absolute seclusion for every guest.",
  },
  {
    icon: Sparkles,
    title: "Turndown Ritual",
    desc: "Each evening our team restores your villa with fresh botanicals, curated scent diffusion, and personalised amenity curation.",
  },
];

/* ── Stats ── */
const STATS = [
  { value: "82", label: "Private Villas" },
  { value: "5", label: "Global Sanctuaries" },
  { value: "<30", label: "Villas per Estate" },
  { value: "5★", label: "Guest Rating" },
];

export default function Villas() {
  const heroBanner = useBanner("villas_hero", "/images/villas_hero.webp");

  return (
    <SmoothScrollProvider>
      <Header />
      <main className="bg-background min-h-screen pt-24 sm:pt-32 pb-16 sm:pb-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-14 sm:space-y-20">

          {/* ── Page Header ── */}
          <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-5">
            <span className="text-gold tracking-[0.25em] sm:tracking-[0.28em] text-[9.5px] sm:text-[10px] uppercase font-semibold block">
              Architectural Portfolios
            </span>
            <h1 className="font-editorial text-3xl sm:text-4xl md:text-6xl text-foreground leading-tight">
              Signature Villa<br className="hidden md:block" /> Collection
            </h1>
            <p className="text-foreground/60 text-xs sm:text-sm leading-relaxed font-sans max-w-2xl mx-auto">
              Crafted with local materials, minimalist styling, and zero ecological impact frameworks.
              Each villa is a private world — not a room within one.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-1 sm:pt-2">
              <Link
                to="/book"
                className="px-5 sm:px-6 py-2.5 sm:py-3 bg-gold hover:bg-gold/90 text-background font-bold text-xs tracking-[0.15em] uppercase rounded-lg transition-all shadow-lg shadow-gold/20 flex items-center gap-2"
              >
                Reserve a Villa <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <a
                href="#explorer"
                className="px-5 sm:px-6 py-2.5 sm:py-3 border border-gold/30 hover:border-gold text-foreground/70 hover:text-gold text-xs tracking-widest uppercase rounded-lg transition-all"
              >
                Explore All
              </a>
            </div>
          </div>

          {/* ── Hero Banner ── */}
          {heroBanner.image ? (
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gold/20 h-72 sm:h-105 md:h-130 group">
              <img
                src={heroBanner.image}
                alt={heroBanner.title || "Signature Villa Collection Portfolio"}
                className="w-full h-full object-cover object-[center_10%] absolute inset-0 group-hover:scale-[1.03] transition-transform duration-700"
                loading="lazy"
                onError={handleImageError}
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-background via-background/20 to-transparent" />

              {/* Overlay content */}
              <div className="absolute inset-0 flex items-end p-5 sm:p-8 md:p-14">
                <div className="space-y-1.5 sm:space-y-2">
                  <span className="text-gold text-[9px] sm:text-[10px] uppercase tracking-[0.25em] block font-semibold">
                    Architectural Mastery
                  </span>
                  <h2 className="font-editorial text-2xl sm:text-3xl md:text-4xl text-foreground">
                    The Signature Villa Portfolio
                  </h2>
                  <p className="text-foreground/50 text-xs font-sans max-w-md">
                    Floor-to-ceiling glass. Native stone. Open-sky infinity pools. Architecture that never competes with nature.
                  </p>
                </div>
              </div>

              {/* Corner badge */}
              <div className="absolute top-4 right-4 sm:top-6 sm:right-6 px-3 sm:px-4 py-1.5 sm:py-2 bg-background/70 backdrop-blur-sm border border-gold/20 rounded-xl flex items-center gap-1.5 sm:gap-2">
                <Star className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-gold fill-gold" />
                <span className="text-[9px] sm:text-[10px] text-gold uppercase tracking-widest font-semibold">Ultra Luxury</span>
              </div>
            </div>
          ) : null}

          {/* ── Stats Band ── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-gold/10 rounded-2xl overflow-hidden border border-gold/10">
            {STATS.map(({ value, label }) => (
              <div
                key={label}
                className="bg-background/80 px-3 sm:px-6 py-5 sm:py-8 text-center space-y-1 hover:bg-background transition-colors"
              >
                <span className="font-editorial text-2xl sm:text-4xl text-gold block">{value}</span>
                <span className="text-[8px] sm:text-[9px] uppercase tracking-widest text-foreground/40 font-medium">{label}</span>
              </div>
            ))}
          </div>

          {/* ── Villa Explorer ── */}
          <div id="explorer" className="scroll-mt-28">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 gap-2">
              <div className="space-y-1 sm:space-y-1.5">
                <span className="text-gold tracking-[0.25em] text-[9.5px] sm:text-[10px] uppercase font-semibold block">
                  Browse &amp; Configure
                </span>
                <h2 className="font-editorial text-2xl sm:text-3xl text-foreground">
                  Explore Every Sanctuary
                </h2>
              </div>
              <div className="hidden md:flex items-center gap-2 text-[10px] text-foreground/30 uppercase tracking-widest">
                <Users className="w-3.5 h-3.5" />
                <span>Filter by capacity</span>
                <span className="mx-1">·</span>
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Floor plans</span>
              </div>
            </div>
            <Suspense fallback={<VillaExplorerSkeleton />}>
              <VillaExplorer />
            </Suspense>
          </div>

          {/* ── Inclusions Grid ── */}
          <div className="space-y-8 sm:space-y-10 pt-4 border-t border-gold/10">
            <div className="text-center space-y-2.5 sm:space-y-3">
              <span className="text-gold tracking-[0.25em] text-[9.5px] sm:text-[10px] uppercase font-semibold block">
                Every Stay Includes
              </span>
              <h2 className="font-editorial text-2xl sm:text-3xl md:text-4xl text-foreground">
                The Standard of a Sandeep Villa
              </h2>
              <p className="text-foreground/50 text-xs font-sans max-w-xl mx-auto leading-relaxed">
                These are not upgrades or add-ons — they are the baseline of every reservation.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
              {INCLUSIONS.map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="group p-5 sm:p-6 bg-background/60 border border-gold/10 hover:border-gold/30 rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-gold/5 space-y-2.5 sm:space-y-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center group-hover:bg-gold/15 transition-colors">
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-gold" />
                  </div>
                  <h3 className="font-editorial text-base sm:text-lg text-foreground">{title}</h3>
                  <p className="text-xs text-foreground/55 leading-relaxed font-sans">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── CTA Strip ── */}
          <div className="relative rounded-2xl overflow-hidden border border-gold/20 p-6 sm:p-10 md:p-14 text-center space-y-4 sm:space-y-6 bg-linear-to-br from-[#120e08] via-background to-[#120e08]">
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-100 h-50 bg-gold/8 rounded-full blur-3xl pointer-events-none" />
            <span className="text-gold tracking-[0.25em] text-[9.5px] sm:text-[10px] uppercase font-semibold block relative z-10">
              Begin Your Journey
            </span>
            <h2 className="font-editorial text-2xl sm:text-3xl md:text-5xl text-foreground relative z-10">
              Your Private World Awaits
            </h2>
            <p className="text-foreground/50 text-xs sm:text-sm font-sans max-w-xl mx-auto relative z-10">
              Reserve a signature villa and your dedicated butler will reach out within 24 hours to personalise every detail of your stay.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 relative z-10">
              <Link
                to="/book"
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 bg-gold hover:bg-gold/90 text-background font-bold text-xs tracking-[0.15em] uppercase rounded-lg transition-all shadow-xl shadow-gold/20 flex items-center justify-center gap-2"
              >
                Reserve Now <ArrowRight className="w-3.5 h-3.5" />
              </Link>
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
      <Footer />
    </SmoothScrollProvider>

  );
}
