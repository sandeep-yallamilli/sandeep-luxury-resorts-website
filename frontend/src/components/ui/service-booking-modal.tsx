import React, { useState, useEffect } from "react";
import { X, Calendar, Clock, Sparkles, CheckCircle2, User, Mail, Compass } from "lucide-react";
import { apiClient } from "@/lib/api";
import { useAuth } from "@/context/auth-context";

interface ServiceBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceName?: string;
  defaultResort?: string;
  defaultSanctuary?: string;
}

const RESORTS = [
  "Sandeep Maldives Private Pavilion",
  "Sandeep Bora Bora Overwater Lagoon",
  "Sandeep Seychelles Granite Ocean Sanctuary",
  "Sandeep Serengeti Wildlife Sanctuary",
  "Sandeep Marrakech Royal Oasis Riad",
  "Sandeep Zanzibar Spice Island Resort",
  "Sandeep Rajasthan Desert Tent",
  "Sandeep Kerala Backwaters Wellness Retreat",
  "Sandeep Himalayan Cedar & Snow Sanctuary",
  "Sandeep Bali Forest Sanctuary",
  "Sandeep Kyoto Zen Pavilion",
  "Sandeep Thailand Emerald Bay Cliff Sanctuary",
  "Sandeep Alps Snow Chalet",
  "Sandeep Santorini Caldera Cliffside",
  "Sandeep Amalfi Coast Cliff Manor",
  "Sandeep Fiji Private Island Sanctuary",
];

export default function ServiceBookingModal({
  isOpen,
  onClose,
  serviceName = "Exclusive Sanctuary Experience",
  defaultResort = RESORTS[0],
  defaultSanctuary,
}: ServiceBookingModalProps) {
  const { user } = useAuth();
  const [name, setName] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [resort, setResort] = useState(defaultSanctuary || defaultResort);
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("Morning (09:00 AM)");
  const [guests, setGuests] = useState("2 Guests");
  const [notes, setNotes] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (user) {
      if (!name && user.username) setName(user.username);
      if (!email && user.email) setEmail(user.email);
    }
  }, [user, name, email]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !date) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      await apiClient.submitInquiry({
        name,
        email,
        resort,
        subject: `Service Reservation Request: ${serviceName}`,
        message: `Service: ${serviceName}\nResort: ${resort}\nDate: ${date}\nTime Slot: ${timeSlot}\nGuests: ${guests}\nNotes/Preferences: ${notes || "None"}`,
      });
      setSubmitted(true);
    } catch (err: unknown) {
      const error = err as { message?: string };
      setErrorMsg(error.message || "Failed to reserve service. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-fade-in-up">
      <div className="relative w-full max-w-lg max-h-[90dvh] overflow-y-auto bg-background text-foreground border border-gold/30 rounded-2xl shadow-2xl p-5 sm:p-8 space-y-5 sm:space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-full border border-gold/20 text-foreground/60 hover:text-gold hover:border-gold transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {submitted ? (
          <div className="text-center py-6 sm:py-8 space-y-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gold/15 border border-gold rounded-full flex items-center justify-center mx-auto shadow-lg">
              <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8 text-gold" />
            </div>
            <h3 className="font-editorial text-2xl sm:text-3xl text-gold">Experience Reserved</h3>
            <p className="text-xs md:text-sm text-foreground/70 leading-relaxed font-sans max-w-sm mx-auto">
              Your reservation request for <strong className="text-gold">{serviceName}</strong> at <span className="text-foreground">{resort}</span> has been dispatched to our Concierge team.
            </p>
            <div className="p-3 bg-gold/5 border border-gold/20 rounded-xl text-[11px] text-foreground/80 font-mono text-left max-w-xs mx-auto space-y-1">
              <p><span className="text-gold font-semibold">Date:</span> {date}</p>
              <p><span className="text-gold font-semibold">Time:</span> {timeSlot}</p>
              <p><span className="text-gold font-semibold">Guests:</span> {guests}</p>
            </div>
            <button
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="mt-4 px-8 py-3 bg-gold text-foreground font-semibold text-xs tracking-widest uppercase rounded-lg hover:bg-gold/90 transition-all cursor-pointer shadow-lg"
            >
              Close & Continue Exploring
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-1.5 sm:space-y-2 pr-8">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold" />
                <span className="text-gold text-[9px] sm:text-[10px] uppercase tracking-[0.25em] font-semibold">Sanctuary Service Reservation</span>
              </div>
              <h2 className="font-editorial text-xl sm:text-2xl md:text-3xl text-foreground">{serviceName}</h2>
              <p className="text-xs text-foreground/60 leading-relaxed font-sans">
                Reserve your custom session with our resident practitioners & master chefs.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-500/10 border border-red-500/40 text-red-400 text-xs rounded-lg font-medium">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4 text-xs font-sans">
              
              {/* Destination Resort Select */}
              <div className="space-y-1 sm:space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest text-gold font-semibold flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5" /> Select Resort Sanctuary
                </label>
                <select
                  value={resort}
                  onChange={(e) => setResort(e.target.value)}
                  className="w-full bg-background border border-gold/25 rounded-lg p-2.5 text-foreground cursor-pointer focus:outline-none focus:border-gold"
                >
                  {RESORTS.map((r) => (
                    <option key={r} value={r} className="bg-background text-foreground">
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              {/* Guest Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1 sm:space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-foreground/60 font-medium flex items-center gap-1">
                    <User className="w-3 h-3 text-gold" /> Full Name
                  </label>
                  <input
                    required
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full bg-background border border-gold/20 rounded-lg p-2.5 text-foreground"
                  />
                </div>
                <div className="space-y-1 sm:space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-foreground/60 font-medium flex items-center gap-1">
                    <Mail className="w-3 h-3 text-gold" /> Email Address
                  </label>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="guest@example.com"
                    className="w-full bg-background border border-gold/20 rounded-lg p-2.5 text-foreground"
                  />
                </div>
              </div>

              {/* Date & Time Slot */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1 sm:space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-gold font-semibold flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-gold" /> Preferred Date
                  </label>
                  <input
                    required
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-background border border-gold/25 rounded-lg p-2.5 text-foreground cursor-pointer"
                  />
                </div>
                <div className="space-y-1 sm:space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-gold font-semibold flex items-center gap-1">
                    <Clock className="w-3 h-3 text-gold" /> Time Slot
                  </label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full bg-background border border-gold/25 rounded-lg p-2.5 text-foreground cursor-pointer"
                  >
                    <option value="Morning (09:00 AM)">Morning (09:00 AM)</option>
                    <option value="Midday (01:00 PM)">Midday (01:00 PM)</option>
                    <option value="Sunset Ritual (05:30 PM)">Sunset Ritual (05:30 PM)</option>
                    <option value="Evening (08:00 PM)">Evening (08:00 PM)</option>
                  </select>
                </div>
              </div>

              {/* Guests Count & Special Requests */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1 sm:space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-foreground/60 font-medium">Guests Count</label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className="w-full bg-background border border-gold/20 rounded-lg p-2.5 text-foreground cursor-pointer"
                  >
                    <option value="1 Guest">1 Guest</option>
                    <option value="2 Guests">2 Guests</option>
                    <option value="4 Guests">4 Guests</option>
                    <option value="Private Group (6+)">Private Group (6+)</option>
                  </select>
                </div>
                <div className="space-y-1 sm:space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-foreground/60 font-medium">Special Requests</label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Allergies, therapist preference, etc."
                    className="w-full bg-background border border-gold/20 rounded-lg p-2.5 text-foreground"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-gold hover:bg-gold/90 text-foreground font-semibold text-xs tracking-widest uppercase rounded-lg transition-all cursor-pointer shadow-lg disabled:opacity-50"
                >
                  {isSubmitting ? "Dispatching Reservation Request..." : `Confirm Service Reservation \u2192`}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
