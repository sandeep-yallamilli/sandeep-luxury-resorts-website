import { Star, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { getBackendImageUrl, handleImageError } from "@/lib/api";

interface ResortCardProps {
  slug: string;
  name: string;
  location: string;
  description: string;
  rating: number;
  image: string;
  priceStart: number | string;
}

export default function ResortCard({
  slug,
  name,
  location,
  description,
  rating,
  image,
  priceStart
}: ResortCardProps) {
  return (
    <div className="group bg-background border border-gold/30 overflow-hidden rounded-2xl gold-glow-card shadow-2xl flex flex-col h-full relative">
      {/* Visual aspect preview */}
      {image ? (
        <div className="relative h-56 sm:h-64 md:h-72 w-full overflow-hidden border-b border-gold/20">
          <img
            src={getBackendImageUrl(image)}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out absolute inset-0"
            loading="lazy"
            onError={handleImageError}
          />
          <div className="absolute inset-0 bg-linear-to-t from-background via-background/20 to-transparent opacity-80" />
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-slate-950/80 backdrop-blur-md px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-gold font-bold flex items-center gap-1.5 border border-gold/40 shadow-xl">
            <MapPin className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-gold" /> {location.split(",")[1]?.trim() || location}
          </div>
        </div>
      ) : null}

      {/* Info Details */}
      <div className="p-5 sm:p-7 md:p-8 flex-1 flex flex-col justify-between space-y-4 sm:space-y-6">
        <div>
          <div className="flex justify-between items-center mb-2.5 sm:mb-3">
            <span className="text-[9px] sm:text-[10px] text-gold tracking-[0.25em] uppercase font-bold">{location}</span>
            <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-gold/15 border border-gold/40 text-gold shadow-sm">
              <Star className="w-3 sm:w-3.5 h-3 sm:h-3.5 fill-gold text-gold" />
              <span className="text-[9px] sm:text-[10px] text-foreground font-bold">{rating.toFixed(1)}</span>
            </div>
          </div>
          <h3 className="font-editorial text-xl sm:text-2xl md:text-3xl text-foreground font-semibold mb-2 sm:mb-3 group-hover:text-gold transition-colors duration-500">
            {name}
          </h3>
          <p className="text-foreground/75 text-[11px] sm:text-xs leading-relaxed font-sans tracking-[0.01em] line-clamp-3">
            {description}
          </p>
        </div>

        {/* Action button bar */}
        <div className="flex justify-between items-end border-t border-gold/15 pt-4 sm:pt-5">
          <div>
            <span className="text-[8.5px] sm:text-[9px] text-foreground/50 uppercase tracking-[0.2em] block mb-0.5 font-mono">Rates From</span>
            <span className="font-editorial text-xl sm:text-2xl text-gold font-bold">₹{Number(priceStart).toLocaleString()} <span className="text-[9px] sm:text-[10px] text-foreground/60 font-sans tracking-normal font-normal">/ night</span></span>
          </div>
          <Link
            to={`/resorts/${slug}`}
            className="group/link flex items-center gap-2 text-[9.5px] sm:text-[10px] uppercase tracking-[0.2em] text-gold font-bold transition-all duration-500 hover:text-foreground"
          >
            Explore <div className="w-6 sm:w-10 h-px bg-gold group-hover/link:w-10 sm:group-hover/link:w-14 transition-all duration-500" />
          </Link>
        </div>
      </div>
    </div>
  );
}

