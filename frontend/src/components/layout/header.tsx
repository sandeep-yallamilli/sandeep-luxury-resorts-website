import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Compass, User } from "lucide-react";
import ThemeToggle from "@/components/ui/theme-toggle";
import Logo from "@/components/ui/logo";

const NAV_ITEMS = [
  { label: "Destinations", href: "/resorts" },
  { label: "Villas", href: "/villas" },
  { label: "Experiences", href: "/experiences" },
  { label: "Wellness", href: "/wellness" },
  { label: "Dining", href: "/dining" },
  { label: "Weddings", href: "/weddings" },
  { label: "Membership", href: "/membership" }
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-in-out ${
      isScrolled || mobileMenuOpen
        ? "bg-background/98 backdrop-blur-xl border-b border-gold/20 py-2.5 sm:py-3.5 shadow-xl"
        : "bg-linear-to-b from-black/80 via-black/40 to-transparent py-4 sm:py-6 md:py-7"
      }`}>
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 flex items-center justify-between">

        {/* Brand Logo */}
        <Link to="/" onClick={() => setMobileMenuOpen(false)} className="shrink-0">
          <Logo 
            iconClassName="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9"
            className={!isScrolled && !mobileMenuOpen ? "[&_span.text-foreground]:text-white" : ""} 
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-9">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className={`text-[11px] uppercase tracking-[0.2em] transition-colors duration-500 luxury-link ${
                isScrolled ? "text-foreground/75 hover:text-gold" : "text-white/85 hover:text-gold"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Action CTAs */}
        <div className="hidden lg:flex items-center gap-4 xl:gap-6">
          <ThemeToggle />
          <Link
            to="/profile"
            className={`flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] transition-colors duration-500 font-medium ${
              isScrolled ? "text-foreground/80 hover:text-gold" : "text-white/90 hover:text-gold"
            }`}
          >
            <User className="w-3.5 h-3.5 text-gold" /> Signin
          </Link>
          <Link
            to="/concierge"
            className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-gold font-medium hover:text-foreground transition-colors duration-500"
          >
            <Compass className="w-3.5 h-3.5" /> Concierge
          </Link>
          <Link
            to="/book"
            className="px-5 xl:px-8 py-2 xl:py-2.5 border border-gold text-gold hover:bg-gold hover:text-background font-medium text-[10px] tracking-[0.2em] uppercase transition-all duration-500 backdrop-blur-xs rounded-md"
          >
            Reserve
          </Link>
        </div>

        {/* Mobile menu trigger & Theme toggle for small screens */}
        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-1.5 sm:p-2 rounded-lg transition-colors duration-300 ${
              isScrolled || mobileMenuOpen ? "text-foreground hover:text-gold" : "text-white hover:text-gold"
            }`}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 sm:w-7 sm:h-7 text-gold" /> : <Menu className="w-6 h-6 sm:w-7 sm:h-7" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-full h-[calc(100dvh-54px)] sm:h-[calc(100dvh-64px)] z-40 bg-background/98 backdrop-blur-2xl text-foreground flex flex-col justify-between p-5 sm:p-8 animate-fade-in-up overflow-y-auto shadow-2xl border-t border-gold/15">
          <nav className="flex flex-col gap-2.5 sm:gap-4 py-2 sm:py-4 border-b border-gold/10">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base sm:text-xl font-editorial text-foreground hover:text-gold transition-colors flex items-center justify-between py-1.5 sm:py-2 border-b border-foreground/5 last:border-0"
              >
                <span>{item.label}</span>
                <span className="text-[10px] font-sans text-gold/70 tracking-widest uppercase">&rarr;</span>
              </Link>
            ))}
          </nav>

          <div className="flex flex-col gap-3 pt-4 pb-8">
            <Link
              to="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 text-[11px] uppercase tracking-[0.2em] text-foreground font-medium py-3 border border-gold/20 rounded-xl hover:bg-gold/5 transition-colors"
            >
              <User className="w-4 h-4 text-gold" /> Guest Passport Dashboard
            </Link>
            <Link
              to="/concierge"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 text-[11px] uppercase tracking-[0.2em] text-gold font-medium py-3 border border-gold/20 rounded-xl hover:bg-gold/5 transition-colors"
            >
              <Compass className="w-4 h-4" /> AI Concierge Assistant
            </Link>
            <Link
              to="/book"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-3.5 bg-gold hover:bg-gold/90 text-background font-semibold text-[11px] tracking-[0.2em] uppercase transition-all duration-500 rounded-xl shadow-lg"
            >
              Reserve Sanctuary
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}


