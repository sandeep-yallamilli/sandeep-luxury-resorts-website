import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/auth-context";
import { apiClient, UserProfile, Booking } from "@/lib/api";
import ProtectedRoute from "@/components/layout/protected-route";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import SmoothScrollProvider from "@/components/layout/smooth-scroll-provider";
import { Crown, Calendar, XCircle, CheckCircle2, Shield, PlusCircle, User as UserIcon, Camera, FileText } from "lucide-react";
import Logo from "@/components/ui/logo";
import PaymentReceiptModal from "@/components/ui/payment-receipt-modal";

function ProfileContent() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const [actionMsg, setActionMsg] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarHover, setAvatarHover] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [selectedReceiptBookingId, setSelectedReceiptBookingId] = useState<number | null>(null);

  // Load persisted avatar on mount / user change
  useEffect(() => {
    if (user?.email) {
      const saved = localStorage.getItem(`avatar_${user.email}`);
      if (saved) setAvatarUrl(saved);
    }
  }, [user]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setAvatarUrl(dataUrl);
      if (user?.email) {
        localStorage.setItem(`avatar_${user.email}`, dataUrl);
      }
      setActionMsg("Profile picture updated successfully!");
      setTimeout(() => setActionMsg(""), 3000);
    };
    reader.readAsDataURL(file);
    // reset so same file can be re-selected
    e.target.value = "";
  };

  const loadData = () => {
    if (user?.token) {
      setLoading(true);
      Promise.all([
        apiClient.getProfile(user.token),
        apiClient.getBookings(user.token),
      ])
        .then(([profileData, bookingsData]) => {
          setProfile(profileData);
          setBookings(bookingsData);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleCancel = async (bookingId: number) => {
    if (!user?.token) return;
    if (!window.confirm("Are you sure you wish to cancel this sanctuary reservation?")) return;
    
    setCancellingId(bookingId);
    try {
      await apiClient.cancelBooking(bookingId, user.token);
      setActionMsg("Reservation cancelled successfully.");
      loadData();
    } catch (err: unknown) {
      const error = err as { message?: string };
      setActionMsg(error.message || "Failed to cancel reservation.");
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto text-center space-y-6 py-12">
        <h2 className="font-editorial text-2xl text-gold">Accessing Sanctuary Passport...</h2>
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 sm:space-y-12">
      
      {/* Profile Passport Banner */}
      <div className="bg-background/90 text-foreground p-5 sm:p-8 rounded-2xl border border-gold/20 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-gold/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:gap-6 pb-6 sm:pb-8 border-b border-gold/15 relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5">
            {/* Avatar with upload overlay */}
            <div
              className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full cursor-pointer group shrink-0"
              onClick={() => avatarInputRef.current?.click()}
              onMouseEnter={() => setAvatarHover(true)}
              onMouseLeave={() => setAvatarHover(false)}
              title="Click to update profile picture"
            >
              {/* Hidden file input */}
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />

              {/* Avatar circle */}
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Profile avatar"
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-gold/40 shadow-lg"
                />
              ) : (
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gold/15 border-2 border-gold/40 flex items-center justify-center text-gold shadow-inner">
                  <UserIcon className="w-7 h-7 sm:w-8 sm:h-8" />
                </div>
              )}

              {/* Camera overlay on hover */}
              <div
                className={`absolute inset-0 rounded-full flex flex-col items-center justify-center gap-0.5 transition-all duration-200 ${
                  avatarHover
                    ? "bg-black/55 opacity-100"
                    : "opacity-0"
                }`}
              >
                <Camera className="w-4 h-4 sm:w-5 sm:h-5 text-gold" />
                <span className="text-[7.5px] sm:text-[8px] text-gold font-semibold uppercase tracking-wider leading-tight">
                  Update
                </span>
              </div>

              {/* Pulsing gold ring indicator (no avatar set) */}
              {!avatarUrl && (
                <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-gold flex items-center justify-center shadow">
                  <Camera className="w-2.5 h-2.5 text-background" />
                </span>
              )}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <h1 className="font-editorial text-2xl sm:text-3xl text-foreground">{profile?.username}</h1>
                <span className="px-2.5 sm:px-3 py-0.5 sm:py-1 bg-gold/15 border border-gold/40 text-gold text-[9px] sm:text-[10px] uppercase font-medium tracking-widest rounded-full flex items-center gap-1 sm:gap-1.5">
                  <Crown className="w-3 h-3" /> {profile?.tier || "Royal Diamond"}
                </span>
              </div>
              <p className="text-xs text-foreground/60 mt-1 font-sans tracking-wide break-all sm:break-normal">{profile?.email} • Member since {profile?.date_joined || "2026"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto pt-2 sm:pt-0">
            <Link
              to="/book"
              className="flex-1 sm:flex-none justify-center px-4 sm:px-5 py-2.5 bg-gold text-foreground font-semibold text-xs tracking-widest uppercase hover:bg-gold/90 transition-all rounded-lg flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" /> Book Retreat
            </Link>
            <button
              onClick={logout}
              className="px-4 py-2.5 border border-gold/30 hover:border-gold text-foreground/70 hover:text-gold text-xs tracking-widest uppercase transition-all rounded-lg cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Passport Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-6 sm:pt-8 text-center md:text-left">
          <div>
            <span className="text-[9.5px] sm:text-[10px] text-foreground/40 uppercase tracking-widest block font-medium">Total Journeys</span>
            <span className="font-editorial text-2xl sm:text-3xl text-gold">{profile?.total_bookings || bookings.length}</span>
          </div>
          <div>
            <span className="text-[9.5px] sm:text-[10px] text-foreground/40 uppercase tracking-widest block font-medium">Active Retreats</span>
            <span className="font-editorial text-2xl sm:text-3xl text-turquoise">{profile?.active_bookings || bookings.filter(b => b.status === 'confirmed').length}</span>
          </div>
          <div>
            <span className="text-[9.5px] sm:text-[10px] text-foreground/40 uppercase tracking-widest block font-medium">Global Sanctuaries</span>
            <span className="font-editorial text-2xl sm:text-3xl text-foreground">5 Locations</span>
          </div>
          <div>
            <span className="text-[9.5px] sm:text-[10px] text-foreground/40 uppercase tracking-widest block font-medium">Butler Service</span>
            <span className="font-editorial text-base sm:text-lg text-gold flex items-center justify-center md:justify-start gap-1 mt-1">
              <Shield className="w-4 h-4" /> 24/7 Priority
            </span>
          </div>
        </div>
      </div>

      {actionMsg && (
        <div className="p-3.5 sm:p-4 bg-gold/10 border border-gold/30 text-gold rounded-lg text-xs font-semibold flex items-center justify-between">
          <span>{actionMsg}</span>
          <button onClick={() => setActionMsg("")} className="text-foreground/50 hover:text-foreground">✕</button>
        </div>
      )}

      {selectedReceiptBookingId && (
        <PaymentReceiptModal
          bookingId={selectedReceiptBookingId}
          isOpen={!!selectedReceiptBookingId}
          onClose={() => setSelectedReceiptBookingId(null)}
        />
      )}

      {/* Bookings Section */}
      <div className="space-y-4 sm:space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-editorial text-xl sm:text-2xl text-foreground flex items-center gap-2">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gold" /> Active &amp; Past Reservations
          </h2>
          <span className="text-xs text-foreground/50 uppercase tracking-widest font-mono">{bookings.length} Found</span>
        </div>

        {bookings.length === 0 ? (
          <div className="p-8 sm:p-12 text-center bg-background/50 border border-gold/15 rounded-2xl space-y-3 sm:space-y-4">
            <div className="flex justify-center">
              <Logo showText={false} iconClassName="w-10 h-10 sm:w-12 sm:h-12 text-gold/60" />
            </div>
            <h3 className="font-editorial text-lg sm:text-xl text-foreground">No Sanctuaries Booked Yet</h3>
            <p className="text-xs text-foreground/60 max-w-md mx-auto">
              Your global luxury ledger is awaiting its first entry. Explore our overwater villas, mountain chalets, and sacred jungle pavilions.
            </p>
            <Link
              to="/resorts"
              className="inline-block px-5 sm:px-6 py-2.5 sm:py-3 bg-gold text-foreground font-semibold text-xs tracking-widest uppercase hover:bg-gold/90 transition-all rounded-lg mt-2"
            >
              Explore Sanctuaries
            </Link>
          </div>
        ) : (
          <div className="space-y-3.5 sm:space-y-4">
            {bookings.map((b) => {
              const isConfirmed = b.status !== 'cancelled';
              const resortName = b.room_details?.resort_name || "Luxury Resort";
              const roomType = b.room_details?.room_type || `Room #${b.room}`;
              const isPaid = (b.payment_status || 'paid') === 'paid';

              return (
                <div
                  key={b.id}
                  className="bg-background/80 border border-gold/15 hover:border-gold/30 rounded-xl p-4 sm:p-6 transition-all shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:gap-6"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <span className="font-editorial text-lg sm:text-xl text-gold">{resortName}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] uppercase font-semibold tracking-wider flex items-center gap-1 ${
                        isConfirmed
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                          : "bg-red-500/10 text-red-400 border border-red-500/30"
                      }`}>
                        {isConfirmed ? (
                          <><CheckCircle2 className="w-3 h-3" /> Confirmed</>
                        ) : (
                          <><XCircle className="w-3 h-3" /> Cancelled</>
                        )}
                      </span>

                      {isPaid && isConfirmed && (
                        <span className="px-2.5 py-0.5 rounded-full text-[9px] uppercase font-semibold tracking-wider bg-gold/15 text-gold border border-gold/30 flex items-center gap-1">
                          💳 Paid In Full ({b.payment_method?.toUpperCase() || 'CARD'})
                        </span>
                      )}
                    </div>

                    <p className="text-xs font-semibold text-foreground">{roomType} • {b.guests || 2} Guests</p>

                    <div className="flex flex-wrap gap-2.5 sm:gap-4 text-[11px] text-foreground/60 pt-1 font-mono">
                      <span>Check-In: <strong className="text-foreground">{b.start_date}</strong></span>
                      <span>Check-Out: <strong className="text-foreground">{b.end_date}</strong></span>
                      {b.payment_id && (
                        <span>Txn: <strong className="text-gold">{b.payment_id}</strong></span>
                      )}
                    </div>
                  </div>

                  <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-gold/10 gap-3">
                    <div className="text-left md:text-right">
                      <span className="text-[9px] text-foreground/40 uppercase tracking-widest block font-medium">Guaranteed Amount</span>
                      <span className="font-editorial text-xl sm:text-2xl text-gold">₹{parseFloat(b.total_price || "0").toLocaleString()}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {b.id && isConfirmed && (
                        <button
                          onClick={() => setSelectedReceiptBookingId(b.id!)}
                          className="px-3 py-1.5 bg-gold/15 border border-gold/40 text-gold hover:bg-gold/25 text-[10px] uppercase tracking-wider font-semibold rounded transition-all cursor-pointer flex items-center gap-1"
                        >
                          <FileText className="w-3 h-3" /> Receipt
                        </button>
                      )}

                      {isConfirmed && (
                        <button
                          onClick={() => b.id && handleCancel(b.id)}
                          disabled={cancellingId === b.id}
                          className="px-3 py-1.5 border border-red-500/40 text-red-400 hover:bg-red-500/10 text-[10px] uppercase tracking-wider font-semibold rounded transition-all cursor-pointer disabled:opacity-50"
                        >
                          {cancellingId === b.id ? "Cancelling..." : "Cancel"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}

export default function Profile() {
  return (
    <SmoothScrollProvider>
      <Header />
      <main className="bg-background min-h-screen pt-24 sm:pt-32 pb-16 sm:pb-24 px-4 sm:px-6">
        <ProtectedRoute>
          <ProfileContent />
        </ProtectedRoute>
      </main>
      <Footer />
    </SmoothScrollProvider>
  );
}


