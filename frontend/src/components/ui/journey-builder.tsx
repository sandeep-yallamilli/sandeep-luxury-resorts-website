import { useState, useEffect } from "react";
import { Compass, Sparkles, Check, ChevronRight, ChevronLeft, MapPin } from "lucide-react";
import { apiClient, getBackendImageUrl, handleImageError } from "@/lib/api";

interface Step {
  title: string;
  description: string;
}

const STEPS: Step[] = [
  { title: "Destination", description: "Select your private sanctuary" },
  { title: "Villa Collection", description: "Choose your suite or pavilion" },
  { title: "Experiences", description: "Enrich your stay with curated activities" },
  { title: "Bespoke Details", description: "Specify dates and guest count" },
  { title: "Review", description: "Your custom luxury itinerary" }
];

const DESTINATIONS = [
  { id: "maldives", name: "Sandeep Maldives Private Pavilion", region: "Indian Ocean", image: "/images/maldives.webp" },
  { id: "borabora", name: "Sandeep Bora Bora Overwater Lagoon", region: "Oceania", image: "/images/borabora.webp" },
  { id: "seychelles", name: "Sandeep Seychelles Granite Ocean Sanctuary", region: "Indian Ocean", image: "/images/seychelles.webp" },
  { id: "serengeti", name: "Sandeep Serengeti Wildlife Sanctuary", region: "Africa", image: "/images/serengeti.webp" },
  { id: "marrakech", name: "Sandeep Marrakech Royal Oasis Riad", region: "Africa", image: "/images/marrakech.webp" },
  { id: "zanzibar", name: "Sandeep Zanzibar Spice Island Resort", region: "Africa", image: "/images/zanzibar.webp" },
  { id: "rajasthan", name: "Sandeep Rajasthan Desert Tent", region: "India", image: "/images/rajasthan.webp" },
  { id: "kerala", name: "Sandeep Kerala Backwaters Wellness Retreat", region: "India", image: "/images/kerala.webp" },
  { id: "himalayas", name: "Sandeep Himalayan Cedar & Snow Sanctuary", region: "India", image: "/images/himalayas.webp" },
  { id: "bali", name: "Sandeep Bali Forest Sanctuary", region: "Southeast Asia", image: "/images/bali.webp" },
  { id: "kyoto", name: "Sandeep Kyoto Zen Pavilion", region: "East Asia", image: "/images/kyoto.webp" },
  { id: "thailand", name: "Sandeep Thailand Emerald Bay Cliff Sanctuary", region: "Southeast Asia", image: "/images/thailand.webp" },
  { id: "alps", name: "Sandeep Alps Snow Chalet", region: "Europe", image: "/images/alps.webp" },
  { id: "santorini", name: "Sandeep Santorini Caldera Cliffside", region: "Europe", image: "/images/santorini.webp" },
  { id: "amalfi", name: "Sandeep Amalfi Coast Cliff Manor", region: "Europe", image: "/images/amalfi.webp" },
  { id: "fiji", name: "Sandeep Fiji Private Island Sanctuary", region: "Oceania", image: "/images/fiji.webp" }
];

const VILLAS: Record<string, { id: string; name: string; price: number; desc: string }[]> = {
  maldives: [
    { id: "m1", name: "Royal Overwater Pavilion", price: 3800, desc: "Suspended above crystalline lagoons with absolute privacy." },
    { id: "m2", name: "Ocean Sanctuary Pool Villa", price: 2900, desc: "Direct ocean access, glass flooring panels, personal chef." }
  ],
  fiji: [
    { id: "fj1", name: "Sandeep Fiji Yasawa Sunset Lagoon Villa", price: 4500, desc: "Perched over pristine turquoise South Pacific lagoons with overwater plunge pool and coral reef access." },
    { id: "fj2", name: "Yasawa Private Beachfront Sanctuary", price: 3800, desc: "Direct white-sand beachfront access, private infinity pool, and Polynesian butler." }
  ],
  bali: [
    { id: "b1", name: "Sacred Valley Ridge Mansion", price: 3200, desc: "Infinity pool hovering over river canyons, private temple." },
    { id: "b2", name: "Ayung Canopy Treehouse", price: 3600, desc: "Surrounded by ancient banyan trees, open-air stone bath." }
  ],
  kyoto: [
    { id: "k1", name: "Heian Emperors Pavilion", price: 3500, desc: "Constructed with cypress wood, overlooking 400-year-old rock gardens." },
    { id: "k2", name: "Arashiyama Bamboo Onsen Villa", price: 4900, desc: "Traditional tatami, luxury shoji screens, mineral spring onsen." }
  ],
  alps: [
    { id: "a1", name: "Matterhorn Peak Penthouse", price: 4200, desc: "Panoramic mountain glass dome, stone fireplace, outdoor hot tub." },
    { id: "a2", name: "Engadin Forest Lodge", price: 3100, desc: "Aged pine wood framing, private sauna, ski-in/ski-out terrace." }
  ],
  rajasthan: [
    { id: "r1", name: "Maharaja Royal Tent Suite", price: 2800, desc: "Hand-carved rosewood posts, silk-embroidered walls, tiger safari access." },
    { id: "r2", name: "Maharaja Royal Palace Villa", price: 3900, desc: "Overlooking ancient ruins, copper bath, local personal butler." }
  ],
  santorini: [
    { id: "s1", name: "Caldera Sunset Pavilion", price: 3700, desc: "White-washed cave suite with private caldera plunge pool." },
    { id: "s2", name: "Aegean Royal Cave Villa", price: 5400, desc: "Cliffside infinity pool with volcanic vineyard tasting cellar." }
  ],
  amalfi: [
    { id: "am1", name: "Positano Cliff Manor", price: 4100, desc: "Terraced citrus garden villa hanging high above Tyrrhenian Sea." },
    { id: "am2", name: "Tyrrhenian Royal Penthouse", price: 6200, desc: "Private Riva yacht access and 7-course Michelin lemon garden table." }
  ],
  borabora: [
    { id: "bb1", name: "Otemanu Lagoon Villa", price: 4600, desc: "Overwater coral bungalow under Mount Otemanu peak." },
    { id: "bb2", name: "Polynesian Royal Coral Residence", price: 7500, desc: "Glass floor viewing chamber with outrigger canoe butler delivery." }
  ],
  serengeti: [
    { id: "sr1", name: "Savanna Horizon Suite", price: 3300, desc: "Tented luxury pavilion along Great Migration wildlife trail." },
    { id: "sr2", name: "Great Migration Royal Safari Pavilion", price: 5100, desc: "Private ranger tracking jeep and dawn hot air balloon safari." }
  ],
  seychelles: [
    { id: "sy1", name: "Seychelles Granite Ocean Pavilion", price: 4400, desc: "Private granite cliffside villa overlooking pristine Indian Ocean reserves." },
    { id: "sy2", name: "Praslin Coral Cove Residence", price: 5200, desc: "Secluded granite beach cove with private tortoise sanctuary access." }
  ],
  marrakech: [
    { id: "mr1", name: "Marrakech Royal Imperial Riad", price: 3800, desc: "Opulent terracotta palace riad surrounded by olive groves and marble hammams." },
    { id: "mr2", name: "Atlas Mountain View Suite", price: 4300, desc: "Private courtyard plunge pool and rooftop stargazing deck." }
  ],
  zanzibar: [
    { id: "zn1", name: "Zanzibar Sultan Beach Pavilion", price: 3500, desc: "Pristine white-sand coral reef beach sanctuary with carved mahogany doors." },
    { id: "zn2", name: "Spice Island Royal Ocean Villa", price: 4100, desc: "Private dhow boat charter and spice garden wellness baths." }
  ],
  kerala: [
    { id: "kr1", name: "Kerala Heritage Backwater Villa", price: 3200, desc: "Floating teak houseboats and private palm-lined wellness villas." },
    { id: "kr2", name: "Vembanad Lotus Lake Sanctuary", price: 3700, desc: "Ayurvedic Panchakarma spa center and serene backwaters deck." }
  ],
  himalayas: [
    { id: "hm1", name: "Himalayan Snow Peak Cedar Chalet", price: 3600, desc: "Pine-scented cedar chalets with thermal hot spring bath in snow valleys." },
    { id: "hm2", name: "Sherpa Summit Starlight Lodge", price: 4200, desc: "High-altitude glass observatory framing snowy Himalayan peaks." }
  ],
  thailand: [
    { id: "th1", name: "Thailand Emerald Cliffside Pool Villa", price: 3400, desc: "Secluded limestone ocean cliffside villas surrounded by emerald Andaman Sea." },
    { id: "th2", name: "Phang Nga Royal Horizon Villa", price: 4100, desc: "Private longtail boat excursions and cliffside infinity plunge pool." }
  ]
};


const EXPERIENCES = [
  { id: "spa", name: "Ayurvedic Spa & Detox Journey", price: 650, icon: Sparkles, desc: "Bespoke herbal baths, massages, and organic detox meals." },
  { id: "yacht", name: "Private Sunset Yacht Charter", price: 1800, icon: Compass, desc: "Champagne, private sommelier, and personalized cruising route." },
  { id: "helicopter", name: "Helicopter Mountain Safari", price: 2200, icon: Compass, desc: "Aerial sightseeing followed by private landing champagne picnic." },
  { id: "culinary", name: "Michelin-Chef Culinary Masterclass", price: 500, icon: Sparkles, desc: "Private cooking experience utilizing estate-harvested microgreens." }
];

export default function JourneyBuilder() {
  const [currentStep, setCurrentStep] = useState(0);
  const [destinations, setDestinations] = useState<typeof DESTINATIONS>(DESTINATIONS);
  const [selectedDest, setSelectedDest] = useState(DESTINATIONS[0]);
  const [selectedVilla, setSelectedVilla] = useState(VILLAS.maldives[0]);
  const [selectedExps, setSelectedExps] = useState<string[]>([]);
  const [checkIn, setCheckIn] = useState("");
  const [nights, setNights] = useState(3);
  const [guests, setGuests] = useState(2);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    apiClient.getResorts().then((resorts) => {
      if (resorts && resorts.length > 0) {
        const mapped = resorts.map((r) => ({
          id: r.slug,
          name: r.name,
          region: r.region,
          image: r.image || "",
        }));
        // Merge API resorts into signature DESTINATIONS map so all 16 destinations remain present
        const mergedMap = new Map<string, typeof DESTINATIONS[0]>();
        DESTINATIONS.forEach(d => mergedMap.set(d.id, d));
        mapped.forEach(m => {
          const existing = mergedMap.get(m.id);
          mergedMap.set(m.id, existing ? { ...existing, ...m } : m);
        });
        const merged = Array.from(mergedMap.values());
        setDestinations(merged);
        setSelectedDest(merged[0]);
      }
    }).catch(console.error);
  }, []);

  const handleDestSelect = (dest: typeof DESTINATIONS[0]) => {
    setSelectedDest(dest);
    // Reset villa choice to match new destination
    const availableVillas = VILLAS[dest.id as keyof typeof VILLAS] || VILLAS.maldives;
    if (availableVillas && availableVillas.length > 0) {
      setSelectedVilla(availableVillas[0]);
    }
  };

  const handleExpToggle = (id: string) => {
    setSelectedExps(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const calculateTotal = () => {
    let base = selectedVilla.price * nights;
    selectedExps.forEach(expId => {
      const exp = EXPERIENCES.find(e => e.id === expId);
      if (exp) base += exp.price;
    });
    return base;
  };

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email) return;
    try {
      await apiClient.submitInquiry({
        name: fullName,
        email,
        resort: selectedDest.name,
        subject: `Bespoke Journey: ${selectedDest.name} - ${selectedVilla.name}`,
        message: `Sanctuary: ${selectedDest.name}\nVilla: ${selectedVilla.name}\nArrival Date: ${checkIn || 'TBD'}\nNights: ${nights}\nGuests: ${guests}\nSelected Experiences: ${selectedExps.join(', ') || 'None'}\nEst Investment: $${calculateTotal()}`,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setFormSubmitted(true);
    }
  };

  return (
    <div className="w-full bg-background text-foreground rounded-2xl border border-gold/25 overflow-hidden shadow-2xl max-w-6xl mx-auto">

      {/* Header and Step Indicator */}
      <div className="p-4 sm:p-6 md:p-8 border-b border-gold/20 bg-background/90">
        <span className="text-gold text-[10px] sm:text-xs tracking-widest uppercase block mb-1 font-bold">Tailored Hospitality</span>
        <h3 className="font-editorial text-2xl sm:text-3xl md:text-4xl text-foreground mb-4 sm:mb-5 font-semibold">Luxury Journey Builder</h3>

        {/* Visual Progress Steps */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3">
          {STEPS.map((step, idx) => {
            const isActive = idx === currentStep;
            const isCompleted = idx < currentStep;
            return (
              <div
                key={step.title}
                className={`p-2.5 sm:p-3 rounded-xl border transition-all duration-300 ${isActive
                  ? "border-gold bg-gold/10 shadow-md ring-1 ring-gold/40"
                  : isCompleted
                    ? "border-turquoise/50 bg-turquoise/10"
                    : "border-gold/15 bg-background/50"
                  } ${idx === 4 ? "col-span-2 sm:col-span-1" : ""}`}
              >
                <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
                  <span className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center text-[9px] sm:text-[10px] font-bold shrink-0 ${isActive
                    ? "bg-gold text-slate-950 font-extrabold"
                    : isCompleted
                      ? "bg-turquoise text-slate-950 font-extrabold"
                      : "bg-gold/15 text-foreground/80 font-bold"
                    }`}>
                    {isCompleted ? <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-3" /> : idx + 1}
                  </span>
                  <span className={`text-[11px] sm:text-xs font-bold truncate ${isActive ? "text-gold" : isCompleted ? "text-turquoise" : "text-foreground/80"}`}>
                    {step.title}
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-foreground/75 leading-snug hidden md:block">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-4 sm:p-6 md:p-8 min-h-80">
        {formSubmitted ? (
          <div className="text-center py-8 sm:py-10 animate-fade-in-up">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gold/15 border border-gold rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-5 shadow-inner">
              <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-gold" />
            </div>
            <h4 className="font-editorial text-2xl sm:text-3xl md:text-4xl text-gold mb-2 sm:mb-3 font-semibold">Itinerary Compiled</h4>

            <p className="text-foreground/90 text-sm max-w-md mx-auto mb-8 leading-relaxed font-medium">
              Thank you, <span className="text-gold font-bold">{fullName}</span>. Our lead Customer Experience Director is personally auditing your bespoke itinerary for <span className="text-gold font-bold">{selectedDest.name}</span>. A detailed draft has been dispatched to <span className="text-gold font-bold">{email}</span>.
            </p>
            <div className="glass-panel p-6 rounded-xl border border-gold/25 max-w-sm mx-auto text-left shadow-lg">
              <h5 className="font-editorial text-xl text-foreground font-semibold mb-3 border-b border-gold/20 pb-2">Itinerary Summary</h5>
              <div className="space-y-2 text-xs text-foreground/90 font-medium">
                <p><strong className="text-gold">Destination:</strong> {selectedDest.name}</p>
                <p><strong className="text-gold">Villa:</strong> {selectedVilla.name}</p>
                <p><strong className="text-gold">Duration:</strong> {nights} Nights | {guests} Guests</p>
                <p><strong className="text-gold">Experiences:</strong> {selectedExps.length > 0 ? selectedExps.map(id => EXPERIENCES.find(e => e.id === id)?.name).join(", ") : "None Selected"}</p>
                <p className="border-t border-gold/20 pt-2 text-gold font-bold text-sm"><strong className="text-foreground">Est. Investment:</strong> ${calculateTotal().toLocaleString()}</p>
              </div>
            </div>
            <button
              onClick={() => { setFormSubmitted(false); setCurrentStep(0); setSelectedExps([]); }}
              className="mt-8 px-7 py-3 border border-gold text-gold hover:bg-gold hover:text-slate-950 text-xs tracking-widest uppercase font-bold transition-all duration-300 cursor-pointer rounded-lg shadow-md"
            >
              Build Another Itinerary
            </button>
          </div>
        ) : (
          <>
            {/* STEP 1: Select Destination */}
            {currentStep === 0 && (
              <div className="space-y-4">
                <p className="text-sm font-semibold text-foreground/90">Where should we prepare your welcome?</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
                  {destinations.map((dest) => (
                    <div
                      key={dest.id}
                      onClick={() => handleDestSelect(dest)}
                      className={`group cursor-pointer rounded-xl overflow-hidden border transition-all duration-300 relative h-40 md:h-48 ${selectedDest.id === dest.id ? "border-gold shadow-2xl ring-2 ring-gold/50 scale-[1.01]" : "border-gold/20 hover:border-gold/50"
                        }`}
                    >
                      {dest.image ? (
                        <img src={getBackendImageUrl(dest.image)} alt={dest.name} className="absolute inset-0 w-full h-full object-cover img-clear group-hover:scale-105 transition-transform duration-700" loading="eager" onError={handleImageError} />
                      ) : null}
                      <div className="absolute inset-0 bg-linear-to-t from-slate-950/85 via-slate-950/20 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4 z-10">
                        <span className="text-gold text-[10px] tracking-widest uppercase font-bold block mb-0.5 drop-shadow-md">{dest.region}</span>
                        <h4 className="font-editorial text-lg text-white group-hover:text-gold transition-colors font-semibold drop-shadow-md">{dest.name}</h4>
                      </div>
                      {selectedDest.id === dest.id && (
                        <div className="absolute top-3 right-3 bg-gold text-slate-950 w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-md">
                          <Check className="w-3.5 h-3.5 stroke-3" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}


            {/* STEP 2: Select Villa */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <p className="text-sm font-semibold text-foreground/90">Selected Sanctuary: <strong className="text-gold font-bold">{selectedDest.name}</strong></p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {VILLAS[selectedDest.id as keyof typeof VILLAS]?.map((villa) => {
                    const isSelected = selectedVilla.id === villa.id;
                    return (
                      <div
                        key={villa.id}
                        onClick={() => setSelectedVilla(villa)}
                        className={`p-6 rounded-xl border cursor-pointer transition-all duration-300 flex flex-col justify-between ${isSelected ? "border-gold bg-gold/10 shadow-xl ring-1 ring-gold/40" : "border-gold/20 hover:border-gold/40 bg-background/60"
                          }`}
                      >
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-editorial text-2xl text-foreground font-semibold">{villa.name}</h4>
                            <span className="text-gold font-editorial text-xl font-bold">${villa.price.toLocaleString()} <span className="text-xs text-foreground/80 font-sans font-normal">/ night</span></span>
                          </div>
                          <p className="text-foreground/85 text-xs leading-relaxed mb-4 font-normal">{villa.desc}</p>
                        </div>
                        <div className="flex justify-between items-center border-t border-gold/15 pt-4 mt-4">
                          <span className="text-[11px] text-foreground/75 uppercase tracking-widest font-medium">Included Butler Service</span>
                          <span className={`text-xs font-bold px-3 py-1 rounded-full ${isSelected ? "bg-gold text-slate-950" : "border border-gold/40 text-gold hover:bg-gold/15"}`}>
                            {isSelected ? "Sanctuary Selected" : "Select Villa"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 3: Select Experiences */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <p className="text-sm font-semibold text-foreground/90">Customize with elite estate activities.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
                  {EXPERIENCES.map((exp) => {
                    const isSelected = selectedExps.includes(exp.id);
                    return (
                      <div
                        key={exp.id}
                        onClick={() => handleExpToggle(exp.id)}
                        className={`p-4 sm:p-5 rounded-xl border cursor-pointer transition-all duration-300 flex flex-col justify-between relative ${isSelected ? "border-gold bg-gold/10 shadow-xl ring-1 ring-gold/40" : "border-gold/20 hover:border-gold/40 bg-background/60"
                          }`}
                      >
                        <div>
                          <div className="flex justify-between items-center mb-3">
                            <span className="p-2 rounded-lg bg-gold/20 text-gold">
                              <exp.icon className="w-5 h-5" />
                            </span>
                            <span className="text-gold font-bold text-sm">${exp.price}</span>
                          </div>
                          <h4 className="font-sans font-semibold text-sm text-foreground mb-1">{exp.name}</h4>
                          <p className="text-foreground/80 text-xs leading-relaxed">{exp.desc}</p>
                        </div>
                        {isSelected && (
                          <div className="absolute top-3 right-3 bg-gold text-slate-950 w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-md">
                            <Check className="w-3.5 h-3.5 stroke-3" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 4: Bespoke Details */}
            {currentStep === 3 && (
              <div className="space-y-6 max-w-xl mx-auto">
                <p className="text-sm font-semibold text-center text-foreground/90">When should we expect your arrival?</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 bg-background/60 p-4 sm:p-6 rounded-xl border border-gold/20 shadow-md">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-gold font-bold block">Arrival Date</label>
                    <div className="relative">
                      <input
                        type="date"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        className="w-full bg-background border border-gold/30 rounded-lg p-3 text-xs text-foreground focus:outline-none focus:border-gold font-medium scheme-light-dark"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-gold font-bold block">Length of Stay</label>
                    <div className="flex items-center justify-between border border-gold/30 rounded-lg p-1.5 bg-background">
                      <button
                        type="button"
                        onClick={() => setNights(n => Math.max(1, n - 1))}
                        className="w-8 h-8 rounded-lg hover:bg-gold/20 flex items-center justify-center font-extrabold text-gold cursor-pointer"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold text-foreground">{nights} Nights</span>
                      <button
                        type="button"
                        onClick={() => setNights(n => n + 1)}
                        className="w-8 h-8 rounded-lg hover:bg-gold/20 flex items-center justify-center font-extrabold text-gold cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs uppercase tracking-widest text-gold font-bold block">Total Guests</label>
                    <div className="flex items-center justify-between border border-gold/30 rounded-lg p-1.5 bg-background">
                      <button
                        type="button"
                        onClick={() => setGuests(g => Math.max(1, g - 1))}
                        className="w-8 h-8 rounded-lg hover:bg-gold/20 flex items-center justify-center font-extrabold text-gold cursor-pointer"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold text-foreground">{guests} Guests</span>
                      <button
                        type="button"
                        onClick={() => setGuests(g => Math.min(8, g + 1))}
                        className="w-8 h-8 rounded-lg hover:bg-gold/20 flex items-center justify-center font-extrabold text-gold cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: Final Review & Submission */}
            {currentStep === 4 && (
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="font-editorial text-2xl text-gold font-semibold pb-2 border-b border-gold/20">Personal Information</h4>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs uppercase tracking-widest text-foreground/80 font-semibold block">Full Name</label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Lord Sandeep"
                        className="w-full bg-background border border-gold/30 rounded-lg p-3 text-xs text-foreground focus:outline-none focus:border-gold placeholder:text-foreground/40 font-medium"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs uppercase tracking-widest text-foreground/80 font-semibold block">Email Address</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="sandeep@example.com"
                        className="w-full bg-background border border-gold/30 rounded-lg p-3 text-xs text-foreground focus:outline-none focus:border-gold placeholder:text-foreground/40 font-medium"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 bg-background/80 p-6 rounded-xl border border-gold/20 shadow-md">
                  <h4 className="font-editorial text-2xl text-foreground font-semibold border-b border-gold/20 pb-2">Est. Summary</h4>
                  <div className="space-y-3 text-xs text-foreground/90">
                    <div className="flex justify-between">
                      <span className="font-medium text-foreground">{selectedDest.name}</span>
                      <span className="text-gold font-bold"><MapPin className="w-3.5 h-3.5 inline mr-1" />{selectedDest.region}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-foreground">{selectedVilla.name}</span>
                      <span className="font-medium">${selectedVilla.price.toLocaleString()} x {nights} nights</span>
                    </div>
                    {selectedExps.length > 0 && (
                      <div className="border-t border-gold/20 pt-3">
                        <span className="text-[11px] uppercase tracking-wider text-gold font-bold block mb-1">Curated Experiences</span>
                        {selectedExps.map(id => {
                          const exp = EXPERIENCES.find(e => e.id === id);
                          return (
                            <div key={id} className="flex justify-between pl-2 border-l-2 border-gold/40 mb-1 text-xs text-foreground/90 font-medium">
                              <span>{exp?.name}</span>
                              <span>${exp?.price}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    <div className="border-t border-gold/20 pt-4 mt-4 flex justify-between text-base font-bold text-foreground">
                      <span>Estimated Investment</span>
                      <span className="text-gold font-editorial text-2xl font-bold">${calculateTotal().toLocaleString()}</span>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-gold hover:bg-gold/90 text-slate-950 font-bold text-xs tracking-widest uppercase transition-all duration-300 mt-6 cursor-pointer shadow-lg rounded-lg"
                  >
                    Submit Journey Details &rarr;
                  </button>
                </div>
              </form>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center border-t border-gold/20 pt-6 mt-8">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 0}
                className={`flex items-center gap-1 text-xs uppercase tracking-wider font-bold cursor-pointer ${currentStep === 0 ? "text-foreground/30 cursor-not-allowed" : "text-foreground/90 hover:text-gold transition-colors"
                  }`}
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>

              {currentStep < STEPS.length - 1 && (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center gap-1.5 px-6 py-3 bg-gold hover:bg-gold/90 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer rounded-lg shadow-md"
                >
                  Next Step <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
