import { useState, useEffect, lazy, Suspense } from "react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ResortCard from "@/components/ui/resort-card";
import SmoothScrollProvider from "@/components/layout/smooth-scroll-provider";
import { apiClient, Resort } from "@/lib/api";
import { MapPin, Star, Globe, Compass } from "lucide-react";

// Lazy load heavy Three.js 3D Globe to prevent blocking initial destinations page render
const InteractiveGlobe = lazy(() => import("@/components/ui/interactive-globe"));

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

const FILTERS = [
  { id: "all", label: "All Locations" },
  { id: "india", label: "India" },
  { id: "ocean", label: "Ocean & Islands" },
  { id: "africa", label: "Africa" },
  { id: "asia", label: "Asia" },
  { id: "europe", label: "Europe" },
];

const STATS = [
  { value: "5", label: "Global Regions", icon: Globe },
  { value: "82", label: "Private Villas", icon: Star },
  { value: "24/7", label: "Concierge", icon: Compass },
  { value: "5★", label: "Average Rating", icon: MapPin },
];

export default function Resorts() {
  const [filter, setFilter] = useState("all");
  const [resorts, setResorts] = useState<Resort[]>([]);

  useEffect(() => {
    apiClient.getResorts().then(setResorts).catch(console.error);
  }, []);

  const filteredResorts = filter === "all"
    ? resorts
    : resorts.filter((r) => r.region === filter);

  return (
    <SmoothScrollProvider>
      <Header />
      <main className="bg-background min-h-screen pt-24 sm:pt-32 pb-16 sm:pb-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16">

          {/* ── Page Header ── */}
          <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-5">
            <span className="text-gold tracking-[0.25em] sm:tracking-[0.28em] text-[9.5px] sm:text-[10px] uppercase font-semibold block">
              Global Inventory
            </span>
            <h1 className="font-editorial text-3xl sm:text-4xl md:text-6xl text-foreground leading-tight">
              Our Luxury Sanctuaries
            </h1>
            <p className="text-foreground/60 text-xs sm:text-sm leading-relaxed font-sans max-w-2xl mx-auto">
              Discover private havens designed to immerse you in isolation and beauty.
              Filter by geographical region or explore our global coordinates below.
            </p>
          </div>

          {/* ── Stats Band ── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-gold/10 rounded-2xl overflow-hidden border border-gold/10">
            {STATS.map(({ value, label, icon: Icon }) => (
              <div key={label} className="bg-background/80 px-3 sm:px-6 py-5 sm:py-8 text-center hover:bg-background transition-colors space-y-1">
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold mx-auto mb-1.5 sm:mb-2" />
                <span className="font-editorial text-2xl sm:text-3xl text-gold block">{value}</span>
                <span className="text-[8px] sm:text-[9px] uppercase tracking-widest text-foreground/40 font-medium">{label}</span>
              </div>
            ))}
          </div>

          {/* ── Interactive Globe ── */}
          <section className="bg-background/40 p-4 sm:p-8 md:p-16 border border-gold/10 rounded-2xl">
            <div className="max-w-4xl mx-auto text-center space-y-3 sm:space-y-4 mb-8 sm:mb-12">
              <span className="text-gold tracking-[0.25em] sm:tracking-[0.28em] text-[9.5px] sm:text-[10px] uppercase font-semibold block">
                Interactive Globe
              </span>
              <h2 className="font-editorial text-2xl sm:text-4xl md:text-5xl text-foreground">
                Global Sanctuaries
              </h2>
              <p className="text-foreground/60 text-xs sm:text-sm leading-relaxed font-sans">
                Hover over glowing markers to preview our ultra-luxury resorts. Drag to rotate, scroll to zoom.
              </p>
            </div>
            <div className="max-w-5xl mx-auto">
              <Suspense fallback={<GlobeSkeleton />}>
                <InteractiveGlobe />
              </Suspense>
            </div>
          </section>

          {/* ── Filter Bar ── */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-editorial text-xl sm:text-2xl text-foreground">Browse All Resorts</h2>
              <span className="text-xs text-foreground/40 uppercase tracking-widest font-mono">
                {filteredResorts.length} Found
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 sm:gap-2 border-b border-gold/10 pb-4 sm:pb-5">
              {FILTERS.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => setFilter(id)}
                  className={`px-3.5 sm:px-5 py-1.5 sm:py-2 text-[9px] sm:text-[10px] tracking-widest uppercase font-semibold rounded-full border transition-all cursor-pointer ${
                    filter === id
                      ? "bg-gold text-background border-gold shadow-lg"
                      : "border-gold/20 text-foreground/60 hover:text-foreground hover:border-gold"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* ── Resort Grid ── */}
          {filteredResorts.length === 0 ? (
            <div className="py-16 sm:py-20 text-center border border-dashed border-gold/20 rounded-2xl space-y-3 sm:space-y-4">
              <Globe className="w-8 h-8 sm:w-10 sm:h-10 text-gold/30 mx-auto" />
              <h3 className="font-editorial text-lg sm:text-xl text-foreground">No Sanctuaries in This Region</h3>
              <p className="text-xs text-foreground/40 font-sans">
                Try a different region filter or view all locations.
              </p>
              <button
                onClick={() => setFilter("all")}
                className="px-5 sm:px-6 py-2 sm:py-2.5 bg-gold/15 border border-gold/30 text-gold hover:bg-gold hover:text-background text-xs uppercase tracking-widest font-semibold rounded-lg transition-all cursor-pointer"
              >
                Show All Resorts
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredResorts.map((resort) => (
                <ResortCard
                  key={resort.slug}
                  slug={resort.slug}
                  name={resort.name}
                  location={resort.location}
                  description={resort.description}
                  rating={resort.rating}
                  image={resort.image}
                  priceStart={resort.priceStart}
                />
              ))}
            </div>
          )}

        </div>
      </main>
      <Footer />
    </SmoothScrollProvider>

  );
}
