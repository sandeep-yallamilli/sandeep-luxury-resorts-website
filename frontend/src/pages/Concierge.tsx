import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ConciergeChat from "@/components/ui/concierge-chat";
import SmoothScrollProvider from "@/components/layout/smooth-scroll-provider";
import {
  Compass,
  Globe,
  Sparkles,
  Shield,
  Clock,
  MapPin,
  Utensils,
  Heart,
  Plane,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Star,
  Headphones,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const CAPABILITIES = [
  {
    icon: MapPin,
    title: "Villa & Suite Reservations",
    description:
      "Secure your overwater bungalow, jungle treehouse, or cliffside villa. Instant availability checks across all global sanctuaries.",
  },
  {
    icon: Utensils,
    title: "Michelin Dining Curation",
    description:
      "Reserve private beach banquets, sunset sommelier tastings, or chef's table experiences at any destination.",
  },
  {
    icon: Heart,
    title: "Wellness Journey Design",
    description:
      "Build bespoke spa retreats — Ayurvedic cleanses, sound healing sessions, yoga atop volcanic plateaus, and more.",
  },
  {
    icon: Globe,
    title: "Destination Intelligence",
    description:
      "Deep local knowledge across Maldives atolls, Bali temple circuits, Kyoto onsens, Rajasthani forts, and Swiss alpine lodges.",
  },
  {
    icon: Plane,
    title: "Private Transfer Logistics",
    description:
      "Coordinate seaplane arrivals, helicopter transfers, luxury yacht charters, and private jet ground logistics.",
  },
  {
    icon: Sparkles,
    title: "Bespoke Itineraries",
    description:
      "Craft multi-destination journeys with curated cultural excursions, adventure add-ons, and VIP access experiences.",
  },
];

const FAQS = [
  {
    q: "Is the AI Concierge available 24/7?",
    a: "Absolutely. Our digital concierge operates around the clock, providing instant responses at any hour. For complex arrangements, your request is seamlessly escalated to our human concierge team.",
  },
  {
    q: "Can the concierge handle multi-destination itineraries?",
    a: "Yes. Our AI is trained across all Sandeep properties worldwide. It can coordinate villa bookings in Maldives, dining in Bali, and wellness retreats in Kyoto — all within a single conversation.",
  },
  {
    q: "How does the concierge personalize recommendations?",
    a: "The system considers your past stays, membership tier, stated preferences, and seasonal availability to craft deeply personalized suggestions tailored to your desires.",
  },
  {
    q: "Can I book directly through the chat?",
    a: "The concierge provides detailed information, availability, and pricing. For final reservations, it guides you through our streamlined booking flow or connects you with a dedicated guest relations specialist.",
  },
];

export default function Concierge() {
  const [mounted, setMounted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(".concierge-hero-reveal", {
        y: 60,
        opacity: 0,
        duration: 1.4,
        ease: "power4.out",
        stagger: 0.18,
      });
      gsap.from(".concierge-sub", {
        opacity: 0,
        duration: 1.8,
        delay: 0.6,
        ease: "power2.out",
      });
      gsap.utils.toArray<HTMLElement>(".capability-card").forEach((card) => {
        gsap.from(card, {
          y: 40,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 88%",
            once: true,
          },
        });
      });
    }, containerRef);
    return () => ctx.revert();
  }, [mounted]);

  if (!mounted) return null;

  return (
    <SmoothScrollProvider>
      <div ref={containerRef}>
        <Header />

        <main className="bg-background min-h-screen overflow-hidden">

          {/* ─── SECTION 1: Cinematic Hero ─── */}
          <section className="relative pt-28 sm:pt-40 pb-14 sm:pb-24 md:pt-48 md:pb-32 px-4 sm:px-6 bg-background overflow-hidden">
            {/* Ambient Glows */}
            <div className="ambient-glow-gold top-20 left-1/3 opacity-50 pointer-events-none" />
            <div className="ambient-glow-teal bottom-0 right-1/4 opacity-25 pointer-events-none" />

            <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6 sm:space-y-8">
              {/* Badge */}
              <span className="concierge-sub inline-flex items-center gap-1.5 sm:gap-2 text-gold tracking-[0.2em] sm:tracking-[0.3em] text-[9px] sm:text-[10px] uppercase font-bold px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full border border-gold/40 bg-background/60 backdrop-blur-md shadow-xl">
                <Headphones className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-gold animate-pulse" />
                Elite AI Guest Intelligence
              </span>

              {/* Title */}
              <h1 className="font-editorial text-4xl sm:text-5xl md:text-7xl lg:text-8xl text-foreground leading-[0.95] sm:leading-[0.9] tracking-tighter">
                <span className="concierge-hero-reveal block font-light">Your Private</span>
                <span className="concierge-hero-reveal block text-gold-shimmer font-bold drop-shadow-2xl">
                  AI Concierge
                </span>
              </h1>

              {/* Subtitle */}
              <p className="concierge-sub text-foreground/70 text-xs sm:text-sm md:text-base max-w-2xl mx-auto leading-relaxed tracking-wider font-sans">
                An always-on digital intelligence trained across every Sandeep sanctuary.
                From Maldivian overwater suites to Kyoto onsens — ask anything, arrange everything.
              </p>

              {/* Stats Row */}
              <div className="concierge-sub flex flex-wrap justify-center gap-6 sm:gap-8 md:gap-16 pt-2 sm:pt-4">
                <div className="text-center">
                  <span className="text-gold font-editorial text-2xl sm:text-3xl font-bold block">24/7</span>
                  <span className="text-[8.5px] sm:text-[9px] text-foreground/50 uppercase tracking-widest">Availability</span>
                </div>
                <div className="text-center">
                  <span className="text-gold font-editorial text-2xl sm:text-3xl font-bold block">8+</span>
                  <span className="text-[8.5px] sm:text-[9px] text-foreground/50 uppercase tracking-widest">Destinations</span>
                </div>
                <div className="text-center">
                  <span className="text-gold font-editorial text-2xl sm:text-3xl font-bold block">&lt;3s</span>
                  <span className="text-[8.5px] sm:text-[9px] text-foreground/50 uppercase tracking-widest">Response Time</span>
                </div>
                <div className="text-center">
                  <span className="text-gold font-editorial text-2xl sm:text-3xl font-bold block">∞</span>
                  <span className="text-[8.5px] sm:text-[9px] text-foreground/50 uppercase tracking-widest">Possibilities</span>
                </div>
              </div>

              {/* Scroll indicator */}
              <div className="concierge-sub pt-4 sm:pt-8">
                <a href="#chat-terminal" className="inline-flex flex-col items-center gap-1.5 sm:gap-2 text-gold/60 hover:text-gold transition-colors duration-500 group">
                  <span className="text-[8.5px] sm:text-[9px] uppercase tracking-[0.25em] sm:tracking-[0.3em] font-medium">Begin Conversation</span>
                  <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 animate-bounce" />
                </a>
              </div>
            </div>
          </section>


          {/* ─── SECTION 2: Capabilities Grid ─── */}
          <section className="pt-16 sm:pt-20 md:pt-28 pb-0 px-4 sm:px-6 bg-background border-t border-gold/10">
            <div className="max-w-7xl mx-auto">
              <div className="text-center max-w-2xl mx-auto space-y-3 sm:space-y-4 mb-10 sm:mb-16">
                <span className="text-gold tracking-[0.25em] sm:tracking-[0.3em] text-[9.5px] sm:text-[10px] uppercase block font-medium">
                  Concierge Capabilities
                </span>
                <h2 className="font-editorial text-2xl sm:text-3xl md:text-5xl text-foreground">
                  What Your Concierge Can Do
                </h2>
                <p className="text-foreground/60 text-xs sm:text-sm leading-relaxed font-sans">
                  Powered by deep knowledge of every property, local culture, and guest preference pattern.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {CAPABILITIES.map((cap, i) => {
                  const Icon = cap.icon;
                  return (
                    <div
                      key={i}
                      className="capability-card group bg-background border border-gold/15 hover:border-gold/50 rounded-2xl p-5 sm:p-8 space-y-3 sm:space-y-4 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(212,175,55,0.15)] hover:-translate-y-1"
                    >
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gold/10 border border-gold/25 flex items-center justify-center group-hover:bg-gold/20 transition-all duration-500">
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-gold" />
                      </div>
                      <h3 className="font-editorial text-base sm:text-lg text-foreground">{cap.title}</h3>
                      <p className="text-xs text-foreground/60 leading-relaxed font-sans">
                        {cap.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>


          {/* ─── SECTION 3: Full-Size Chat Terminal ─── */}
          <section id="chat-terminal" className="pt-10 md:pt-14 pb-16 sm:pb-20 md:pb-28 px-4 sm:px-6 bg-background scroll-mt-24 relative overflow-hidden">
            {/* Decorative background grid */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
            {/* Ambient Glows */}
            <div className="ambient-glow-gold top-1/4 right-0 opacity-25 pointer-events-none" />
            <div className="ambient-glow-teal bottom-0 left-0 opacity-15 pointer-events-none" />

            <div className="max-w-4xl mx-auto space-y-6 sm:space-y-10 relative z-10">
              {/* Section Header */}
              <div className="text-center space-y-2.5 sm:space-y-4">
                <span className="text-gold tracking-[0.25em] sm:tracking-[0.3em] text-[9.5px] sm:text-[10px] uppercase block font-medium">
                  Live AI Terminal
                </span>
                <h2 className="font-editorial text-2xl sm:text-3xl md:text-5xl text-foreground">
                  Start Your Conversation
                </h2>
                <p className="text-foreground/60 text-xs sm:text-sm leading-relaxed font-sans max-w-xl mx-auto">
                  Ask about Maldives overwater suites, Bali temple tours, Kyoto onsens, customized spa wellness paths,
                  or let our AI compile your perfect itinerary.
                </p>
              </div>

              {/* Chat Panel */}
              <div className="relative">
                <ConciergeChat inline={true} />
              </div>

              {/* Trust Badges below chat */}
              <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-10 pt-2 sm:pt-4">
                <div className="flex items-center gap-1.5 sm:gap-2 text-foreground/50">
                  <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold/60" />
                  <span className="text-[9px] sm:text-[10px] uppercase tracking-widest">End-to-End Encrypted</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 text-foreground/50">
                  <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold/60" />
                  <span className="text-[9px] sm:text-[10px] uppercase tracking-widest">Instant Responses</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 text-foreground/50">
                  <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold/60" />
                  <span className="text-[9px] sm:text-[10px] uppercase tracking-widest">VIP Priority Queue</span>
                </div>
              </div>
            </div>
          </section>


          {/* ─── SECTION 4: How It Works ─── */}
          <section className="py-16 sm:py-20 md:py-28 px-4 sm:px-6 bg-background border-t border-gold/10">
            <div className="max-w-5xl mx-auto">
              <div className="text-center max-w-2xl mx-auto space-y-3 sm:space-y-4 mb-10 sm:mb-16">
                <span className="text-gold tracking-[0.25em] sm:tracking-[0.3em] text-[9.5px] sm:text-[10px] uppercase block font-medium">
                  Effortless Experience
                </span>
                <h2 className="font-editorial text-2xl sm:text-3xl md:text-5xl text-foreground">
                  How It Works
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
                {[
                  {
                    step: "01",
                    title: "Ask Anything",
                    desc: "Type your request — villa recommendations, dining preferences, wellness goals, or transfer logistics.",
                    icon: MessageSquare,
                  },
                  {
                    step: "02",
                    title: "AI Curates",
                    desc: "Our intelligence cross-references availability, your preferences, seasonal highlights, and local expertise.",
                    icon: Sparkles,
                  },
                  {
                    step: "03",
                    title: "Experience Delivered",
                    desc: "Receive tailored recommendations with direct booking links, or have our team finalize arrangements.",
                    icon: Compass,
                  },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="relative text-center space-y-3 sm:space-y-5 p-5 sm:p-8">
                      {/* Step Number */}
                      <span className="text-gold/15 font-editorial text-6xl sm:text-8xl font-bold absolute -top-2 left-1/2 -translate-x-1/2 pointer-events-none select-none">
                        {item.step}
                      </span>
                      <div className="relative z-10 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mx-auto">
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-gold" />
                      </div>
                      <h3 className="relative z-10 font-editorial text-lg sm:text-xl text-foreground">{item.title}</h3>
                      <p className="relative z-10 text-xs text-foreground/60 leading-relaxed font-sans max-w-xs mx-auto">
                        {item.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>


          {/* ─── SECTION 5: FAQ ─── */}
          <section className="py-16 sm:py-20 md:py-28 px-4 sm:px-6 bg-background border-t border-gold/10">
            <div className="max-w-3xl mx-auto space-y-8 sm:space-y-12">
              <div className="text-center space-y-3 sm:space-y-4">
                <span className="text-gold tracking-[0.25em] sm:tracking-[0.3em] text-[9.5px] sm:text-[10px] uppercase block font-medium">
                  Guest Questions
                </span>
                <h2 className="font-editorial text-2xl sm:text-3xl md:text-5xl text-foreground">
                  Frequently Asked
                </h2>
              </div>

              <div className="space-y-3">
                {FAQS.map((faq, i) => (
                  <div
                    key={i}
                    className="border border-gold/15 rounded-xl overflow-hidden transition-all duration-300 hover:border-gold/30"
                  >
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between p-4 sm:p-6 text-left cursor-pointer"
                    >
                      <span className="font-sans text-xs sm:text-sm text-foreground font-medium pr-4">{faq.q}</span>
                      {openFaq === i ? (
                        <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-gold shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gold/50 shrink-0" />
                      )}
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-500 ease-in-out ${openFaq === i ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
                        }`}
                    >
                      <p className="px-4 sm:px-6 pb-4 sm:pb-6 text-xs text-foreground/60 leading-relaxed font-sans">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>


          {/* ─── SECTION 6: CTA Banner ─── */}
          <section className="py-16 sm:py-20 md:py-28 px-4 sm:px-6 bg-background border-t border-gold/10">
            <div className="max-w-4xl mx-auto relative">
              {/* Glassmorphism CTA Card */}
              <div className="glass-panel rounded-3xl p-6 sm:p-12 md:p-16 text-center space-y-6 sm:space-y-8 relative overflow-hidden">
                {/* Background shimmer accents */}
                <div className="absolute top-0 right-0 w-60 h-60 bg-gold/8 blur-3xl rounded-full pointer-events-none" />
                <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-turquoise/5 blur-3xl rounded-full pointer-events-none" />
                {/* Top gold line */}
                <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-gold/50 to-transparent" />

                <Headphones className="w-7 h-7 sm:w-8 sm:h-8 text-gold mx-auto relative z-10" />
                <span className="text-gold tracking-[0.25em] sm:tracking-[0.3em] text-[9.5px] sm:text-[10px] uppercase block font-medium relative z-10">
                  Prefer Human Touch?
                </span>
                <h2 className="font-editorial text-2xl sm:text-3xl md:text-5xl text-foreground relative z-10">
                  Connect With Our Global Guest Relations
                </h2>
                <p className="text-foreground/60 text-xs sm:text-sm leading-relaxed font-sans max-w-xl mx-auto relative z-10">
                  Our dedicated guest relations specialists are available around the clock
                  for complex travel arrangements, wedding planning, and VIP charter coordination.
                </p>
                <div className="flex flex-wrap justify-center gap-3 sm:gap-4 pt-2 sm:pt-4 relative z-10">
                  <Link
                    to="/contact"
                    className="btn-luxury-gold px-6 sm:px-8 py-3 rounded-lg text-[10px] tracking-[0.2em] uppercase inline-block"
                  >
                    Contact Guest Relations
                  </Link>
                  <Link
                    to="/book"
                    className="px-6 sm:px-8 py-3 border border-gold text-gold hover:bg-gold hover:text-background font-medium text-[10px] tracking-[0.2em] uppercase transition-all duration-500 inline-block rounded-lg"
                  >
                    Reserve a Sanctuary
                  </Link>
                </div>
              </div>
            </div>
          </section>


        </main>

        <Footer />
      </div>
    </SmoothScrollProvider>
  );
}
