import { useState } from "react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import SmoothScrollProvider from "@/components/layout/smooth-scroll-provider";
import { Sparkles, Check, CheckCircle2, Crown, Star, ShieldCheck, ArrowRight, Zap, Gift } from "lucide-react";
import { apiClient, useBanner, handleImageError } from "@/lib/api";
import { Link } from "react-router-dom";

const STATS = [
  { value: "12,000+", label: "Global Patrons", icon: Crown },
  { value: "3", label: "Membership Tiers", icon: Star },
  { value: "150+", label: "Nations Represented", icon: ShieldCheck },
  { value: "24/7", label: "Direct Butler Channel", icon: Zap },
];

const COMPARISON_FEATURES = [
  { name: "Priority Sanctuary Booking", silver: true, gold: true, royal: true },
  { name: "Complimentary Spa Mineral Drinks", silver: true, gold: true, royal: true },
  { name: "Late Checkout (Subject to Availability)", silver: true, gold: true, royal: true },
  { name: "Automatic Suite Upgrades", silver: false, gold: true, royal: true },
  { name: "Complimentary Spa Treatment per Stay", silver: false, gold: true, royal: true },
  { name: "Custom In-Suite Scent & Pillow Menu", silver: false, gold: true, royal: true },
  { name: "24/7 Dedicated Personal Concierge", silver: false, gold: false, royal: true },
  { name: "Unlimited Spa & Wellness Access", silver: false, gold: false, royal: true },
  { name: "Private Jet & Helicopter Logistics", silver: false, gold: false, royal: true },
  { name: "Executive Chef Table & Degustation Buyouts", silver: false, gold: false, royal: true },
];

export default function Membership() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [tier, setTier] = useState("Gold Club");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const heroBanner = useBanner("membership_hero", "/images/Membership_Club.webp");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !email) return;

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      await apiClient.submitInquiry({
        name: `${firstName} ${lastName}`,
        email,
        subject: `Membership Application: ${tier}`,
        message: `Membership Application for ${tier}\nName: ${firstName} ${lastName}\nEmail: ${email}`,
      });
      setSubmitted(true);
    } catch (err: unknown) {
      const error = err as { message?: string };
      setErrorMsg(error.message || "Failed to submit application.");
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
              Elite Association
            </span>
            <h1 className="font-editorial text-3xl sm:text-4xl md:text-6xl text-foreground leading-tight">
              The Sandeep Membership Club
            </h1>
            <p className="text-foreground/60 text-xs sm:text-sm leading-relaxed font-sans max-w-2xl mx-auto">
              Enter a community of global patrons. Secure prioritized reservation access, private aviation arrangements, and invitations to custom culinary and wellness immersions.
            </p>
          </div>

          {/* ── Hero Banner Image ── */}
          {heroBanner.image ? (
            <div className="relative w-full h-64 sm:h-80 md:h-120 rounded-2xl overflow-hidden border border-gold/15 shadow-2xl group">
              <img
                src={heroBanner.image}
                alt={heroBanner.title || "The Sandeep Membership Club"}
                className="w-full h-full object-cover absolute inset-0 group-hover:scale-[1.03] transition-transform duration-700"
                loading="lazy"
                onError={handleImageError}
              />
              <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 sm:bottom-8 sm:left-8 space-y-1">
                <span className="text-gold text-[9px] sm:text-[10px] uppercase tracking-widest font-semibold block">
                  Private Patronage
                </span>
                <p className="font-editorial text-xl sm:text-2xl md:text-3xl text-foreground">
                  Privileges across five continents
                </p>
              </div>
            </div>
          ) : null}

          {/* ── Stats Band ── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-gold/10 rounded-2xl overflow-hidden border border-gold/10">
            {STATS.map(({ value, label, icon: Icon }) => (
              <div key={label} className="bg-background/80 px-3 sm:px-6 py-5 sm:py-8 text-center hover:bg-background transition-colors space-y-1">
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold mx-auto mb-1.5 sm:mb-2" />
                <span className="font-editorial text-2xl sm:text-4xl text-gold block">{value}</span>
                <span className="text-[8px] sm:text-[9px] uppercase tracking-widest text-foreground/40 font-medium">{label}</span>
              </div>
            ))}
          </div>

          {/* ── Membership Tier Cards ── */}
          <div className="space-y-8 sm:space-y-10">
            <div className="text-center space-y-2.5 sm:space-y-3">
              <span className="text-gold tracking-[0.25em] text-[9.5px] sm:text-[10px] uppercase font-semibold block">
                Privilege Tiers
              </span>
              <h2 className="font-editorial text-2xl sm:text-3xl md:text-4xl text-foreground">
                Three Distinct Circles of Patronage
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
              {/* Silver */}
              <div className="bg-background/60 text-foreground p-5 sm:p-8 rounded-2xl border border-gold/15 flex flex-col justify-between hover:scale-[1.02] transition-all duration-300 shadow-lg">
                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <span className="text-foreground/50 tracking-widest text-[9px] uppercase font-semibold">Tier I</span>
                    <h3 className="font-editorial text-2xl sm:text-3xl mt-1 text-foreground">Silver Club</h3>
                    <p className="text-foreground/60 text-xs leading-relaxed mt-2 font-sans">
                      Designed for frequent guests of Sandeep Resorts. Entry-level membership providing standard booking priority.
                    </p>
                  </div>
                  <ul className="space-y-2.5 sm:space-y-3 text-xs text-foreground/80 border-t border-gold/10 pt-4">
                    <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-gold shrink-0" /> Priority booking notifications</li>
                    <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-gold shrink-0" /> Complimentary spa mineral drinks</li>
                    <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-gold shrink-0" /> Late checkout on request</li>
                    <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-gold shrink-0" /> Welcome botanical elixir</li>
                  </ul>
                </div>
                <div className="pt-4 sm:pt-6 border-t border-gold/10 mt-6">
                  <span className="text-[9.5px] sm:text-[10px] text-turquoise tracking-wider font-semibold uppercase block">
                    Enrolled after 3 completed stays
                  </span>
                </div>
              </div>

              {/* Gold */}
              <div className="bg-background/80 text-foreground p-5 sm:p-8 rounded-2xl border-2 border-gold/40 flex flex-col justify-between hover:scale-[1.02] transition-all duration-300 shadow-2xl relative overflow-hidden">
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 px-2.5 sm:px-3 py-0.5 sm:py-1 bg-gold text-background text-[8.5px] sm:text-[9px] uppercase font-bold tracking-widest rounded-full">
                  Most Popular
                </div>
                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <span className="text-gold tracking-widest text-[9px] uppercase font-semibold">Tier II</span>
                    <h3 className="font-editorial text-2xl sm:text-3xl mt-1 text-gold">Gold Club</h3>
                    <p className="text-foreground/60 text-xs leading-relaxed mt-2 font-sans">
                      Elevating your travel with complimentary villa upgrades and personalized in-suite styling requests.
                    </p>
                  </div>
                  <ul className="space-y-2.5 sm:space-y-3 text-xs text-foreground/80 border-t border-gold/10 pt-4">
                    <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-gold shrink-0" /> Automatic suite upgrades on availability</li>
                    <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-gold shrink-0" /> 1 complimentary 90-min spa treatment</li>
                    <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-gold shrink-0" /> Custom in-suite pillow &amp; scent charter</li>
                    <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-gold shrink-0" /> Sunset champagne yacht cruise per visit</li>
                  </ul>
                </div>
                <div className="pt-4 sm:pt-6 border-t border-gold/10 mt-6">
                  <span className="text-[9.5px] sm:text-[10px] text-gold tracking-wider font-semibold uppercase block">
                    Granted after 6 completed stays
                  </span>
                </div>
              </div>

              {/* Royal Diamond */}
              <div className="bg-linear-to-br from-[#18120a] via-background to-[#18120a] text-foreground p-5 sm:p-8 rounded-2xl border-2 border-gold flex flex-col justify-between hover:scale-[1.02] transition-all duration-300 shadow-2xl relative overflow-hidden">
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-gold/15 rounded-full blur-2xl pointer-events-none" />
                <div className="space-y-4 sm:space-y-6 relative z-10">
                  <div>
                    <div className="flex items-center gap-2">
                      <Crown className="w-4 h-4 text-gold" />
                      <span className="text-gold tracking-widest text-[9px] uppercase font-semibold">Tier III</span>
                    </div>
                    <h3 className="font-editorial text-2xl sm:text-3xl mt-1 text-gold">Royal Diamond</h3>
                    <p className="text-foreground/60 text-xs leading-relaxed mt-2 font-sans">
                      The peak of luxury hospitality. Unlimited spa access, private jet logistics, and private chef dinners.
                    </p>
                  </div>
                  <ul className="space-y-2.5 sm:space-y-3 text-xs text-foreground/80 border-t border-gold/15 pt-4">
                    <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-gold shrink-0" /> 24/7 dedicated personal butler concierge</li>
                    <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-gold shrink-0" /> Unlimited spa &amp; wellness program access</li>
                    <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-gold shrink-0" /> Private jet &amp; helicopter logistics</li>
                    <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-gold shrink-0" /> Michelin Chef table in-villa degustations</li>
                  </ul>
                </div>
                <div className="pt-4 sm:pt-6 border-t border-gold/15 mt-6 relative z-10">
                  <span className="text-[9.5px] sm:text-[10px] text-gold tracking-wider font-semibold uppercase block">
                    By Invitation or Board Approval
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Comparison Table ── */}
          <div className="space-y-6 sm:space-y-8 border-t border-gold/10 pt-12 sm:pt-16">
            <div className="text-center space-y-2.5 sm:space-y-3">
              <span className="text-gold tracking-[0.25em] text-[9.5px] sm:text-[10px] uppercase font-semibold block">
                Privilege Matrix
              </span>
              <h2 className="font-editorial text-2xl sm:text-3xl md:text-4xl text-foreground">
                Compare Member Benefits
              </h2>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-gold/15 bg-background/50">
              <table className="w-full min-w-135 text-left text-xs text-foreground">
                <thead>
                  <tr className="border-b border-gold/15 bg-gold/5">
                    <th className="p-3.5 sm:p-4 font-semibold text-foreground/60 uppercase tracking-widest text-[9.5px] sm:text-[10px]">Benefit</th>
                    <th className="p-3.5 sm:p-4 font-semibold text-foreground/80 text-center uppercase tracking-widest text-[9.5px] sm:text-[10px]">Silver</th>
                    <th className="p-3.5 sm:p-4 font-semibold text-gold text-center uppercase tracking-widest text-[9.5px] sm:text-[10px]">Gold</th>
                    <th className="p-3.5 sm:p-4 font-semibold text-gold text-center uppercase tracking-widest text-[9.5px] sm:text-[10px]">Royal Diamond</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold/10">
                  {COMPARISON_FEATURES.map((row) => (
                    <tr key={row.name} className="hover:bg-gold/5 transition-colors">
                      <td className="p-3.5 sm:p-4 font-sans text-foreground/80">{row.name}</td>
                      <td className="p-3.5 sm:p-4 text-center">
                        {row.silver ? <Check className="w-4 h-4 text-gold mx-auto" /> : <span className="text-foreground/20">—</span>}
                      </td>
                      <td className="p-3.5 sm:p-4 text-center">
                        {row.gold ? <Check className="w-4 h-4 text-gold mx-auto" /> : <span className="text-foreground/20">—</span>}
                      </td>
                      <td className="p-3.5 sm:p-4 text-center">
                        {row.royal ? <Check className="w-4 h-4 text-gold mx-auto" /> : <span className="text-foreground/20">—</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Form Section ── */}
          <div className="max-w-xl mx-auto bg-background/80 text-foreground p-5 sm:p-8 md:p-12 rounded-2xl border border-gold/20 shadow-2xl space-y-5 sm:space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-gold" />
              </div>
              <div>
                <h3 className="font-editorial text-xl sm:text-2xl text-foreground">Apply for Club Entry</h3>
                <p className="text-[10px] text-foreground/50 font-sans">Board credential checks take up to 3 business days.</p>
              </div>
            </div>

            {submitted ? (
              <div className="space-y-4 py-6 sm:py-8 text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-400" />
                </div>
                <h4 className="font-editorial text-xl sm:text-2xl text-gold">Application Submitted</h4>
                <p className="text-xs text-foreground/70 leading-relaxed max-w-xs mx-auto font-sans">
                  Thank you, {firstName}. Our Membership Charter Board will review your credentials and contact you within 3 business days.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2.5 border border-gold text-gold hover:bg-gold hover:text-background text-xs uppercase tracking-widest font-semibold rounded-xl transition-all cursor-pointer"
                >
                  Submit Another Application
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
                    <label className="text-[9px] uppercase tracking-widest text-gold font-semibold block">First Name</label>
                    <input
                      required
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Lord"
                      className="w-full bg-background border border-gold/20 rounded-xl p-2.5 sm:p-3 text-xs text-foreground focus:border-gold outline-none transition"
                    />
                  </div>
                  <div className="space-y-1 sm:space-y-1.5">
                    <label className="text-[9px] uppercase tracking-widest text-gold font-semibold block">Last Name</label>
                    <input
                      required
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Sandeep"
                      className="w-full bg-background border border-gold/20 rounded-xl p-2.5 sm:p-3 text-xs text-foreground focus:border-gold outline-none transition"
                    />
                  </div>
                </div>

                <div className="space-y-1 sm:space-y-1.5">
                  <label className="text-[9px] uppercase tracking-widest text-gold font-semibold block">Private Email</label>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sandeep@example.com"
                    className="w-full bg-background border border-gold/20 rounded-xl p-2.5 sm:p-3 text-xs text-foreground focus:border-gold outline-none transition"
                  />
                </div>

                <div className="space-y-1 sm:space-y-1.5">
                  <label className="text-[9px] uppercase tracking-widest text-gold font-semibold block">Target Club Tier</label>
                  <select
                    value={tier}
                    onChange={(e) => setTier(e.target.value)}
                    className="w-full bg-background border border-gold/20 rounded-xl p-2.5 sm:p-3 text-xs text-foreground cursor-pointer focus:border-gold outline-none transition"
                  >
                    <option value="Gold Club">Gold Club (Review required)</option>
                    <option value="Royal Diamond">Royal Diamond (Strict credentials check)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 sm:py-3.5 bg-gold hover:bg-gold/90 disabled:opacity-50 text-background font-bold text-xs tracking-[0.15em] uppercase transition-all duration-300 rounded-xl cursor-pointer shadow-lg flex items-center justify-center gap-2"
                >
                  {isSubmitting ? "Submitting Application..." : (
                    <>
                      <span>Submit Membership Application</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

        </div>
      </main>
      <Footer />
    </SmoothScrollProvider>

  );
}
