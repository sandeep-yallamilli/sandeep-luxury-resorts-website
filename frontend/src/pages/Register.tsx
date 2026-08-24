import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import SmoothScrollProvider from "@/components/layout/smooth-scroll-provider";
import AuthForm from "@/components/ui/auth-form";
import { Crown, MapPin, Star } from "lucide-react";

const PERKS = [
  { icon: Crown, label: "Royal Diamond Status", desc: "Unlock exclusive privileges from day one." },
  { icon: Star, label: "Priority Reservations", desc: "First access to newly launched sanctuaries." },
  { icon: MapPin, label: "5 Global Sanctuaries", desc: "Curated hideaways across five continents." },
];

export default function Register() {
  return (
    <SmoothScrollProvider>
      <Header />
      <main className="min-h-screen bg-background flex">

        {/* ── Left panel – decorative luxury pillar ── */}
        <div className="hidden lg:flex flex-col justify-between relative w-[52%] overflow-hidden">
          {/* Background gradient layer */}
          <div className="absolute inset-0 bg-linear-to-br from-[#0a0705] via-[#120e08] to-[#1a1409]" />

          {/* Gold bokeh blobs */}
          <div className="absolute top-[-10%] left-[-10%] w-120 h-120 rounded-full bg-gold/8 blur-[120px] pointer-events-none" />
          <div className="absolute bottom-[-5%] right-[-5%] w-85 h-85 rounded-full bg-gold/6 blur-[90px] pointer-events-none" />

          {/* Subtle grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(var(--color-gold) 1px, transparent 1px), linear-gradient(90deg, var(--color-gold) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />

          {/* Content */}
          <div className="relative z-10 flex flex-col justify-center h-full px-16 py-20 space-y-14">
            {/* Brand headline */}
            <div className="space-y-4">
              <span className="text-gold/70 tracking-[0.28em] text-[10px] uppercase font-semibold block">
                Sanctuary Membership
              </span>
              <h2 className="font-editorial text-5xl xl:text-6xl text-foreground leading-tight">
                Where Silence<br />
                Becomes<br />
                <span className="text-gold">Luxury</span>
              </h2>
              <p className="text-foreground/50 text-sm leading-relaxed max-w-sm font-sans">
                Join a curated circle of discerning travellers who choose sanctuaries over hotels,
                and experience over amenity.
              </p>
            </div>

            {/* Perks list */}
            <ul className="space-y-6">
              {PERKS.map(({ icon: Icon, label, desc }) => (
                <li key={label} className="flex items-start gap-4">
                  <div className="mt-0.5 w-9 h-9 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-gold" />
                  </div>
                  <div>
                    <p className="text-foreground text-sm font-semibold">{label}</p>
                    <p className="text-foreground/45 text-xs font-sans mt-0.5">{desc}</p>
                  </div>
                </li>
              ))}
            </ul>

            {/* Bottom tagline */}
            <p className="text-[10px] text-foreground/25 uppercase tracking-widest font-mono border-t border-gold/10 pt-6">
              Sandeep Luxury Resorts · Est. 2019 · Global
            </p>
          </div>
        </div>

        {/* ── Right panel – auth card ── */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-20 sm:py-24 relative">
          {/* Soft ambient glow behind card */}
          <div className="absolute inset-0 bg-linear-to-br from-background via-background to-gold/5 pointer-events-none" />

          <div className="relative z-10 w-full max-w-md">
            <AuthForm type="register" />
          </div>
        </div>

      </main>
      <Footer />
    </SmoothScrollProvider>
  );
}
