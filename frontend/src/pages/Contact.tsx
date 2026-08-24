import { useState } from "react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import SmoothScrollProvider from "@/components/layout/smooth-scroll-provider";
import { MessageSquare, Phone, MapPin, CheckCircle2, Clock, Headphones, Mail, ArrowRight } from "lucide-react";
import { apiClient } from "@/lib/api";
import { Link } from "react-router-dom";

const CONTACT_ITEMS = [
  {
    icon: Phone,
    title: "International Hotline",
    value: "+1 (800) 999-SANDEEP",
    desc: "Direct line to global booking supervisors. Available 24/7 for urgent requests.",
  },
  {
    icon: Mail,
    title: "Electronic Office",
    value: "guestrelations@sandeepresorts.com",
    desc: "Bespoke itineraries, villa personalisation, and booking edits.",
  },
  {
    icon: MapPin,
    title: "Headquarters",
    value: "800 Elite Way, London, UK",
    desc: "Sandeep Resorts Group, Suite 500, London EC2A 4NE",
  },
  {
    icon: Headphones,
    title: "Concierge Direct",
    value: "concierge@sandeepresorts.com",
    desc: "Private jet charters, helicopter arrivals, and custom experience requests.",
  },
];

const AVAILABILITY = [
  { icon: Clock, label: "24 / 7 Support" },
  { icon: MessageSquare, label: "2-Hour Response" },
  { icon: Phone, label: "Global Hotline" },
  { icon: Headphones, label: "Dedicated Concierge" },
];

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      await apiClient.submitInquiry({ name, email, phone, subject, message });
      setSubmitted(true);
    } catch (err: unknown) {
      const error = err as { message?: string };
      setErrorMsg(error.message || "Failed to submit inquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SmoothScrollProvider>
      <Header />
      <main className="bg-background min-h-screen pt-24 sm:pt-32 pb-16 sm:pb-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto space-y-10 sm:space-y-16">

          {/* ── Page Header ── */}
          <div className="text-center space-y-3 sm:space-y-5">
            <span className="text-gold tracking-[0.25em] sm:tracking-[0.28em] text-[9.5px] sm:text-[10px] uppercase font-semibold block">
              Guest Relations
            </span>
            <h1 className="font-editorial text-3xl sm:text-4xl md:text-6xl text-foreground leading-tight">
              Private Communications
            </h1>
            <p className="text-foreground/60 text-xs sm:text-sm leading-relaxed font-sans max-w-xl mx-auto">
              Connect with our guest coordination team. We are available 24/7 to arrange flights,
              customise villa amenities, and answer every inquiry with care.
            </p>
          </div>

          {/* ── Availability Strip ── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-gold/10 rounded-2xl overflow-hidden border border-gold/10">
            {AVAILABILITY.map(({ icon: Icon, label }) => (
              <div key={label} className="bg-background/80 px-3 sm:px-6 py-4 sm:py-5 flex flex-col items-center gap-1.5 sm:gap-2 hover:bg-background transition-colors">
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold" />
                <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-foreground/50 font-medium text-center">{label}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 sm:gap-12 items-start">

            {/* ── Contact Cards ── */}
            <div className="lg:col-span-2 space-y-3.5 sm:space-y-4">
              <div className="space-y-1 mb-4 sm:mb-6">
                <span className="text-gold tracking-[0.25em] text-[9.5px] sm:text-[10px] uppercase font-semibold block">
                  Reach Us Directly
                </span>
                <h2 className="font-editorial text-xl sm:text-2xl text-foreground">Our Global Offices</h2>
                <p className="text-xs text-foreground/50 font-sans mt-1">
                  We respond to all inquiries within 2 hours, day or night.
                </p>
              </div>

              {CONTACT_ITEMS.map(({ icon: Icon, title, value, desc }) => (
                <div
                  key={title}
                  className="group flex gap-3.5 sm:gap-4 p-4 sm:p-5 bg-background/50 border border-gold/10 hover:border-gold/30 rounded-2xl transition-all duration-300 hover:shadow-lg"
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0 group-hover:bg-gold/15 transition-colors">
                    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold" />
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <p className="text-[10px] uppercase tracking-widest text-foreground/40 font-medium">{title}</p>
                    <p className="text-xs sm:text-sm font-semibold text-foreground break-all">{value}</p>
                    <p className="text-[10px] text-foreground/50 font-sans leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Contact Form ── */}
            <div className="lg:col-span-3 bg-background/80 text-foreground p-5 sm:p-8 rounded-2xl border border-gold/20 shadow-2xl">
              <div className="space-y-1 mb-5 sm:mb-6">
                <h2 className="font-editorial text-xl sm:text-2xl text-foreground">Send a Message</h2>
                <p className="text-[10px] text-foreground/40 font-sans">
                  Our Private Guest Relations Director personally reviews every inquiry.
                </p>
              </div>

              {submitted ? (
                <div className="space-y-4 py-8 sm:py-10 text-center">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-400" />
                  </div>
                  <h3 className="font-editorial text-xl sm:text-2xl text-gold">Message Delivered</h3>
                  <p className="text-xs text-foreground/60 leading-relaxed max-w-xs mx-auto font-sans">
                    Thank you, {name}. Our Guest Relations Director has logged your inquiry and will
                    contact you within 2 hours.
                  </p>
                  <button
                    onClick={() => { setSubmitted(false); setMessage(""); }}
                    className="px-6 py-2.5 bg-gold/15 border border-gold/40 text-gold hover:bg-gold hover:text-background text-xs uppercase tracking-widest font-semibold rounded-lg transition-all cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
                  {errorMsg && (
                    <div className="p-3 bg-red-500/10 border border-red-500/40 text-red-400 rounded-lg text-xs font-semibold">
                      {errorMsg}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-widest text-gold font-semibold block">Full Name</label>
                      <input
                        required type="text" value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Lord Sandeep"
                        className="w-full bg-background/80 border border-gold/20 rounded-lg p-2.5 text-xs text-foreground outline-none focus:border-gold transition"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-widest text-gold font-semibold block">Private Email</label>
                      <input
                        required type="email" value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="sandeep@example.com"
                        className="w-full bg-background/80 border border-gold/20 rounded-lg p-2.5 text-xs text-foreground outline-none focus:border-gold transition"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-widest text-gold font-semibold block">Phone (Optional)</label>
                      <input
                        type="tel" value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 555-0199"
                        className="w-full bg-background/80 border border-gold/20 rounded-lg p-2.5 text-xs text-foreground outline-none focus:border-gold transition"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-widest text-gold font-semibold block">Subject</label>
                      <input
                        type="text" value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Villa Concierge Request"
                        className="w-full bg-background/80 border border-gold/20 rounded-lg p-2.5 text-xs text-foreground outline-none focus:border-gold transition"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-widest text-gold font-semibold block">Message</label>
                    <textarea
                      required rows={5} value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Detail your inquiry or requested dates..."
                      className="w-full bg-background/80 border border-gold/20 rounded-lg p-2.5 text-xs text-foreground focus:outline-none focus:border-gold transition resize-none"
                    />
                  </div>

                  <button
                    type="submit" disabled={isSubmitting}
                    className="w-full py-3 bg-gold hover:bg-gold/90 disabled:opacity-50 text-background font-bold text-xs tracking-[0.15em] uppercase transition-all rounded-lg cursor-pointer flex items-center justify-center gap-2 shadow-lg"
                  >
                    {isSubmitting ? "Delivering Message…" : <><span>Deliver Message</span><ArrowRight className="w-3.5 h-3.5" /></>}
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
