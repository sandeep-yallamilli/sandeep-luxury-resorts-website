import { useState } from "react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import SmoothScrollProvider from "@/components/layout/smooth-scroll-provider";
import { Calendar, CheckCircle2, Heart, Sparkles, Shield, Camera, Music, UtensilsCrossed, ArrowRight } from "lucide-react";
import { apiClient, useBanner, handleImageError } from "@/lib/api";
import { Link } from "react-router-dom";

const VENUES = [
  {
    num: "1",
    name: "Maldives Floating Sandbank",
    desc: "Walk down an ethereal sand runway surrounded entirely by turquoise waters at sunset.",
    capacity: "Up to 50 Guests",
  },
  {
    num: "2",
    name: "Bali Sacred Ravine Pavilion",
    desc: "Exchange vows suspended above river canyons and lush jungle forests illuminated by glowing oil lamps.",
    capacity: "Up to 80 Guests",
  },
  {
    num: "3",
    name: "Alps Zermatt Peak Dome",
    desc: "An intimate winter ceremony inside a heated glass geodesic dome directly framing the snow-capped peaks.",
    capacity: "Up to 40 Guests",
  },
  {
    num: "4",
    name: "Thar Desert Starlight Citadel",
    desc: "Hand-carved sandstone courtyard illuminated by 1,000 candles with private royal folk performances.",
    capacity: "Up to 120 Guests",
  },
  {
    num: "5",
    name: "Seychelles Granite Ocean Bluff",
    desc: "Dramatic cliffside altar overlooking private coves with gentle ocean breezes and tropical floral arches.",
    capacity: "Up to 60 Guests",
  },
];

const EVENT_SERVICES = [
  { icon: Sparkles, title: "Director of Celebrations", desc: "A dedicated planner handles all legal documentation, itineraries, and design." },
  { icon: UtensilsCrossed, title: "Michelin Banquet Menus", desc: "Custom multi-course dining paired with vintage sommelier selections." },
  { icon: Camera, title: "Aerial & Cinema Documentation", desc: "Discreet drone cinematography and master photography team." },
  { icon: Music, title: "Acoustic Seclusion", desc: "Zero neighboring noise or curfew restrictions for your private gathering." },
];

export default function Weddings() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [eventType, setEventType] = useState("Wedding Ceremony");
  const [resort, setResort] = useState("Maldives Private Pavilion");
  const [expectedDate, setExpectedDate] = useState("");
  const [guestCount, setGuestCount] = useState("Under 20 Guests");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const heroBanner = useBanner("weddings_hero", "/images/weddings_hero.webp");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      await apiClient.submitInquiry({
        name,
        email,
        resort,
        subject: `Event Request: ${eventType}`,
        message: `Event Type: ${eventType}\nResort: ${resort}\nExpected Date: ${expectedDate}\nGuests: ${guestCount}`,
      });
      setSubmitted(true);
    } catch (err: unknown) {
      const error = err as { message?: string };
      setErrorMsg(error.message || "Failed to submit event request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SmoothScrollProvider>
      <Header />
      <main className="bg-background min-h-screen pt-24 sm:pt-32 pb-16 sm:pb-24 px-4 sm:px-6 md:px-8">
        <div className="max-w-7xl mx-auto space-y-14 sm:space-y-20">

          {/* ── Header ── */}
          <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-5">
            <span className="text-gold tracking-[0.25em] sm:tracking-[0.28em] text-[9.5px] sm:text-[10px] uppercase font-semibold block">
              Exclusive Havens
            </span>
            <h1 className="font-editorial text-3xl sm:text-4xl md:text-6xl text-foreground leading-tight">
              Weddings &amp; Private<br className="hidden md:block" /> Celebrations
            </h1>
            <p className="text-foreground/60 text-xs sm:text-sm leading-relaxed font-sans max-w-2xl mx-auto">
              Exchange vows or coordinate executive retreats in absolute seclusion. We provide complete logistical support, private aviation charters, custom catering, and award-winning decor design.
            </p>
          </div>

          {/* ── Hero Banner ── */}
          {heroBanner.image ? (
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gold/20 h-72 sm:h-105 md:h-130 group">
              <img
                src={heroBanner.image}
                alt={heroBanner.title || "Luxury Resort Beachside Wedding Altar"}
                className="w-full h-full object-cover absolute inset-0 group-hover:scale-[1.03] transition-transform duration-700"
                loading="lazy"
                onError={handleImageError}
              />
              <div className="absolute inset-0 bg-linear-to-t from-background via-background/30 to-transparent flex items-end p-5 sm:p-8 md:p-14">
                <div className="space-y-1.5 sm:space-y-2 max-w-xl">
                  <span className="text-gold text-[9px] sm:text-[10px] uppercase tracking-[0.25em] block font-semibold">
                    Curated Elegance
                  </span>
                  <h2 className="font-editorial text-2xl sm:text-3xl md:text-4xl text-foreground">
                    Oceanfront Ceremony Sanctuaries
                  </h2>
                  <p className="text-foreground/70 text-xs font-sans">
                    Uninterrupted horizons, floating floral altars, and personalized celebration charters.
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          {/* ── Event Services Strip ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {EVENT_SERVICES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-5 sm:p-6 rounded-2xl bg-background/60 border border-gold/10 hover:border-gold/30 transition-all space-y-2.5 sm:space-y-3">
                <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-gold" />
                </div>
                <h3 className="font-editorial text-base sm:text-lg text-foreground">{title}</h3>
                <p className="text-xs text-foreground/55 leading-relaxed font-sans">{desc}</p>
              </div>
            ))}
          </div>

          {/* ── Venues and Form Grid ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-start">

            {/* Left Side: Venue cards */}
            <div className="lg:col-span-6 space-y-4 sm:space-y-6">
              <div className="space-y-1.5 sm:space-y-2">
                <span className="text-gold text-[9.5px] sm:text-[10px] uppercase tracking-[0.28em] block font-semibold">Signature Venues</span>
                <h2 className="font-editorial text-2xl sm:text-3xl md:text-4xl text-foreground">Unmatched Celebration Havens</h2>
                <p className="text-xs text-foreground/60 leading-relaxed font-sans">
                  Each venue is engineered to frame natural landscape geometry without artificial intrusion:
                </p>
              </div>

              <div className="space-y-3 pt-1 sm:pt-2">
                {VENUES.map((venue) => (
                  <div key={venue.num} className="flex gap-3.5 sm:gap-4 p-4 sm:p-5 bg-background/50 border border-gold/10 hover:border-gold/30 rounded-2xl transition-all">
                    <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gold/15 text-gold font-bold text-xs flex items-center justify-center shrink-0">
                      {venue.num}
                    </span>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <h4 className="font-editorial text-base sm:text-lg text-foreground">{venue.name}</h4>
                        <span className="text-[8.5px] sm:text-[9px] uppercase tracking-wider text-gold font-semibold font-mono">{venue.capacity}</span>
                      </div>
                      <p className="text-xs text-foreground/60 leading-relaxed font-sans">{venue.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side: Event inquiry form */}
            <div className="lg:col-span-6 bg-background/80 text-foreground p-5 sm:p-8 md:p-10 rounded-2xl border border-gold/20 shadow-2xl space-y-5 sm:space-y-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gold" />
                  <h3 className="font-editorial text-xl sm:text-2xl text-foreground">Plan Your Private Event</h3>
                </div>
                <p className="text-[10px] text-foreground/40 font-sans">
                  Provide your preferred details to schedule a consultation with our Global Director of Events.
                </p>
              </div>

              {submitted ? (
                <div className="space-y-4 py-8 sm:py-10 text-center">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-400" />
                  </div>
                  <h4 className="font-editorial text-xl sm:text-2xl text-gold">Event Request Received</h4>
                  <p className="text-xs text-foreground/70 leading-relaxed max-w-xs mx-auto font-sans">
                    Thank you, {name}. Our Director of Events will contact you at <strong className="text-foreground">{email}</strong> within 24 hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-2.5 border border-gold text-gold hover:bg-gold hover:text-background text-xs uppercase tracking-widest font-semibold rounded-xl transition-all cursor-pointer"
                  >
                    Submit Another Event Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
                  {errorMsg && (
                    <div className="p-3 bg-red-500/10 border border-red-500/40 text-red-400 rounded-xl text-xs font-semibold">
                      {errorMsg}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                    <div className="space-y-1 sm:space-y-1.5">
                      <label className="text-[9px] uppercase tracking-widest text-gold font-semibold block">Full Name</label>
                      <input
                        required
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Lord Sandeep"
                        className="w-full bg-background border border-gold/20 rounded-xl p-2.5 sm:p-3 text-xs text-foreground focus:border-gold outline-none transition"
                      />
                    </div>
                    <div className="space-y-1 sm:space-y-1.5">
                      <label className="text-[9px] uppercase tracking-widest text-gold font-semibold block">Email</label>
                      <input
                        required
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="sandeep@example.com"
                        className="w-full bg-background border border-gold/20 rounded-xl p-2.5 sm:p-3 text-xs text-foreground focus:border-gold outline-none transition"
                      />
                    </div>
                  </div>

                  <div className="space-y-1 sm:space-y-1.5">
                    <label className="text-[9px] uppercase tracking-widest text-gold font-semibold block">Event Type</label>
                    <select
                      value={eventType}
                      onChange={(e) => setEventType(e.target.value)}
                      className="w-full bg-background border border-gold/20 rounded-xl p-2.5 sm:p-3 text-xs text-foreground cursor-pointer focus:border-gold outline-none transition"
                    >
                      <option value="Wedding Ceremony">Wedding Ceremony &amp; Reception</option>
                      <option value="Corporate Executive Retreat">Corporate Executive Retreat</option>
                      <option value="Private Milestone Celebration">Private Milestone Celebration</option>
                      <option value="Complete Estate Buyout">Complete Estate Buyout</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                    <div className="space-y-1 sm:space-y-1.5">
                      <label className="text-[9px] uppercase tracking-widest text-gold font-semibold block">Sanctuary Location</label>
                      <select
                        value={resort}
                        onChange={(e) => setResort(e.target.value)}
                        className="w-full bg-background border border-gold/20 rounded-xl p-2.5 sm:p-3 text-xs text-foreground cursor-pointer focus:border-gold outline-none transition"
                      >
                        <option value="Maldives Private Pavilion">Maldives Private Pavilion</option>
                        <option value="Bora Bora Overwater Lagoon">Bora Bora Overwater Lagoon</option>
                        <option value="Seychelles Granite Sanctuary">Seychelles Granite Sanctuary</option>
                        <option value="Serengeti Wildlife Sanctuary">Serengeti Wildlife Sanctuary</option>
                        <option value="Himalayan Cloud Ridge">Himalayan Cloud Ridge</option>
                      </select>
                    </div>
                    <div className="space-y-1 sm:space-y-1.5">
                      <label className="text-[9px] uppercase tracking-widest text-gold font-semibold block">Expected Date</label>
                      <input
                        required
                        type="date"
                        value={expectedDate}
                        onChange={(e) => setExpectedDate(e.target.value)}
                        className="w-full bg-background border border-gold/20 rounded-xl p-2.5 sm:p-3 text-xs text-foreground focus:border-gold outline-none transition cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="space-y-1 sm:space-y-1.5">
                    <label className="text-[9px] uppercase tracking-widest text-gold font-semibold block">Estimated Guests</label>
                    <select
                      value={guestCount}
                      onChange={(e) => setGuestCount(e.target.value)}
                      className="w-full bg-background border border-gold/20 rounded-xl p-2.5 sm:p-3 text-xs text-foreground cursor-pointer focus:border-gold outline-none transition"
                    >
                      <option value="Under 20 Guests">Under 20 Guests (Intimate)</option>
                      <option value="20 - 50 Guests">20 - 50 Guests (Pavilion)</option>
                      <option value="50 - 100 Guests">50 - 100 Guests (Estate)</option>
                      <option value="100+ Guests">100+ Guests (Full Sanctuary Buyout)</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 sm:py-4 bg-gold hover:bg-gold/90 disabled:opacity-50 text-background font-bold text-xs tracking-[0.18em] uppercase transition-all duration-300 rounded-xl cursor-pointer shadow-xl flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? "Submitting Event Request..." : (
                      <>
                        <span>Submit Event Request</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

          </div>

        </div>
      </main>
      <Footer />
    </SmoothScrollProvider>

  );
}
