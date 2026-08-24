import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Users, MapPin, Search } from "lucide-react";
import { apiClient, Resort } from "@/lib/api";

const FALLBACK_RESORTS = [
  { slug: "maldives", name: "Sandeep Maldives Private Pavilion" },
  { slug: "bali", name: "Sandeep Bali Forest Sanctuary" },
  { slug: "kyoto", name: "Sandeep Kyoto Zen Pavilion" },
  { slug: "alps", name: "Sandeep Alps Snow Chalet" },
  { slug: "rajasthan", name: "Sandeep Rajasthan Desert Tent" },
  { slug: "santorini", name: "Sandeep Santorini Caldera Cliffside" },
  { slug: "amalfi", name: "Sandeep Amalfi Coast Cliff Manor" },
  { slug: "borabora", name: "Sandeep Bora Bora Overwater Lagoon" },
  { slug: "serengeti", name: "Sandeep Serengeti Wildlife Sanctuary" },
  { slug: "seychelles", name: "Sandeep Seychelles Granite Ocean Sanctuary" },
  { slug: "marrakech", name: "Sandeep Marrakech Royal Oasis Riad" },
  { slug: "zanzibar", name: "Sandeep Zanzibar Spice Island Resort" },
  { slug: "kerala", name: "Sandeep Kerala Backwaters Wellness Retreat" },
  { slug: "himalayas", name: "Sandeep Himalayan Cedar & Snow Sanctuary" },
  { slug: "thailand", name: "Sandeep Thailand Emerald Bay Cliff Sanctuary" },
  { slug: "fiji", name: "Sandeep Fiji Private Island Sanctuary" }
];

export default function BookingWidget() {
  const navigate = useNavigate();
  const [resorts, setResorts] = useState<Resort[]>([]);
  const [destination, setDestination] = useState("maldives");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2");

  // Calculate today's date string for min date attributes (YYYY-MM-DD)
  const todayStr = new Date().toISOString().split("T")[0];

  useEffect(() => {
    apiClient.getResorts()
      .then((data) => {
        if (data && data.length > 0) {
          setResorts(data);
          setDestination(data[0].slug);
        }
      })
      .catch(console.error);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Redirect to the book page with the selected options as query params
    navigate(
      `/book?destination=${encodeURIComponent(destination)}&checkIn=${encodeURIComponent(checkIn)}&checkOut=${encodeURIComponent(checkOut)}&guests=${encodeURIComponent(guests)}`
    );
  };

  const displayResorts = resorts.length > 0 ? resorts : FALLBACK_RESORTS;

  return (
    <form 
      onSubmit={handleSubmit}
      className="w-full max-w-5xl mx-auto glass-panel-luxury p-4 sm:p-5 md:p-6 rounded-2xl border border-gold/40 shadow-2xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-3 sm:gap-3.5 items-end animate-fade-in-up text-white"
    >
      {/* 1. Destination Selector (Expanded Length) */}
      <div className="space-y-1 sm:space-y-1.5 sm:col-span-2 md:col-span-6 lg:col-span-4">
        <label className="text-[10px] tracking-[0.2em] uppercase text-gold font-bold flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-gold" /> Sanctuary Destination
        </label>
        <div className="relative">
          <select 
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full h-11 bg-slate-950/80 border border-gold/30 rounded-xl px-3.5 text-xs text-slate-100 focus:outline-none focus:border-gold cursor-pointer appearance-none shadow-inner"
          >
            {displayResorts.map((r) => (
              <option key={r.slug} value={r.slug} className="bg-slate-900 text-slate-100">
                {r.name}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-gold">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
            </svg>
          </div>
        </div>
      </div>

      {/* 2. Check In Date */}
      <div className="space-y-1 sm:space-y-1.5 sm:col-span-1 md:col-span-3 lg:col-span-2">
        <label className="text-[10px] tracking-[0.2em] uppercase text-gold font-bold flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-gold" /> Check-In
        </label>
        <input 
          type="date" 
          required
          min={todayStr}
          value={checkIn}
          onChange={(e) => {
            setCheckIn(e.target.value);
            if (checkOut && e.target.value > checkOut) {
              setCheckOut("");
            }
          }}
          className="w-full h-11 bg-slate-950/80 border border-gold/30 rounded-xl px-3 text-xs text-slate-100 focus:outline-none focus:border-gold cursor-pointer shadow-inner"
        />
      </div>

      {/* 3. Check Out Date */}
      <div className="space-y-1 sm:space-y-1.5 sm:col-span-1 md:col-span-3 lg:col-span-2">
        <label className="text-[10px] tracking-[0.2em] uppercase text-gold font-bold flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-gold" /> Check-Out
        </label>
        <input 
          type="date" 
          required
          min={checkIn || todayStr}
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
          className="w-full h-11 bg-slate-950/80 border border-gold/30 rounded-xl px-3 text-xs text-slate-100 focus:outline-none focus:border-gold cursor-pointer shadow-inner"
        />
      </div>

      {/* 4. Guests Selector */}
      <div className="space-y-1 sm:space-y-1.5 sm:col-span-1 md:col-span-6 lg:col-span-2">
        <label className="text-[10px] tracking-[0.2em] uppercase text-gold font-bold flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-gold" /> Guests
        </label>
        <div className="relative">
          <select 
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            className="w-full h-11 bg-slate-950/80 border border-gold/30 rounded-xl px-3 text-xs text-slate-100 focus:outline-none focus:border-gold cursor-pointer appearance-none shadow-inner"
          >
            <option value="1" className="bg-slate-900 text-slate-100">1 Guest</option>
            <option value="2" className="bg-slate-900 text-slate-100">2 Guests</option>
            <option value="3" className="bg-slate-900 text-slate-100">3 Guests</option>
            <option value="4" className="bg-slate-900 text-slate-100">4 Guests</option>
            <option value="6" className="bg-slate-900 text-slate-100">6 Guests</option>
            <option value="8" className="bg-slate-900 text-slate-100">8+ Guests</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gold">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
            </svg>
          </div>
        </div>
      </div>

      {/* 5. Search Action Button */}
      <div className="sm:col-span-1 md:col-span-6 lg:col-span-2 flex items-center justify-center">
        <button 
          type="submit"
          className="w-full px-6 h-11 btn-luxury-gold font-bold text-xs tracking-[0.18em] uppercase rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:scale-[1.02] active:scale-98 transition-all"
          title="Search Sanctuaries"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Search</span>
        </button>
      </div>
    </form>
  );
}

