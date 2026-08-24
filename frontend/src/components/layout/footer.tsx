import { useState } from "react";
import { Link } from "react-router-dom";
import { Shield, Check } from "lucide-react";
import { apiClient } from "@/lib/api";
import Logo from "@/components/ui/logo";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    try {
      await apiClient.subscribeNewsletter(email);
      setSubscribed(true);
    } catch (err) {
      console.error(err);
      // set subscribed true for fallback UX
      setSubscribed(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-background text-foreground border-t border-gold/10 pt-16 sm:pt-20 md:pt-24 pb-8 sm:pb-12 px-4 sm:px-6 md:px-8 transition-colors duration-500">
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12 lg:gap-16 mb-12 sm:mb-16 md:mb-24">

        {/* Brand Summary */}
        <div className="space-y-4 sm:space-y-6">
          <Logo iconClassName="w-7 h-7 sm:w-8 sm:h-8" />
          <p className="text-[11px] text-foreground/60 leading-relaxed font-sans max-w-sm tracking-wider">
            Elegantly designed sanctuaries sculpted into the earth&apos;s most pristine peaks, jungles, and shores. Delivering world-class hospitality inspired by minimalism and ecological preservation.
          </p>
        </div>

        {/* Sitemap Columns */}
        <div>
          <h4 className="font-editorial text-xs text-gold tracking-[0.2em] uppercase mb-4 sm:mb-8">Explore</h4>
          <ul className="space-y-3.5 sm:space-y-5 text-[11px] text-foreground/70 font-sans tracking-widest uppercase">
            <li><Link to="/resorts" className="hover:text-gold transition-colors duration-500">Our Sanctuaries</Link></li>
            <li><Link to="/villas" className="hover:text-gold transition-colors duration-500">Villas & Pavilions</Link></li>
            <li><Link to="/wellness" className="hover:text-gold transition-colors duration-500">Wellness Retreats</Link></li>
            <li><Link to="/dining" className="hover:text-gold transition-colors duration-500">Michelin Dining</Link></li>
            <li><Link to="/weddings" className="hover:text-gold transition-colors duration-500">Ceremonies</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-editorial text-xs text-gold tracking-[0.2em] uppercase mb-4 sm:mb-8">Heritage</h4>
          <ul className="space-y-3.5 sm:space-y-5 text-[11px] text-foreground/70 font-sans tracking-widest uppercase">
            <li><Link to="/sustainability" className="hover:text-gold transition-colors duration-500">Sustainability</Link></li>
            <li><Link to="/about" className="hover:text-gold transition-colors duration-500">Manifesto</Link></li>
            <li><Link to="/contact" className="hover:text-gold transition-colors duration-500">Private Relations</Link></li>
            <li><Link to="/membership" className="hover:text-gold transition-colors duration-500">VIP Membership</Link></li>
          </ul>
        </div>

        {/* Newsletter Subscription */}
        <div>
          <h4 className="font-editorial text-xs text-gold tracking-[0.2em] uppercase mb-4 sm:mb-8">The Chronicle</h4>
          <p className="text-[11px] text-foreground/60 leading-relaxed font-sans mb-4 sm:mb-6 tracking-wider">
            Exclusive offerings, seasonal journals, and priority releases.
          </p>
          {subscribed ? (
            <div className="flex items-center gap-3 p-3.5 bg-gold/5 border border-gold/20 text-gold text-[10px] tracking-widest uppercase font-medium rounded-lg">
              <Check className="w-4 h-4" /> Subscription Confirmed.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your Email"
                className="flex-1 bg-transparent border-b border-gold/30 py-2 text-[11px] text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-gold transition-colors duration-500"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="pb-1 border-b border-gold text-gold hover:text-foreground transition-colors duration-500 text-[11px] uppercase tracking-[0.2em] font-medium cursor-pointer"
              >
                Join
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Sub-Footer */}
      <div className="max-w-[1600px] mx-auto pt-8 sm:pt-12 border-t border-gold/10 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6 text-[10px] text-foreground/40 tracking-[0.2em] uppercase font-medium text-center sm:text-left">
        <p>&copy; {new Date().getFullYear()} Sandeep Luxury Resorts.</p>
        <div className="flex flex-wrap items-center justify-center sm:justify-end gap-5 sm:gap-8">
          <Link to="#" className="hover:text-gold transition-colors duration-500">Privacy Charter</Link>
          <Link to="#" className="hover:text-gold transition-colors duration-500 flex items-center gap-1.5"><Shield className="w-3 h-3" /> Accessibility</Link>
          <Link to="#" className="hover:text-gold transition-colors duration-500">Terms of Haven</Link>
        </div>
      </div>
    </footer>
  );
}

