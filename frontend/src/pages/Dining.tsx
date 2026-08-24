import { useEffect, useState } from "react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import SmoothScrollProvider from "@/components/layout/smooth-scroll-provider";
import ServiceBookingModal from "@/components/ui/service-booking-modal";
import { Utensils, Clock, CheckCircle2, CalendarCheck, Sparkles, ChefHat, Wine, Flame, ArrowRight } from "lucide-react";
import { apiClient, Service, getBackendImageUrl, useBanner, handleImageError } from "@/lib/api";
import { Link } from "react-router-dom";

const CULINARY_PILLARS = [
  {
    icon: ChefHat,
    title: "Michelin Resident Chefs",
    desc: "Visiting culinary masters craft 7-course seasonal degustations highlighting hyper-local ingredients.",
  },
  {
    icon: Wine,
    title: "Sommelier Cellars",
    desc: "Over 2,400 rare vintage bottles stored in temperature-controlled volcanic rock and sandstone caves.",
  },
  {
    icon: Flame,
    title: "Destination Tables",
    desc: "Dine on submerged reef platforms, private sandbanks under starlight, or edge-of-cliff pavilions.",
  },
];

function getDiningServiceImage(service: Service): string {
  return service.image ? getBackendImageUrl(service.image) : "";
}

const DINING_KEYWORDS = [
  "dining", "dinner", "banquet", "wine", "culinary", "chef", "tasting",
  "seafood", "food", "cook", "kaiseki", "menu", "sommelier", "table",
  "bar", "champagne", "gastronomy", "cruise", "barbecue", "breakfast", "tajine"
];

export default function Dining() {
  const [diningServices, setDiningServices] = useState<Service[]>([]);
  const [sanctuary, setSanctuary] = useState("Maldives Private Pavilion");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("19:00");
  const [guestCount, setGuestCount] = useState("2 Guests");
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const heroBanner = useBanner("dining_hero", "/images/dining_hero.webp");

  useEffect(() => {
    setLoading(true);
    apiClient.getServices("dining")
      .then((data) => {
        const filtered = data.filter((s) => {
          const text = (s.name + " " + s.description).toLowerCase();
          return DINING_KEYWORDS.some((kw) => text.includes(kw));
        });
        setDiningServices(filtered);
      })
      .catch((err) => {
        console.error("Failed to load dining services:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleOpenBooking = (serviceName: string) => {
    setSelectedService(serviceName);
    setIsModalOpen(true);
  };

  const handleReserve = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      await apiClient.submitInquiry({
        name: "Valued Guest",
        email: "guest@sandeepresorts.com",
        resort: sanctuary,
        subject: `Table Reservation: ${sanctuary}`,
        message: `Sanctuary: ${sanctuary}\nDate: ${date}\nTime: ${time}\nGuests: ${guestCount}`,
      });
      setSubmitted(true);
    } catch (err: unknown) {
      const error = err as { message?: string };
      setErrorMsg(error.message || "Failed to submit reservation.");
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
              Michelin Gastronomy
            </span>
            <h1 className="font-editorial text-3xl sm:text-4xl md:text-6xl text-foreground leading-tight">
              Fine Dining Experiences
            </h1>
            <p className="text-foreground/60 text-xs sm:text-sm leading-relaxed font-sans max-w-2xl mx-auto">
              Indulge in seasonal culinary masterpieces crafted by world-class visiting chefs.
              Savor private tastings arranged at cliffside tables, sandbanks, or inside your secluded pavilion.
            </p>
          </div>

          {/* ── Featured Dining Banner Image ── */}
          {heroBanner.image ? (
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gold/20 h-72 sm:h-105 md:h-130 group">
              <img
                src={heroBanner.image}
                alt={heroBanner.title || "Michelin Star Cliffside Fine Dining"}
                className="w-full h-full object-cover absolute inset-0 group-hover:scale-[1.03] transition-transform duration-700"
                loading="lazy"
                onError={handleImageError}
              />

              <div className="absolute inset-0 bg-linear-to-t from-background via-background/30 to-transparent flex items-end p-5 sm:p-8 md:p-14">
                <div className="space-y-1.5 sm:space-y-2 max-w-xl">
                  <span className="text-gold text-[9px] sm:text-[10px] uppercase tracking-[0.25em] block font-semibold">
                    Destination Tables
                  </span>
                  <h2 className="font-editorial text-2xl sm:text-3xl md:text-4xl text-foreground">
                    Oceanfront Gastronomy &amp; Sommelier Pairings
                  </h2>
                  <p className="text-foreground/50 text-[11px] sm:text-xs font-sans">
                    Uninterrupted horizons meet bespoke 7-course tastings paired with reserve vintage cellar selections.
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          {/* ── Culinary Pillars ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
            {CULINARY_PILLARS.map(({ icon: Icon, title, desc }, idx) => (
              <div
                key={title}
                className={`group p-5 sm:p-6 bg-background/60 border border-gold/10 hover:border-gold/30 rounded-2xl transition-all duration-300 hover:shadow-lg space-y-2.5 sm:space-y-3 text-center ${idx === 2 ? "sm:col-span-2 md:col-span-1" : ""}`}
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto group-hover:bg-gold/15 transition-colors">
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-gold" />
                </div>
                <h3 className="font-editorial text-base sm:text-lg text-foreground">{title}</h3>
                <p className="text-xs text-foreground/55 leading-relaxed font-sans">{desc}</p>
              </div>
            ))}
          </div>

          {/* ── Services Section ── */}
          <section className="space-y-8 sm:space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-2.5 sm:space-y-3">
              <span className="text-gold text-[9.5px] sm:text-[10px] uppercase tracking-[0.28em] block font-semibold">
                Culinary Portfolio
              </span>
              <h2 className="font-editorial text-2xl sm:text-3xl md:text-4xl text-foreground">
                Farm-to-Horizon Excellence
              </h2>
              <p className="text-xs md:text-sm text-foreground/60 leading-relaxed font-sans max-w-xl mx-auto">
                Our estate gardens produce fresh organic herbs and produce daily, paired with ocean delicacies delivered directly by regional fishermen.
              </p>
            </div>

            {/* Services Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-background border border-gold/10 rounded-2xl overflow-hidden p-6 space-y-4 animate-pulse">
                    <div className="h-52 bg-gold/10 rounded-xl w-full" />
                    <div className="h-6 bg-foreground/10 rounded w-3/4" />
                    <div className="h-4 bg-foreground/10 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {diningServices.map((service) => {
                  const imgSrc = getDiningServiceImage(service);
                  return (
                    <div
                      key={service.id}
                      className="group bg-background border border-gold/15 hover:border-gold/40 transition-all duration-500 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl flex flex-col justify-between"
                    >
                      <div>
                        <div className="relative h-48 sm:h-56 w-full overflow-hidden border-b border-gold/10">
                          {imgSrc ? (
                            <img
                              src={getBackendImageUrl(imgSrc)}
                              alt={service.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 absolute inset-0"
                              loading="lazy"
                              onError={handleImageError}
                            />
                          ) : null}
                          <div className="absolute inset-0 bg-linear-to-t from-background/90 via-transparent to-transparent opacity-80" />
                          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-background/80 backdrop-blur-md border border-gold/30 flex items-center justify-center shadow-lg">
                            <Utensils className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold" />
                          </div>
                        </div>

                        <div className="p-4 sm:p-6 space-y-2 sm:space-y-3">
                          <h4 className="font-editorial text-lg sm:text-xl text-foreground font-semibold">{service.name}</h4>
                          <p className="text-xs text-foreground/65 leading-relaxed font-sans">{service.description}</p>
                        </div>
                      </div>

                      <div className="p-4 sm:p-6 pt-0">
                        <button
                          onClick={() => handleOpenBooking(service.name)}
                          className="w-full py-2.5 sm:py-3 px-4 border border-gold/30 text-gold hover:bg-gold hover:text-background text-[10px] uppercase tracking-widest font-semibold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <CalendarCheck className="w-3.5 h-3.5" /> Book Table / Experience &rarr;
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* ── Table Reservations Form ── */}
          <section className="border-t border-gold/15 pt-12 sm:pt-16">
            <div className="max-w-4xl mx-auto bg-background/80 text-foreground p-5 sm:p-8 md:p-14 border border-gold/20 rounded-2xl shadow-2xl space-y-6 sm:space-y-8">
              <div className="text-center space-y-2.5 sm:space-y-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto">
                  <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-gold" />
                </div>
                <span className="text-gold tracking-[0.25em] text-[9.5px] sm:text-[10px] uppercase font-semibold block">
                  Priority Allocation
                </span>
                <h3 className="font-editorial text-2xl sm:text-3xl md:text-4xl text-foreground">Table &amp; Culinary Reservations</h3>
                <p className="text-xs text-foreground/60 leading-relaxed font-sans max-w-md mx-auto">
                  Specify your destination sanctuary, preferred date, time slot, and guest count. Our Executive Chef will customize your dining placement.
                </p>
              </div>

              {submitted ? (
                <div className="space-y-4 py-6 sm:py-8 text-center">
                  <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 text-gold mx-auto" />
                  <h4 className="font-editorial text-xl sm:text-2xl text-gold">Table Reserved</h4>
                  <p className="text-xs text-foreground/70 leading-relaxed max-w-xs mx-auto font-sans">
                    Thank you. Our Culinary Director will reach out to confirm your table placement and customized tasting menu.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-2.5 border border-gold text-gold hover:bg-gold hover:text-background text-xs uppercase tracking-widest font-semibold rounded-xl transition-all cursor-pointer"
                  >
                    Book Another Table
                  </button>
                </div>
              ) : (
                <form onSubmit={handleReserve} className="space-y-4 sm:space-y-6 max-w-2xl mx-auto">
                  {errorMsg && (
                    <div className="p-3 bg-red-500/10 border border-red-500/40 text-red-400 rounded-xl text-xs font-semibold">
                      {errorMsg}
                    </div>
                  )}

                  <div className="space-y-1 sm:space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest text-gold font-semibold block">Select Sanctuary</label>
                    <select
                      value={sanctuary}
                      onChange={(e) => setSanctuary(e.target.value)}
                      className="w-full bg-background border border-gold/25 rounded-xl p-2.5 sm:p-3 text-xs text-foreground focus:border-gold outline-none transition cursor-pointer"
                    >
                      <option value="Maldives Private Pavilion">Maldives Private Pavilion</option>
                      <option value="Bora Bora Overwater Lagoon">Bora Bora Overwater Lagoon</option>
                      <option value="Seychelles Granite Sanctuary">Seychelles Granite Sanctuary</option>
                      <option value="Serengeti Wildlife Sanctuary">Serengeti Wildlife Sanctuary</option>
                      <option value="Himalayan Cloud Ridge">Himalayan Cloud Ridge</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                    <div className="space-y-1 sm:space-y-1.5">
                      <label className="text-[10px] uppercase tracking-widest text-gold font-semibold block">Date</label>
                      <input
                        required
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full bg-background border border-gold/25 rounded-xl p-2.5 sm:p-3 text-xs text-foreground focus:border-gold outline-none transition cursor-pointer"
                      />
                    </div>
                    <div className="space-y-1 sm:space-y-1.5">
                      <label className="text-[10px] uppercase tracking-widest text-gold font-semibold block">Time</label>
                      <input
                        required
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="w-full bg-background border border-gold/25 rounded-xl p-2.5 sm:p-3 text-xs text-foreground focus:border-gold outline-none transition cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="space-y-1 sm:space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest text-gold font-semibold block">Guest Count</label>
                    <select
                      value={guestCount}
                      onChange={(e) => setGuestCount(e.target.value)}
                      className="w-full bg-background border border-gold/25 rounded-xl p-2.5 sm:p-3 text-xs text-foreground focus:border-gold outline-none transition cursor-pointer"
                    >
                      <option value="2 Guests">2 Guests (Intimate Dining)</option>
                      <option value="4 Guests">4 Guests (Family Table)</option>
                      <option value="6 Guests">6 Guests (Private Pavilion)</option>
                      <option value="8+ Guests (Private Event)">8+ Guests (Exclusive Banquet)</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 sm:py-4 bg-gold hover:bg-gold/90 text-background font-bold text-xs tracking-[0.18em] uppercase transition-all duration-300 cursor-pointer disabled:opacity-50 shadow-xl rounded-xl flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? "Submitting Request..." : (
                      <>
                        <span>Submit Reservation Request</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </section>

        </div>
      </main>

      <ServiceBookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        serviceName={selectedService || undefined}
      />

      <Footer />
    </SmoothScrollProvider>
  );
}

