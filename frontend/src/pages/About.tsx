import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import SmoothScrollProvider from "@/components/layout/smooth-scroll-provider";
import { getBackendImageUrl, useBanner, handleImageError } from "@/lib/api";
import { Sparkles, MapPin, Waves, Mountain, TreePine, Wind, Flame } from "lucide-react";

const DESTINATIONS = [
  {
    id: 1,
    region: "Indian Ocean",
    name: "Maldive Atoll Sanctuary",
    location: "North Malé Atoll, Maldives",
    desc: "Overwater glass villas suspended above a UNESCO-protected lagoon. Zero land footprint — 100% ocean immersion.",
    villas: 18,
    icon: Waves,
    gradient: "from-cyan-900/60 via-teal-900/40 to-background",
    accent: "text-cyan-400",
    border: "border-cyan-500/20",
  },
  {
    id: 2,
    region: "Himalayan Range",
    name: "Cloud Ridge Retreat",
    location: "Uttarakhand, India",
    desc: "Stone-clad chalets perched at 2,800 m, with uninterrupted views of the Nanda Devi massif and starlit skies.",
    villas: 12,
    icon: Mountain,
    gradient: "from-slate-800/60 via-zinc-900/40 to-background",
    accent: "text-slate-300",
    border: "border-slate-500/20",
  },
  {
    id: 3,
    region: "Tropical Forest",
    name: "Jungle Pavilion Estate",
    location: "Wayanad, Kerala, India",
    desc: "Treehouse-style pavilions woven into a protected rainforest canopy, where mist and birdsong replace alarm clocks.",
    villas: 22,
    icon: TreePine,
    gradient: "from-emerald-900/60 via-green-900/40 to-background",
    accent: "text-emerald-400",
    border: "border-emerald-500/20",
  },
  {
    id: 4,
    region: "Desert Expanse",
    name: "Dune Crest Reserve",
    location: "Thar Desert, Rajasthan, India",
    desc: "Hand-carved sandstone suites rising from the dunes — a solar-powered oasis where silence is the loudest luxury.",
    villas: 16,
    icon: Wind,
    gradient: "from-amber-900/60 via-orange-900/40 to-background",
    accent: "text-amber-400",
    border: "border-amber-500/20",
  },
  {
    id: 5,
    region: "Coastal Cliffs",
    name: "Basalt Cliff Residences",
    location: "Konkan Coast, Goa, India",
    desc: "Cliff-edge infinity suites where the Arabian Sea horizon meets volcanic rock formations at golden hour.",
    villas: 14,
    icon: Flame,
    gradient: "from-rose-900/60 via-red-900/40 to-background",
    accent: "text-rose-400",
    border: "border-rose-500/20",
  },
];

export default function About() {
  const heroBanner = useBanner("about_hero", "/images/sandeep_luxury_hero.webp");

  return (
    <SmoothScrollProvider>
      <Header />
      <main className="bg-background min-h-screen pt-24 sm:pt-32 pb-16 sm:pb-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto space-y-12 sm:space-y-16">

          {/* Header */}
          <div className="text-center space-y-3 sm:space-y-4">
            <span className="text-gold tracking-[0.25em] text-[10px] sm:text-xs uppercase font-semibold block">Brand Manifesto</span>
            <h1 className="font-editorial text-3xl sm:text-4xl md:text-6xl text-foreground">The Story of Sandeep Resorts</h1>
            <p className="text-foreground/70 text-xs sm:text-sm leading-relaxed font-sans max-w-2xl mx-auto">
              Our sanctuaries represent a curation of silence, space, and geographical honesty. Learn about our architectural history and dedication to providing elite hospitality.
            </p>
          </div>

          {/* Hero Banner Image */}
          {heroBanner.image ? (
            <div className="relative w-full h-64 sm:h-80 md:h-112.5 rounded-2xl overflow-hidden border border-gold/15 shadow-2xl">
              <img
                src={heroBanner.image}
                alt={heroBanner.title || "Sandeep Resorts Architectural Heritage"}
                className="w-full h-full object-cover absolute inset-0"
                loading="lazy"
                onError={handleImageError}
              />
              <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent" />
            </div>
          ) : null}

          {/* Chapters */}
          <div className="space-y-8 sm:space-y-12">
            <div className="space-y-3 sm:space-y-4">
              <span className="text-gold font-editorial text-lg sm:text-xl italic font-semibold">Chapter I</span>
              <h3 className="font-editorial text-2xl sm:text-3xl text-foreground">A Vision of Pure Seclusion</h3>
              <p className="text-xs text-foreground/70 leading-relaxed font-sans">
                Founded in 2018, Sandeep Resorts was conceived to challenge the dense complexity of standard luxury hotels. We noticed that high-end travelers were seeking solitude rather than noisy activities. We set out to find the world&apos;s most remote environments and build minimal, elegant spaces designed to emphasize silence.
              </p>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <span className="text-gold font-editorial text-lg sm:text-xl italic font-semibold">Chapter II</span>
              <h3 className="font-editorial text-2xl sm:text-3xl text-foreground">Minimalist Architectural Codes</h3>
              <p className="text-xs text-foreground/70 leading-relaxed font-sans">
                Our design framework combines the architectural minimalism of Aman, the ecological alignment of Six Senses, and the prestige of Ritz-Carlton. We utilize native materials, open-air wind-funnel engineering, and floor-to-ceiling windows to create seamless visual connections between guest beds and natural horizons.
              </p>
            </div>

            <div className="p-4 sm:p-6 bg-background text-foreground rounded-xl border border-gold/10 flex items-start gap-3 sm:gap-4">
              <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-gold shrink-0 mt-0.5" />
              <div>
                <h4 className="font-editorial text-lg sm:text-xl text-foreground mb-1 sm:mb-2">Our Spatial Oath</h4>
                <p className="text-[10px] text-foreground/60 leading-relaxed font-sans">
                  &quot;Every sanctuary we construct will limit occupancy to under 30 villas. This ensures absolute acoustic isolation, personalized butler care, and zero crowding at estate facilities.&quot;
                </p>
              </div>
            </div>
          </div>

          {/* ── Global Destinations ── */}
          <div className="space-y-8 sm:space-y-10">
            <div className="text-center space-y-2.5 sm:space-y-3">
              <span className="text-gold tracking-[0.25em] text-[10px] sm:text-xs uppercase font-semibold block">
                Our Sanctuaries
              </span>
              <h2 className="font-editorial text-2xl sm:text-3xl md:text-5xl text-foreground">
                Five Corners of the Earth
              </h2>
              <p className="text-foreground/50 text-xs sm:text-sm leading-relaxed font-sans max-w-xl mx-auto">
                Each property is chosen for its geographical rarity — a landscape so singular that
                the building only exists to frame it.
              </p>
            </div>

            {/* Destination cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
              {DESTINATIONS.map((d) => {
                const Icon = d.icon;
                return (
                  <div
                    key={d.id}
                    className={`group relative overflow-hidden rounded-2xl border ${d.border} bg-linear-to-br ${d.gradient} p-5 sm:p-6 hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl cursor-default`}
                  >
                    {/* Number watermark */}
                    <span className="absolute -top-3 -right-1 font-editorial text-7xl sm:text-8xl text-foreground/5 select-none pointer-events-none leading-none">
                      {String(d.id).padStart(2, "0")}
                    </span>

                    {/* Icon + region */}
                    <div className="flex items-center gap-2 mb-3 sm:mb-4">
                      <div className={`w-8 h-8 rounded-lg bg-background/30 border ${d.border} flex items-center justify-center`}>
                        <Icon className={`w-4 h-4 ${d.accent}`} />
                      </div>
                      <span className={`text-[9px] uppercase tracking-[0.2em] font-semibold ${d.accent}`}>
                        {d.region}
                      </span>
                    </div>

                    {/* Name */}
                    <h3 className="font-editorial text-lg sm:text-xl text-foreground mb-1 leading-snug">
                      {d.name}
                    </h3>

                    {/* Location */}
                    <div className="flex items-center gap-1 mb-2.5 sm:mb-3">
                      <MapPin className="w-3 h-3 text-foreground/30" />
                      <span className="text-[10px] text-foreground/40 font-mono tracking-wide">
                        {d.location}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-foreground/60 leading-relaxed font-sans mb-4 sm:mb-5">
                      {d.desc}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between border-t border-foreground/8 pt-3.5 sm:pt-4">
                      <span className="text-[9px] text-foreground/30 uppercase tracking-widest font-medium">
                        {d.villas} Private Villas
                      </span>
                      <span className={`text-[9px] uppercase tracking-widest font-semibold ${d.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-200`}>
                        Explore →
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Stats bar */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 border border-gold/10 rounded-2xl p-4 sm:p-6 bg-background/40">
              {[
                { value: "5", label: "Continents" },
                { value: "82", label: "Total Villas" },
                { value: "<30", label: "Villas per Estate" },
              ].map(({ value, label }) => (
                <div key={label} className="text-center space-y-0.5 sm:space-y-1">
                  <span className="font-editorial text-2xl sm:text-3xl text-gold block">{value}</span>
                  <span className="text-[8.5px] sm:text-[9px] uppercase tracking-widest text-foreground/40 font-medium">{label}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </SmoothScrollProvider>
  );
}

