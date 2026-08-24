import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import SmoothScrollProvider from "@/components/layout/smooth-scroll-provider";
import { useBanner, handleImageError } from "@/lib/api";
import { Shield, Sparkles, Check, Leaf, Droplets, Users, TreePine, ArrowRight, Sun, Recycle } from "lucide-react";
import { Link } from "react-router-dom";

const PLEDGES = [
  {
    icon: Sun,
    title: "Zero Carbon Energy Grids",
    body: "Our sanctuaries operate on 100% on-site renewable energy. Tesla Powerwall batteries capture tropical solar rays in the Maldives and Bali, while passive geo-thermal systems heat our Alpine chalets — zero diesel pollution across all five estates.",
  },
  {
    icon: Recycle,
    title: "Zero Single-Use Plastics",
    body: "Single-use plastics are eliminated from suites, kitchens, and supply logistics. We bottle our own mineral spring waters in reusable glass flasks, use natural bamboo amenities, and source ingredients wrapped in biodegradable cellulose.",
  },
  {
    icon: Droplets,
    title: "Complete Water Stewardship",
    body: "100% of greywater is recycled through estate bio-filtration gardens. Rainwater collection systems supply irrigation across all properties. Our desalination units in the Maldives use solar-powered reverse osmosis — no grid energy required.",
  },
  {
    icon: Users,
    title: "Community Investment Programme",
    body: "We hire locally at every property — over 80% of our workforce comes from surrounding villages. We fund education scholarships for 120+ local children annually, and our chefs source 90% of ingredients from within a 50km radius.",
  },
  {
    icon: TreePine,
    title: "Reef & Forest Restoration",
    body: "Our marine biologists oversee active coral restoration labs at the Maldives and Seychelles estates. We have planted over 14,000 native trees across all properties and partner with WWF on verified biodiversity offset programmes.",
  },
  {
    icon: Leaf,
    title: "Sustainable Materials Charter",
    body: "Every villa is built using locally sourced, certified sustainable materials — reclaimed teak, volcanic stone, and bamboo. We prohibit the use of concrete, imported marble, or non-FSC certified timber in all future construction.",
  },
];

const METRICS = [
  { value: "100%", label: "Renewable Energy" },
  { value: "0", label: "Single-Use Plastics" },
  { value: "14K+", label: "Trees Planted" },
  { value: "80%", label: "Local Workforce" },
];

const BENCHMARKS = [
  "100% Greywater recycling for estate irrigation",
  "Marine biologist coral reef restoration labs",
  "Zero landfill waste target achieved in 2026",
  "Local community education scholarships (120+ children)",
  "Solar-powered desalination at Maldives estate",
  "WWF verified biodiversity offset partnerships",
  "FSC-certified timber in all new construction",
  "90% locally sourced ingredients at every restaurant",
];

export default function Sustainability() {
  const heroBanner = useBanner("sustainability_hero", "/images/sustainable_ecological_sanctuary.webp");

  return (
    <SmoothScrollProvider>
      <Header />
      <main className="bg-background min-h-screen pt-24 sm:pt-32 pb-16 sm:pb-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto space-y-14 sm:space-y-20">

          {/* ── Page Header ── */}
          <div className="text-center space-y-3 sm:space-y-5">
            <span className="text-gold tracking-[0.25em] sm:tracking-[0.28em] text-[9.5px] sm:text-[10px] uppercase font-semibold block">
              Environmental Promise
            </span>
            <h1 className="font-editorial text-3xl sm:text-4xl md:text-6xl text-foreground leading-tight">
              Ecological Integrity<br className="hidden md:block" /> Charter
            </h1>
            <p className="text-foreground/60 text-xs sm:text-sm leading-relaxed font-sans max-w-2xl mx-auto">
              Luxury hospitality must coexist harmoniously with the earth. We design and operate sanctuaries
              that restore surrounding environments, eliminate waste, and continuously reduce our ecological footprint.
            </p>
          </div>

          {/* ── Hero Banner ── */}
          {heroBanner.image ? (
            <div className="relative w-full h-64 sm:h-80 md:h-120 rounded-2xl overflow-hidden border border-gold/15 shadow-2xl group">
              <img
                src={heroBanner.image}
                alt={heroBanner.title || "Sustainable Ecological Sanctuary"}
                className="w-full h-full object-cover absolute inset-0 group-hover:scale-[1.03] transition-transform duration-700"
                loading="lazy"
                onError={handleImageError}
              />
              <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 sm:bottom-8 sm:left-8 space-y-1">
                <span className="text-gold text-[9px] sm:text-[10px] uppercase tracking-widest font-semibold block">
                  Ecological Architecture
                </span>
                <p className="font-editorial text-xl sm:text-2xl text-foreground">
                  Sanctuaries that give back to the earth
                </p>
              </div>
            </div>
          ) : null}

          {/* ── Metrics Band ── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-gold/10 rounded-2xl overflow-hidden border border-gold/10">
            {METRICS.map(({ value, label }) => (
              <div key={label} className="bg-background/80 px-3 sm:px-6 py-5 sm:py-8 text-center hover:bg-background transition-colors">
                <span className="font-editorial text-2xl sm:text-4xl text-gold block">{value}</span>
                <span className="text-[8px] sm:text-[9px] uppercase tracking-widest text-foreground/40 font-medium">{label}</span>
              </div>
            ))}
          </div>

          {/* ── Pledge Cards ── */}
          <div className="space-y-6 sm:space-y-8">
            <div className="text-center space-y-2.5 sm:space-y-3">
              <span className="text-gold tracking-[0.25em] text-[9.5px] sm:text-[10px] uppercase font-semibold block">
                Our Commitments
              </span>
              <h2 className="font-editorial text-2xl sm:text-3xl md:text-4xl text-foreground">
                Six Pillars of Ecological Stewardship
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              {PLEDGES.map(({ icon: Icon, title, body }) => (
                <div
                  key={title}
                  className="group p-4 sm:p-6 bg-background/60 border border-gold/10 hover:border-gold/30 rounded-2xl transition-all duration-300 hover:shadow-lg space-y-2.5 sm:space-y-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
                    </div>
                    <h3 className="font-editorial text-lg sm:text-xl text-foreground">{title}</h3>
                  </div>
                  <p className="text-xs text-foreground/60 leading-relaxed font-sans">{body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Benchmarks Grid ── */}
          <div className="space-y-4 sm:space-y-6 border-t border-gold/10 pt-8 sm:pt-10">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-gold" />
              <h2 className="font-editorial text-xl sm:text-2xl text-foreground">Sustainability Benchmarks Achieved</h2>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
              {BENCHMARKS.map((item) => (
                <li key={item} className="flex items-start gap-2 sm:gap-2.5 text-xs text-foreground/70">
                  <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* ── CTA Strip ── */}
          <div className="relative rounded-2xl overflow-hidden border border-gold/20 p-6 sm:p-10 md:p-14 text-center space-y-4 sm:space-y-6 bg-linear-to-br from-[#080f09] via-background to-[#080f09]">
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-100 h-50 bg-emerald-500/8 rounded-full blur-3xl pointer-events-none" />
            <span className="text-gold tracking-[0.25em] text-[9.5px] sm:text-[10px] uppercase font-semibold block relative z-10">
              Travel Responsibly
            </span>
            <h2 className="font-editorial text-2xl sm:text-3xl md:text-4xl text-foreground relative z-10">
              Luxury Without Compromise
            </h2>
            <p className="text-foreground/50 text-xs sm:text-sm font-sans max-w-xl mx-auto relative z-10">
              Every reservation you make directly funds reef restoration, reforestation, and community education
              programmes at the sanctuary you visit.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 relative z-10">
              <Link
                to="/book"
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 bg-gold hover:bg-gold/90 text-background font-bold text-xs tracking-[0.15em] uppercase rounded-lg transition-all shadow-xl flex items-center justify-center gap-2"
              >
                Book a Sanctuary <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to="/about"
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 border border-gold/30 hover:border-gold text-foreground/70 hover:text-gold text-xs tracking-widest uppercase rounded-lg transition-all text-center"
              >
                Our Story
              </Link>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </SmoothScrollProvider>

  );
}
