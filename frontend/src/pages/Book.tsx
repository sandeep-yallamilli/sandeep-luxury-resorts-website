import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import SmoothScrollProvider from "@/components/layout/smooth-scroll-provider";
import { 
  Check, ShieldCheck, Sparkles, CreditCard, Lock, Clock, Headphones, 
  CheckCircle2, ArrowRight, QrCode, Building2, Crown, Zap, FileText, Smartphone, RefreshCw
} from "lucide-react";
import ProtectedRoute from "@/components/layout/protected-route";
import { apiClient, Resort, Room, Booking } from "@/lib/api";
import { useAuth } from "@/context/auth-context";
import PaymentReceiptModal from "@/components/ui/payment-receipt-modal";

const TRUST_PERKS = [
  { icon: ShieldCheck, title: "Best Rate Guarantee", desc: "Direct bookings receive prioritized villa placement" },
  { icon: Clock, title: "Flexible Cancellation", desc: "Complimentary modification up to 14 days prior" },
  { icon: Headphones, title: "24/7 Priority Concierge", desc: "Dedicated Butler assigned immediately upon booking" },
];

const UPI_APPS = [
  { id: "gpay", name: "Google Pay", icon: "🟢", handle: "@okaxis" },
  { id: "phonepe", name: "PhonePe", icon: "🟣", handle: "@ybl" },
  { id: "paytm", name: "Paytm UPI", icon: "🔵", handle: "@paytm" },
  { id: "bhim", name: "BHIM UPI", icon: "🟠", handle: "@upi" },
  { id: "amazonpay", name: "Amazon Pay", icon: "🟡", handle: "@apl" },
];

const INDIAN_BANKS = [
  { id: "hdfc", name: "HDFC Bank", logo: "🏦" },
  { id: "icici", name: "ICICI Bank", logo: "🏛️" },
  { id: "sbi", name: "State Bank of India (SBI)", logo: "🏢" },
  { id: "axis", name: "Axis Bank", logo: "🏦" },
  { id: "kotak", name: "Kotak Mahindra Bank", logo: "🏛️" },
  { id: "pnb", name: "Punjab National Bank", logo: "🏢" },
];

function BookingForm() {
  const [searchParams] = useSearchParams();
  const destParam = searchParams.get("destination") || "maldives";
  const checkInParam = searchParams.get("checkIn") || "";
  const checkOutParam = searchParams.get("checkOut") || "";
  const guestsParam = searchParams.get("guests") || "2";

  const { user } = useAuth();
  
  const [resorts, setResorts] = useState<Resort[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const [destinationSlug, setDestinationSlug] = useState(destParam);
  const [checkIn, setCheckIn] = useState(checkInParam);
  const [checkOut, setCheckOut] = useState(checkOutParam);
  const [guests, setGuests] = useState(guestsParam);
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);

  const [name, setName] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [specialRequests, setSpecialRequests] = useState("");

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'netbanking' | 'express_concierge'>('card');
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [cardName, setCardName] = useState(user?.username || "");
  
  // UPI State
  const [selectedUpiApp, setSelectedUpiApp] = useState("gpay");
  const [upiId, setUpiId] = useState("");
  
  // NetBanking State
  const [selectedBank, setSelectedBank] = useState("hdfc");

  // Processing & Confirmation State
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  // Receipt Modal State
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  useEffect(() => {
    Promise.all([apiClient.getResorts(), apiClient.getRooms()])
      .then(([resortsData, roomsData]) => {
        setResorts(resortsData);
        setRooms(roomsData);
        setLoadingData(false);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!loadingData && resorts.length > 0) {
      const selectedResort = resorts.find(r => r.slug === destinationSlug) || resorts[0];
      if (selectedResort) {
        const resortRooms = rooms.filter(r => r.resort === selectedResort.id && r.is_available);
        const currentRoomValid = resortRooms.some(r => r.id === selectedRoomId);
        if (!currentRoomValid) {
          setSelectedRoomId(resortRooms.length > 0 ? resortRooms[0].id : null);
        }
      }
    }
  }, [loadingData, destinationSlug, resorts, rooms, selectedRoomId]);

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !selectedRoomId || !checkIn || !checkOut) {
      setErrorMsg("Please complete all required reservation fields.");
      return;
    }
    
    if (new Date(checkOut) <= new Date(checkIn)) {
      setErrorMsg("Departure date must be after arrival date.");
      return;
    }

    if (!user || !user.token) {
      setErrorMsg("You must be logged in to execute reservation.");
      return;
    }

    // Validation per payment method
    if (paymentMethod === 'card' && (!cardNumber || cardNumber.replace(/\s/g, '').length < 15)) {
      setErrorMsg("Please enter a valid 16-digit credit/debit card number.");
      return;
    }

    if (paymentMethod === 'upi' && !upiId && !selectedUpiApp) {
      setErrorMsg("Please enter your UPI ID or select a UPI payment app.");
      return;
    }

    setErrorMsg("");
    setIsProcessing(true);
    setProcessingStep(1); // 256-bit Encryption

    try {
      // Step 1: Create session with backend
      const session = await apiClient.createPaymentSession({
        room: selectedRoomId,
        start_date: checkIn,
        end_date: checkOut,
        payment_method: paymentMethod,
      }, user.token);

      setProcessingStep(2); // Contacting Gateway (Stripe/UPI)
      await new Promise(res => setTimeout(res, 1200));

      setProcessingStep(3); // Verifying Settlement
      await new Promise(res => setTimeout(res, 1200));

      // Step 2: Confirm Payment & Create Booking
      const booking = await apiClient.confirmPayment({
        room: selectedRoomId,
        start_date: checkIn,
        end_date: checkOut,
        guests: parseInt(guests) || 2,
        special_requests: specialRequests,
        payment_method: paymentMethod,
        payment_id: session.payment_id,
      }, user.token);

      setProcessingStep(4); // Authorizing VIP Butler
      await new Promise(res => setTimeout(res, 800));

      setConfirmedBooking(booking);
    } catch (err: unknown) {
      const error = err as { message?: string };
      setErrorMsg(error.message || "Payment authorization failed. Please try again.");
    } finally {
      setIsProcessing(false);
      setProcessingStep(0);
    }
  };

  if (loadingData) {
    return (
      <div className="max-w-2xl mx-auto bg-background text-foreground p-12 rounded-2xl border border-gold/20 shadow-2xl text-center space-y-6 animate-pulse">
        <h2 className="font-editorial text-2xl text-gold">Accessing Sanctuary Availability...</h2>
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  const selectedResort = resorts.find(r => r.slug === destinationSlug) || resorts[0];
  const availableRooms = selectedResort ? rooms.filter(r => r.resort === selectedResort.id && r.is_available) : [];
  const selectedRoomDetails = availableRooms.find(r => r.id === selectedRoomId);

  let totalPrice = 0;
  let totalNights = 0;
  if (selectedRoomDetails && checkIn && checkOut) {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    if (end > start) {
      totalNights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24));
      totalPrice = totalNights * parseFloat(selectedRoomDetails.price);
    }
  }

  // Submitted & Confirmed View
  if (confirmedBooking && selectedRoomDetails && selectedResort) {
    return (
      <div className="max-w-3xl mx-auto bg-background/95 backdrop-blur-md text-foreground p-8 md:p-14 rounded-2xl border border-gold/30 shadow-2xl text-center space-y-8 animate-fade-in-up">
        
        {/* Receipt Modal Triggered on Request */}
        {confirmedBooking.id && (
          <PaymentReceiptModal
            bookingId={confirmedBooking.id}
            isOpen={showReceiptModal}
            onClose={() => setShowReceiptModal(false)}
          />
        )}

        <div className="w-20 h-20 bg-gold/15 border border-gold/40 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <ShieldCheck className="w-10 h-10 text-gold" />
        </div>

        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-4 py-1 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-[0.25em] rounded-full">
            <CheckCircle2 className="w-4 h-4" /> Payment Settled &amp; Sanctuary Secured
          </span>
          <h2 className="font-editorial text-4xl md:text-5xl text-foreground">Reservation Confirmed</h2>
        </div>

        <p className="text-foreground/70 text-xs md:text-sm leading-relaxed max-w-lg mx-auto font-sans">
          Your payment of <strong className="text-gold font-semibold">₹{totalPrice.toLocaleString()}</strong> has been settled via <strong className="text-foreground uppercase">{confirmedBooking.payment_method || paymentMethod}</strong>. VIP arrival credentials and butler contact information have been sent to <strong className="text-gold">{email}</strong>.
        </p>

        <div className="border border-gold/20 bg-gold/5 rounded-2xl p-6 text-left max-w-md mx-auto text-xs space-y-3 shadow-inner">
          <div className="flex justify-between items-center border-b border-gold/10 pb-2">
            <span className="text-foreground/50">Sanctuary Haven</span>
            <span className="font-semibold text-foreground">{selectedResort.name}</span>
          </div>
          <div className="flex justify-between items-center border-b border-gold/10 pb-2">
            <span className="text-foreground/50">Villa Category</span>
            <span className="font-semibold text-gold">{selectedRoomDetails.room_type}</span>
          </div>
          <div className="flex justify-between items-center border-b border-gold/10 pb-2">
            <span className="text-foreground/50">Dates</span>
            <span className="font-mono text-foreground">{checkIn} to {checkOut} ({totalNights} Nights)</span>
          </div>
          <div className="flex justify-between items-center border-b border-gold/10 pb-2">
            <span className="text-foreground/50">Transaction ID</span>
            <span className="font-mono text-gold text-[10.5px]">{confirmedBooking.payment_id || "slr_tx_verified"}</span>
          </div>
          <div className="flex justify-between items-center pt-1">
            <span className="text-foreground/50 font-semibold uppercase">Total Amount Paid</span>
            <span className="font-editorial text-2xl text-gold font-bold">₹{totalPrice.toLocaleString()}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
          <button
            onClick={() => setShowReceiptModal(true)}
            className="px-8 py-3.5 bg-gold text-background font-bold text-xs tracking-widest uppercase hover:bg-gold/90 transition-all rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            <FileText className="w-4 h-4" /> Download / View Payment Receipt
          </button>
          
          <Link
            to="/profile"
            className="px-8 py-3.5 border border-gold/30 hover:border-gold text-foreground/70 hover:text-gold font-semibold text-xs tracking-widest uppercase transition-all rounded-xl text-center"
          >
            View in Sanctuary Passport
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 sm:space-y-12 max-w-7xl mx-auto">
      
      {/* Processing overlay modal */}
      {isProcessing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-background text-foreground border border-gold/30 p-8 md:p-10 rounded-2xl shadow-2xl max-w-md w-full text-center space-y-6">
            <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
              <div className="w-16 h-16 border-2 border-gold/20 border-t-gold rounded-full animate-spin absolute inset-0" />
              <Sparkles className="w-6 h-6 text-gold animate-pulse" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] text-gold uppercase tracking-[0.28em] font-semibold">
                Sandeep Luxury Treasury
              </span>
              <h3 className="font-editorial text-2xl text-foreground">Authorizing Payment...</h3>
            </div>

            <div className="space-y-2 text-xs font-mono text-left bg-gold/5 p-4 rounded-xl border border-gold/15">
              <div className={`flex items-center gap-2 ${processingStep >= 1 ? "text-gold" : "text-foreground/30"}`}>
                <Check className="w-3.5 h-3.5" /> 1. Encrypting 256-bit TLS Payment Payload
              </div>
              <div className={`flex items-center gap-2 ${processingStep >= 2 ? "text-gold" : "text-foreground/30"}`}>
                <Check className="w-3.5 h-3.5" /> 2. Communicating with {paymentMethod === 'card' ? 'Stripe Gateway' : paymentMethod === 'upi' ? 'UPI Network (GPay/PhonePe)' : paymentMethod === 'netbanking' ? 'Bank Server' : 'VIP Concierge Vault'}
              </div>
              <div className={`flex items-center gap-2 ${processingStep >= 3 ? "text-gold" : "text-foreground/30"}`}>
                <Check className="w-3.5 h-3.5" /> 3. Verifying Reserve Liquidity &amp; Settlement
              </div>
              <div className={`flex items-center gap-2 ${processingStep >= 4 ? "text-gold" : "text-foreground/30"}`}>
                <Check className="w-3.5 h-3.5" /> 4. Assigning 24/7 Dedicated Butler
              </div>
            </div>

            <p className="text-[10.5px] text-foreground/40 font-mono">
              Do not refresh or close this window while transaction settles.
            </p>
          </div>
        </div>
      )}

      {/* ── Page Header ── */}
      <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4">
        <span className="text-gold tracking-[0.25em] sm:tracking-[0.28em] text-[9.5px] sm:text-[10px] uppercase font-semibold block">
          Exclusive Reservations &amp; Treasury
        </span>
        <h1 className="font-editorial text-3xl sm:text-4xl md:text-6xl text-foreground leading-tight">
          Reserve Your Sanctuary
        </h1>
        <p className="text-foreground/60 text-xs sm:text-sm leading-relaxed font-sans max-w-xl mx-auto">
          Guarantee your luxury overwater pavilion, secluded mountain chalet, or desert pavilion with seamless payment choices.
        </p>
      </div>

      {/* ── Trust Perks Strip ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-px bg-gold/10 rounded-2xl overflow-hidden border border-gold/10">
        {TRUST_PERKS.map(({ icon: Icon, title, desc }, idx) => (
          <div key={title} className={`bg-background/80 p-4 sm:p-6 flex items-start gap-3 sm:gap-4 hover:bg-background transition-colors ${idx === 2 ? "sm:col-span-2 md:col-span-1" : ""}`}>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
              <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-gold" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">{title}</h4>
              <p className="text-[10.5px] sm:text-[11px] text-foreground/50 font-sans mt-0.5 leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 items-start">
        
        {/* Main Reservation Form */}
        <form onSubmit={handlePaymentSubmit} className="lg:col-span-8 space-y-6 sm:space-y-8 bg-background/60 p-4 sm:p-6 md:p-10 rounded-2xl border border-gold/15 shadow-xl">
          
          {errorMsg && (
            <div className="bg-red-500/10 border border-red-500/40 text-red-400 p-3.5 sm:p-4 rounded-xl text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          {/* Section 1: Sanctuary Details */}
          <div className="space-y-4 sm:space-y-5">
            <div className="flex items-center gap-2.5 sm:gap-3 pb-2.5 sm:pb-3 border-b border-gold/10">
              <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gold/20 text-gold text-xs font-bold flex items-center justify-center">1</span>
              <h3 className="font-editorial text-xl sm:text-2xl text-foreground">Sanctuary Selection</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-5">
              <div className="space-y-1 sm:space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest text-gold font-semibold block">Destination</label>
                <select 
                  value={destinationSlug} 
                  onChange={(e) => setDestinationSlug(e.target.value)}
                  className="w-full bg-background border border-gold/25 rounded-xl p-2.5 sm:p-3 text-xs text-foreground cursor-pointer focus:border-gold outline-none transition"
                >
                  {resorts.map(r => (
                    <option key={r.id} value={r.slug}>{r.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1 sm:space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest text-gold font-semibold block">Sanctuary Villa Category</label>
                <select 
                  value={selectedRoomId || ""}
                  onChange={(e) => setSelectedRoomId(Number(e.target.value))}
                  className="w-full bg-background border border-gold/25 rounded-xl p-2.5 sm:p-3 text-xs text-foreground cursor-pointer focus:border-gold outline-none transition"
                  disabled={availableRooms.length === 0}
                >
                  {availableRooms.length === 0 && <option value="">No rooms available</option>}
                  {availableRooms.map(r => (
                    <option key={r.id} value={r.id}>{r.room_type} (₹{parseFloat(r.price).toLocaleString()}/night)</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1 sm:space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest text-gold font-semibold block">Arrival Date</label>
                <input 
                  required 
                  type="date" 
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full bg-background border border-gold/25 rounded-xl p-2.5 sm:p-3 text-xs text-foreground cursor-pointer focus:border-gold outline-none transition" 
                />
              </div>

              <div className="space-y-1 sm:space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest text-gold font-semibold block">Departure Date</label>
                <input 
                  required 
                  type="date" 
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full bg-background border border-gold/25 rounded-xl p-2.5 sm:p-3 text-xs text-foreground cursor-pointer focus:border-gold outline-none transition" 
                />
              </div>

              <div className="space-y-1 sm:space-y-1.5 sm:col-span-2">
                <label className="text-[10px] uppercase tracking-widest text-gold font-semibold block">Guests Allocation</label>
                <select 
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="w-full bg-background border border-gold/25 rounded-xl p-2.5 sm:p-3 text-xs text-foreground cursor-pointer focus:border-gold outline-none transition"
                >
                  <option value="1">1 Guest (Solo Sanctuary)</option>
                  <option value="2">2 Guests (Couple Pavilion)</option>
                  <option value="3">3 Guests (Extended Suite)</option>
                  <option value="4">4 Guests (Royal Family Residence)</option>
                  <option value="6">6 Guests (Estate Buyout)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Guest Information */}
          <div className="space-y-4 sm:space-y-5">
            <div className="flex items-center gap-2.5 sm:gap-3 pb-2.5 sm:pb-3 border-b border-gold/10">
              <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gold/20 text-gold text-xs font-bold flex items-center justify-center">2</span>
              <h3 className="font-editorial text-xl sm:text-2xl text-foreground">Guest Credentials</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
              <div className="space-y-1 sm:space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest text-foreground/60 font-semibold block">Full Name</label>
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
                <label className="text-[10px] uppercase tracking-widest text-foreground/60 font-semibold block">Email for Confirmation</label>
                <input 
                  required 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="sandeep@example.com" 
                  className="w-full bg-background border border-gold/20 rounded-xl p-2.5 sm:p-3 text-xs text-foreground focus:border-gold outline-none transition" 
                />
              </div>

              <div className="space-y-1 sm:space-y-1.5 sm:col-span-2">
                <label className="text-[10px] uppercase tracking-widest text-foreground/60 font-semibold block">Special Dietary or Seclusion Requests (Optional)</label>
                <input 
                  type="text" 
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="e.g. Organic plant-based menu, champagne arrival, private jetty pickup..." 
                  className="w-full bg-background border border-gold/20 rounded-xl p-2.5 sm:p-3 text-xs text-foreground focus:border-gold outline-none transition" 
                />
              </div>
            </div>
          </div>

          {/* Section 3: Payment Hub */}
          <div className="space-y-4 sm:space-y-5">
            <div className="flex items-center gap-2.5 sm:gap-3 pb-2.5 sm:pb-3 border-b border-gold/10">
              <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gold/20 text-gold text-xs font-bold flex items-center justify-center">3</span>
              <h3 className="font-editorial text-xl sm:text-2xl text-foreground">Secure Payment Gateway</h3>
            </div>

            {/* Payment Method Selector Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-gold/5 p-1.5 rounded-xl border border-gold/15">
              
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3 rounded-lg text-left transition flex flex-col justify-between cursor-pointer ${
                  paymentMethod === 'card'
                    ? "bg-gold text-background shadow-md font-bold"
                    : "hover:bg-gold/10 text-foreground/70"
                }`}
              >
                <CreditCard className="w-4 h-4 mb-1" />
                <div>
                  <span className="text-[11px] block font-semibold leading-tight">Cards / Stripe</span>
                  <span className="text-[9px] opacity-70 block">Visa, MC, Amex</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`p-3 rounded-lg text-left transition flex flex-col justify-between cursor-pointer ${
                  paymentMethod === 'upi'
                    ? "bg-gold text-background shadow-md font-bold"
                    : "hover:bg-gold/10 text-foreground/70"
                }`}
              >
                <Smartphone className="w-4 h-4 mb-1" />
                <div>
                  <span className="text-[11px] block font-semibold leading-tight">UPI / QR</span>
                  <span className="text-[9px] opacity-70 block">GPay, PhonePe, Paytm</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('netbanking')}
                className={`p-3 rounded-lg text-left transition flex flex-col justify-between cursor-pointer ${
                  paymentMethod === 'netbanking'
                    ? "bg-gold text-background shadow-md font-bold"
                    : "hover:bg-gold/10 text-foreground/70"
                }`}
              >
                <Building2 className="w-4 h-4 mb-1" />
                <div>
                  <span className="text-[11px] block font-semibold leading-tight">NetBanking</span>
                  <span className="text-[9px] opacity-70 block">Indian Banks</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('express_concierge')}
                className={`p-3 rounded-lg text-left transition flex flex-col justify-between cursor-pointer ${
                  paymentMethod === 'express_concierge'
                    ? "bg-gold text-background shadow-md font-bold"
                    : "hover:bg-gold/10 text-foreground/70"
                }`}
              >
                <Crown className="w-4 h-4 mb-1" />
                <div>
                  <span className="text-[11px] block font-semibold leading-tight">VIP Express</span>
                  <span className="text-[9px] opacity-70 block">1-Click Fast Pass</span>
                </div>
              </button>

            </div>

            {/* TAB 1: Stripe & Credit/Debit Card Form */}
            {paymentMethod === 'card' && (
              <div className="space-y-3.5 bg-background/80 p-4 sm:p-5 rounded-xl border border-gold/20 animate-fade-in">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-foreground/60 font-semibold block">Cardholder Name</label>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="Lord Sandeep"
                    className="w-full bg-background border border-gold/20 rounded-xl p-2.5 text-xs text-foreground focus:border-gold outline-none transition"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-foreground/60 font-semibold block">Card Number</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={cardNumber}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
                        setCardNumber(val.slice(0, 19));
                      }}
                      placeholder="4000 1234 5678 9010" 
                      className="w-full bg-background border border-gold/20 rounded-xl p-2.5 pl-10 text-xs text-foreground font-mono focus:border-gold outline-none transition" 
                    />
                    <CreditCard className="w-4 h-4 text-gold absolute left-3 top-3" />
                    <Lock className="w-3.5 h-3.5 text-foreground/30 absolute right-3 top-3.5" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest text-foreground/60 font-semibold block">Expires (MM/YY)</label>
                    <input 
                      type="text" 
                      value={cardExpiry}
                      onChange={(e) => {
                        let val = e.target.value.replace(/\D/g, '');
                        if (val.length >= 3) val = `${val.slice(0,2)}/${val.slice(2,4)}`;
                        setCardExpiry(val.slice(0,5));
                      }}
                      placeholder="12/28" 
                      className="w-full bg-background border border-gold/20 rounded-xl p-2.5 text-xs text-foreground font-mono focus:border-gold outline-none transition" 
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest text-foreground/60 font-semibold block">Security Code (CVC)</label>
                    <input 
                      type="password" 
                      maxLength={4}
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, ''))}
                      placeholder="•••" 
                      className="w-full bg-background border border-gold/20 rounded-xl p-2.5 text-xs text-foreground font-mono focus:border-gold outline-none transition" 
                    />
                  </div>
                </div>

                <span className="text-[9.5px] text-foreground/40 block">
                  🔒 256-bit TLS Encrypted via Stripe Payment Network.
                </span>
              </div>
            )}

            {/* TAB 2: UPI Payment Hub (Google Pay, PhonePe, Paytm, BHIM) */}
            {paymentMethod === 'upi' && (
              <div className="space-y-4 bg-background/80 p-4 sm:p-5 rounded-xl border border-gold/20 animate-fade-in">
                
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-gold font-semibold block">Select UPI Payment Application</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {UPI_APPS.map((app) => (
                      <button
                        key={app.id}
                        type="button"
                        onClick={() => { setSelectedUpiApp(app.id); setUpiId(`sandeep${app.handle}`); }}
                        className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 transition cursor-pointer ${
                          selectedUpiApp === app.id
                            ? "bg-gold/15 border-gold text-gold font-bold"
                            : "border-gold/15 hover:border-gold/40 text-foreground/70"
                        }`}
                      >
                        <span className="text-base">{app.icon}</span>
                        <span>{app.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center border-t border-gold/10 pt-4">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-foreground/60 font-semibold block">Or Enter Any Virtual Payment Address (VPA)</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="sandeep@okhdfcbank / user@ybl" 
                        className="w-full bg-background border border-gold/20 rounded-xl p-2.5 text-xs text-foreground font-mono focus:border-gold outline-none transition" 
                      />
                      <Zap className="w-3.5 h-3.5 text-gold absolute right-3 top-3.5" />
                    </div>
                    <span className="text-[9.5px] text-foreground/40 block">Supports Google Pay, PhonePe, Paytm, BHIM &amp; all Bank UPI handles.</span>
                  </div>

                  <div className="bg-gold/5 p-4 rounded-xl border border-gold/15 text-center space-y-2">
                    <div className="w-24 h-24 bg-white p-1.5 rounded-lg mx-auto flex items-center justify-center shadow-md">
                      <QrCode className="w-20 h-20 text-black" />
                    </div>
                    <span className="text-[9.5px] text-gold font-mono uppercase tracking-wider block font-semibold">
                      Scan QR with GPay / PhonePe
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: Indian NetBanking & Wallets */}
            {paymentMethod === 'netbanking' && (
              <div className="space-y-3.5 bg-background/80 p-4 sm:p-5 rounded-xl border border-gold/20 animate-fade-in">
                <label className="text-[10px] uppercase tracking-widest text-gold font-semibold block">Select Your Indian Banking Institution</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {INDIAN_BANKS.map((bank) => (
                    <button
                      key={bank.id}
                      type="button"
                      onClick={() => setSelectedBank(bank.id)}
                      className={`p-3 rounded-xl border text-xs flex items-center gap-2 transition cursor-pointer text-left ${
                        selectedBank === bank.id
                          ? "bg-gold/15 border-gold text-gold font-bold"
                          : "border-gold/15 hover:border-gold/40 text-foreground/70"
                      }`}
                    >
                      <span className="text-lg">{bank.logo}</span>
                      <span className="leading-tight">{bank.name}</span>
                    </button>
                  ))}
                </div>
                <span className="text-[9.5px] text-foreground/40 block pt-1">
                  Includes direct instant bank gateway redirection for HDFC, ICICI, SBI, Axis, Kotak, and PNB.
                </span>
              </div>
            )}

            {/* TAB 4: VIP Express Pay */}
            {paymentMethod === 'express_concierge' && (
              <div className="p-5 bg-gold/10 border border-gold/30 rounded-xl space-y-2 animate-fade-in text-xs text-gold">
                <div className="flex items-center gap-2 font-bold uppercase tracking-wider">
                  <Crown className="w-4 h-4" /> Sandeep Royal Diamond VIP Express
                </div>
                <p className="text-foreground/70 text-[11px] leading-relaxed">
                  As an authenticated Diamond VIP guest, your reservation is pre-approved with instant 1-click authorization linked to your Sanctuary Passport profile.
                </p>
              </div>
            )}

          </div>

          <button 
            type="submit" 
            disabled={isProcessing || !selectedRoomId}
            className="w-full py-4 bg-gold hover:bg-gold/90 disabled:opacity-50 text-background font-bold text-xs tracking-[0.18em] uppercase transition-all rounded-xl cursor-pointer shadow-xl shadow-gold/20 flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin" /> Authorizing Treasury...
              </span>
            ) : (
              <>
                <span>Settle &amp; Authorize Sanctuary (₹{totalPrice.toLocaleString()})</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Invoice Ledger Sidebar */}
        <div className="lg:col-span-4 space-y-5 sm:space-y-6">
          <div className="bg-background text-foreground p-5 sm:p-6 md:p-8 rounded-2xl border border-gold/25 shadow-2xl space-y-5 sm:space-y-6">
            <h3 className="font-editorial text-xl sm:text-2xl text-foreground border-b border-gold/10 pb-3 flex items-center justify-between">
              <span>Sanctuary Ledger</span>
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-gold" />
            </h3>
            
            <div className="space-y-3 sm:space-y-3.5 text-xs text-foreground/70">
              <div className="flex justify-between items-center">
                <span className="text-foreground/50">Resort</span>
                <span className="font-semibold text-foreground text-right">{selectedResort?.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-foreground/50">Villa Selected</span>
                <span className="text-gold font-semibold text-right">{selectedRoomDetails ? selectedRoomDetails.room_type : "None"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-foreground/50">Rate Per Night</span>
                <span className="font-mono">₹{selectedRoomDetails ? parseFloat(selectedRoomDetails.price).toLocaleString() : "0"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-foreground/50">Stay Duration</span>
                <span className="font-mono">{totalNights > 0 ? `${totalNights} Nights` : "Select Dates"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-foreground/50">Guests</span>
                <span>{guests} {parseInt(guests) === 1 ? "Guest" : "Guests"}</span>
              </div>

              <div className="border-t border-gold/15 pt-3.5 sm:pt-4 flex justify-between items-center text-foreground">
                <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider">Settlement Amount</span>
                <span className="text-gold font-editorial text-xl sm:text-2xl font-semibold">₹{totalPrice.toLocaleString()}</span>
              </div>
            </div>

            <div className="p-3.5 sm:p-4 bg-gold/10 border border-gold/20 rounded-xl space-y-2 text-[10px] text-gold leading-relaxed">
              <div className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-gold mt-0.5 shrink-0" />
                <span>Includes private speedboat / helicopter transfers.</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-gold mt-0.5 shrink-0" />
                <span>Dedicated 24/7 Butler &amp; Michelin-inspired daily breakfast.</span>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl border border-gold/15 bg-background/40 space-y-1.5 sm:space-y-2">
            <h4 className="text-xs font-semibold text-gold uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Sandeep Guarantee
            </h4>
            <p className="text-[10.5px] sm:text-[11px] text-foreground/50 font-sans leading-relaxed">
              Every payment generates an instant digital treasury receipt with full audit trail and butler assignment credentials.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function Book() {
  return (
    <SmoothScrollProvider>
      <Header />
      <main className="bg-background min-h-screen pt-24 sm:pt-32 pb-16 sm:pb-24 px-4 sm:px-6">
        <ProtectedRoute>
          <BookingForm />
        </ProtectedRoute>
      </main>
      <Footer />
    </SmoothScrollProvider>
  );
}
