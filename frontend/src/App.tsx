import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import Logo from "@/components/ui/logo";

// Code-split pages for ultra-fast initial bundle load
const Home = lazy(() => import("@/pages/Home"));
const Resorts = lazy(() => import("@/pages/Resorts"));
const ResortDetail = lazy(() => import("@/pages/ResortDetail"));
const Villas = lazy(() => import("@/pages/Villas"));
const Experiences = lazy(() => import("@/pages/Experiences"));
const Wellness = lazy(() => import("@/pages/Wellness"));
const Dining = lazy(() => import("@/pages/Dining"));
const Weddings = lazy(() => import("@/pages/Weddings"));
const Membership = lazy(() => import("@/pages/Membership"));
const Sustainability = lazy(() => import("@/pages/Sustainability"));
const About = lazy(() => import("@/pages/About"));
const Contact = lazy(() => import("@/pages/Contact"));
const Concierge = lazy(() => import("@/pages/Concierge"));
const Book = lazy(() => import("@/pages/Book"));
const Login = lazy(() => import("@/pages/Login"));
const Register = lazy(() => import("@/pages/Register"));
const Profile = lazy(() => import("@/pages/Profile"));

function PageLoader() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background text-foreground transition-colors duration-500">
      <div className="flex flex-col items-center space-y-4 animate-fade-in-up">
        <div className="relative flex items-center justify-center w-20 h-20 rounded-full border border-gold/30 bg-gold/5 shadow-2xl">
          <Logo showText={false} iconClassName="w-12 h-12 animate-pulse" />
        </div>
        <span className="font-editorial text-xl tracking-widest text-gold uppercase">Sandeep Luxury Resorts</span>
        <div className="w-24 h-0.5 bg-gold/20 overflow-hidden relative rounded-full">
          <div className="w-1/2 h-full bg-gold animate-shimmer absolute left-0 top-0" />
        </div>
      </div>
    </div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/resorts" element={<Resorts />} />
          <Route path="/resorts/:slug" element={<ResortDetail />} />
          <Route path="/villas" element={<Villas />} />
          <Route path="/experiences" element={<Experiences />} />
          <Route path="/services" element={<Experiences />} />
          <Route path="/wellness" element={<Wellness />} />
          <Route path="/dining" element={<Dining />} />
          <Route path="/weddings" element={<Weddings />} />
          <Route path="/membership" element={<Membership />} />
          <Route path="/sustainability" element={<Sustainability />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/concierge" element={<Concierge />} />
          <Route path="/book" element={<Book />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Suspense>
    </>
  );
}
