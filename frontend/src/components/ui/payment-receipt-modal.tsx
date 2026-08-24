import { useEffect, useState } from "react";
import { apiClient, PaymentReceipt } from "@/lib/api";
import { useAuth } from "@/context/auth-context";
import { ShieldCheck, Download, Printer, X, Sparkles, CheckCircle2, Building, Calendar, User, FileText } from "lucide-react";
import Logo from "./logo";

interface PaymentReceiptModalProps {
  bookingId: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function PaymentReceiptModal({ bookingId, isOpen, onClose }: PaymentReceiptModalProps) {
  const { user } = useAuth();
  const [receipt, setReceipt] = useState<PaymentReceipt | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen && bookingId && user?.token) {
      setLoading(true);
      setError("");
      apiClient
        .getPaymentReceipt(bookingId, user.token)
        .then(setReceipt)
        .catch((err) => setError(err.message || "Failed to load payment receipt."))
        .finally(() => setLoading(false));
    }
  }, [isOpen, bookingId, user]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto animate-fade-in">
      <div className="bg-background text-foreground border border-gold/30 rounded-2xl shadow-2xl max-w-2xl w-full p-6 md:p-8 relative space-y-6 my-8 print:border-none print:shadow-none print:bg-white print:text-black">

        {/* Close button (hidden during print) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-foreground/40 hover:text-gold p-2 transition cursor-pointer print:hidden"
          title="Close Receipt"
        >
          <X className="w-5 h-5" />
        </button>

        {loading ? (
          <div className="py-16 text-center space-y-4">
            <div className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="font-editorial text-lg text-gold">Generating Digital Receipt Ledger...</p>
          </div>
        ) : error ? (
          <div className="py-12 text-center space-y-4">
            <p className="text-red-400 font-semibold text-sm">{error}</p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gold/20 text-gold rounded-lg text-xs font-semibold uppercase tracking-wider"
            >
              Close
            </button>
          </div>
        ) : receipt ? (
          <>
            {/* Receipt Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gold/20 pb-6 gap-4">
              <div className="space-y-1">
                <Logo showText={true} iconClassName="w-7 h-7 text-gold" className="text-xl font-editorial tracking-widest" />
                <span className="text-[10px] text-foreground/50 uppercase tracking-[0.25em] block">
                  Official Luxury Resort Treasury Statement
                </span>
              </div>
              <div className="text-left sm:text-right space-y-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-xs font-bold uppercase tracking-widest rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {receipt.payment_status}
                </span>
                <p className="font-mono text-xs text-foreground/60 block">{receipt.invoice_number}</p>
              </div>
            </div>

            {/* Transaction Key Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-gold/5 p-4 rounded-xl border border-gold/15">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-foreground/60">
                  <User className="w-3.5 h-3.5 text-gold shrink-0" />
                  <span className="font-semibold text-foreground">{receipt.guest_name}</span> ({receipt.guest_email})
                </div>
                <div className="flex items-center gap-2 text-foreground/60">
                  <Building className="w-3.5 h-3.5 text-gold shrink-0" />
                  <span>{receipt.resort_name} — <strong className="text-gold">{receipt.room_type}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-foreground/60">
                  <Calendar className="w-3.5 h-3.5 text-gold shrink-0" />
                  <span>{receipt.start_date} to {receipt.end_date} ({receipt.nights} Nights)</span>
                </div>
              </div>

              <div className="space-y-2 font-mono sm:text-right border-t sm:border-t-0 border-gold/10 pt-2 sm:pt-0">
                <div>
                  <span className="text-foreground/50 text-[10px] block uppercase">Payment Method</span>
                  <span className="font-semibold text-foreground">{receipt.payment_method}</span>
                </div>
                <div>
                  <span className="text-foreground/50 text-[10px] block uppercase">Transaction ID</span>
                  <span className="text-gold text-[11px] break-all">{receipt.payment_id}</span>
                </div>
                <div>
                  <span className="text-foreground/50 text-[10px] block uppercase">Settlement Date</span>
                  <span className="text-foreground/70">{receipt.paid_at}</span>
                </div>
              </div>
            </div>

            {/* Financial Ledger Table */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-gold uppercase tracking-wider flex items-center gap-1.5 border-b border-gold/10 pb-2">
                <FileText className="w-3.5 h-3.5" /> Itemized Charges Breakdown
              </h4>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between items-center py-1 border-b border-gold/10">
                  <span className="text-foreground/70">{receipt.room_type} ({receipt.nights} Nights @ ₹{receipt.nightly_rate.toLocaleString()}/night)</span>
                  <span className="font-semibold">₹{receipt.subtotal.toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center py-1 text-foreground/50 text-[11px]">
                  <span>VIP Inclusive Taxes & Service Surcharges (Included)</span>
                  <span>₹{receipt.gst_tax_included.toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-t border-gold/20 text-sm font-sans font-bold">
                  <span className="uppercase text-gold tracking-wider">Total Paid Settlement</span>
                  <span className="font-editorial text-xl text-gold">₹{receipt.grand_total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Included Privileges */}
            <div className="p-4 bg-background/60 rounded-xl border border-gold/15 space-y-2">
              <span className="text-[10px] text-gold uppercase tracking-widest font-semibold block items-center gap-1">
                <Sparkles className="w-3 h-3" /> Complimentary VIP Privileges Included
              </span>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] text-foreground/70">
                {receipt.inclusions.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3 h-3 text-gold shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-2 print:hidden">
              <span className="text-[10px] text-foreground/40 font-mono">
                256-bit Encrypted Transaction Ledger · Verified by Sandeep Treasury
              </span>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={handlePrint}
                  className="flex-1 sm:flex-none px-4 py-2.5 bg-gold hover:bg-gold/90 text-background font-bold text-xs uppercase tracking-wider rounded-lg transition flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                >
                  <Printer className="w-4 h-4" /> Print / Save Receipt
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2.5 border border-gold/30 text-foreground/70 hover:text-gold text-xs uppercase tracking-wider font-semibold rounded-lg transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </>
        ) : null}

      </div>
    </div>
  );
}
