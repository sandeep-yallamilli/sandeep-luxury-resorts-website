import React, { useId } from "react";

export type LogoVariant = "monogram" | "crest" | "pavilion" | "lotus" | "minimal";

export interface LogoProps {
  className?: string;
  iconClassName?: string;
  showText?: boolean;
  variant?: LogoVariant;
  layout?: "horizontal" | "stacked";
  subtitle?: string;
  useGoldGradient?: boolean;
}

export default function Logo({
  className = "",
  iconClassName = "w-9 h-9",
  showText = true,
  variant = "monogram",
  layout = "horizontal",
  subtitle = "LUXURY RESORTS",
  useGoldGradient = true,
}: LogoProps) {
  const idPrefix = useId().replace(/:/g, "_");
  const goldGradId = `goldGrad_${idPrefix}`;
  const strokeColor = useGoldGradient ? `url(#${goldGradId})` : "currentColor";
  const fillColor = useGoldGradient ? `url(#${goldGradId})` : "currentColor";

  const renderIcon = () => {
    return (
      <svg
        className={`transition-all duration-700 ease-out group-hover:scale-105 group-hover:rotate-1 shrink-0 ${iconClassName} ${
          !useGoldGradient ? "text-gold" : ""
        }`}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={goldGradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF3B0" />
            <stop offset="25%" stopColor="#E5C07B" />
            <stop offset="55%" stopColor="#C5A059" />
            <stop offset="85%" stopColor="#9C7A33" />
            <stop offset="100%" stopColor="#D4AF37" />
          </linearGradient>
        </defs>

        {/* 1. Flagship Monogram: Interlocking Royal S & R in Diamond Cartouche */}
        {variant === "monogram" && (
          <g>
            {/* Outer Diamond Cartouche */}
            <path
              d="M50 4 L95 49 L50 94 L5 49 Z"
              stroke={strokeColor}
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Corner Facet Brackets */}
            <path
              d="M45 9 L50 4 L55 9"
              stroke={strokeColor}
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M45 89 L50 94 L55 89"
              stroke={strokeColor}
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10 44 L5 49 L10 54"
              stroke={strokeColor}
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M90 44 L95 49 L90 54"
              stroke={strokeColor}
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Inner Concentric Fine Diamond */}
            <path
              d="M50 11 L88 49 L50 87 L12 49 Z"
              stroke={strokeColor}
              strokeWidth="0.75"
              strokeDasharray="2 3"
              opacity="0.5"
            />

            {/* Top 8-Point Celestial Star */}
            <g transform="translate(50, 18)">
              <path
                d="M0 -6.5 L1.6 -1.6 L6.5 0 L1.6 1.6 L0 6.5 L-1.6 1.6 L-6.5 0 L-1.6 -1.6 Z"
                fill={fillColor}
              />
              <path
                d="M0 -4 L0.9 -0.9 L4 0 L0.9 0.9 L0 4 L-0.9 0.9 L-4 0 L-0.9 -0.9 Z"
                fill="#FFF9DF"
                opacity="0.9"
              />
              <circle cx="0" cy="0" r="0.8" fill="#FFFFFF" />
            </g>

            {/* East & West Micro Star Facets */}
            <polygon
              points="19,49 21,47 23,49 21,51"
              fill={fillColor}
              opacity="0.75"
            />
            <polygon
              points="81,49 79,47 77,49 79,51"
              fill={fillColor}
              opacity="0.75"
            />

            {/* Interlocking S & R Luxury Letterforms */}
            {/* 'S' Serif Letterform */}
            <path
              d="M36 34 C36 32 38.5 30.5 44 30.5 C50 30.5 53 33 53 37 C53 41.5 48.5 44 41 46 C33.5 48 28.5 51.5 28.5 56.5 C28.5 62.5 33.5 66 42 66 C48 66 51.5 63.5 53.5 61"
              stroke={strokeColor}
              strokeWidth="2.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* S Serif Finials */}
            <circle cx="35.5" cy="35" r="1.3" fill={fillColor} />
            <circle cx="53.5" cy="60" r="1.3" fill={fillColor} />

            {/* 'R' Serif Letterform */}
            {/* R Stem Serifs */}
            <path
              d="M53.5 30.5 H61.5 M53.5 66 H61.5"
              stroke={strokeColor}
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            {/* R Vertical Stem */}
            <path
              d="M57.5 30.5 V66"
              stroke={strokeColor}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* R Bowl */}
            <path
              d="M57.5 30.5 H67.5 C74 30.5 77.5 34 77.5 39.5 C77.5 45 74 48.5 67.5 48.5 H57.5"
              stroke={strokeColor}
              strokeWidth="2.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* R Diagonal Leg with Elegant Swash */}
            <path
              d="M65.5 48.5 C68.5 53 71.5 59 78 66"
              stroke={strokeColor}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* R Foot Serif */}
            <path
              d="M74.5 66 H80"
              stroke={strokeColor}
              strokeWidth="1.2"
              strokeLinecap="round"
            />

            {/* Pedestal Horizon Line & Bottom Gem */}
            <path
              d="M33 76 H67"
              stroke={strokeColor}
              strokeWidth="1"
              strokeLinecap="round"
              opacity="0.6"
            />
            <path
              d="M42 79 H58"
              stroke={strokeColor}
              strokeWidth="0.7"
              strokeLinecap="round"
              opacity="0.4"
            />
            <polygon points="50,74 52.5,76 50,78 47.5,76" fill={fillColor} />
          </g>
        )}

        {/* 2. Crest: Imperial Crown & Roman Laurel Wreath */}
        {variant === "crest" && (
          <g>
            <circle
              cx="50"
              cy="52"
              r="44"
              stroke={strokeColor}
              strokeWidth="1"
              strokeDasharray="3 3"
              opacity="0.6"
            />
            <circle
              cx="50"
              cy="52"
              r="41"
              stroke={strokeColor}
              strokeWidth="0.75"
              opacity="0.4"
            />

            {/* Imperial Coronet Crown */}
            <g transform="translate(50, 15)">
              <path
                d="M-15 10 H15"
                stroke={strokeColor}
                strokeWidth="1.2"
                strokeLinecap="round"
              />
              <circle cx="-10" cy="10" r="0.8" fill={fillColor} />
              <circle cx="0" cy="10" r="0.8" fill={fillColor} />
              <circle cx="10" cy="10" r="0.8" fill={fillColor} />
              <path
                d="M-14 10 L-14 4 L-7 7 L0 0 L7 7 L14 4 L14 10"
                stroke={strokeColor}
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              <circle cx="-14" cy="3" r="1.2" fill={fillColor} />
              <circle cx="-7" cy="6" r="1" fill={fillColor} />
              <circle cx="0" cy="-1" r="1.5" fill={fillColor} />
              <circle cx="7" cy="6" r="1" fill={fillColor} />
              <circle cx="14" cy="3" r="1.2" fill={fillColor} />
            </g>

            {/* Left Laurel Wreath */}
            <path
              d="M22 62 C16 46 22 34 32 28"
              stroke={strokeColor}
              strokeWidth="1"
              strokeLinecap="round"
              opacity="0.7"
              fill="none"
            />
            <path
              d="M22 38 C18 36 17 32 20 30 C22 32 24 35 22 38 Z"
              fill={fillColor}
              opacity="0.85"
            />
            <path
              d="M18 48 C14 46 13 42 16 40 C18 42 20 45 18 48 Z"
              fill={fillColor}
              opacity="0.85"
            />
            <path
              d="M18 58 C14 57 14 52 17 50 C19 52 20 55 18 58 Z"
              fill={fillColor}
              opacity="0.85"
            />
            <path
              d="M22 68 C19 68 18 63 22 61 C23 63 24 66 22 68 Z"
              fill={fillColor}
              opacity="0.85"
            />

            {/* Right Laurel Wreath */}
            <path
              d="M78 62 C84 46 78 34 68 28"
              stroke={strokeColor}
              strokeWidth="1"
              strokeLinecap="round"
              opacity="0.7"
              fill="none"
            />
            <path
              d="M78 38 C82 36 83 32 80 30 C78 32 76 35 78 38 Z"
              fill={fillColor}
              opacity="0.85"
            />
            <path
              d="M82 48 C86 46 87 42 84 40 C82 42 80 45 82 48 Z"
              fill={fillColor}
              opacity="0.85"
            />
            <path
              d="M82 58 C86 57 86 52 83 50 C81 52 80 55 82 58 Z"
              fill={fillColor}
              opacity="0.85"
            />
            <path
              d="M78 68 C81 68 82 63 78 61 C77 63 76 66 78 68 Z"
              fill={fillColor}
              opacity="0.85"
            />

            {/* Central Crest Monogram: Imperial 'S' */}
            <path
              d="M41 40 C41 37.5 44 35.5 49.5 35.5 C56 35.5 59.5 38.5 59.5 42.5 C59.5 47 54.5 49.5 46.5 51.5 C38.5 53.5 33.5 57 33.5 62.5 C33.5 69 39 72.5 48.5 72.5 C55 72.5 59 70 61 67"
              stroke={strokeColor}
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="40.5" cy="41" r="1.5" fill={fillColor} />
            <circle cx="61.5" cy="66" r="1.5" fill={fillColor} />

            {/* Bottom Ribbon / Pedestal Flourish */}
            <path
              d="M30 84 C38 80 62 80 70 84"
              stroke={strokeColor}
              strokeWidth="1.2"
              strokeLinecap="round"
              fill="none"
              opacity="0.8"
            />
            <polygon points="50,81 52,83 50,85 48,83" fill={fillColor} />
          </g>
        )}

        {/* 3. Pavilion: Sanctuary Villa & Celestial Sun */}
        {variant === "pavilion" && (
          <g>
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke={strokeColor}
              strokeWidth="1.2"
              opacity="0.75"
            />
            <circle
              cx="50"
              cy="50"
              r="41"
              stroke={strokeColor}
              strokeWidth="0.6"
              opacity="0.4"
            />

            {/* Rising Sun */}
            <circle
              cx="50"
              cy="30"
              r="7.5"
              stroke={strokeColor}
              strokeWidth="1.2"
              fill={fillColor}
              fillOpacity="0.15"
            />
            <path
              d="M50 14 V19 M50 41 V46 M34 30 H39 M61 30 H66"
              stroke={strokeColor}
              strokeWidth="0.9"
              strokeLinecap="round"
            />
            <path
              d="M38.5 18.5 L42 22 M58 38 L61.5 41.5 M61.5 18.5 L58 22 M42 38 L38.5 41.5"
              stroke={strokeColor}
              strokeWidth="0.75"
              strokeLinecap="round"
              opacity="0.7"
            />

            {/* Pagoda Villa Roof Lines */}
            <path
              d="M16 52 C26 47 38 39 50 37 C62 39 74 47 84 52"
              stroke={strokeColor}
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M26 57 C34 52 42 46 50 44.5 C58 46 66 52 74 57"
              stroke={strokeColor}
              strokeWidth="1.2"
              strokeLinecap="round"
              opacity="0.7"
            />

            {/* Architectural Columns & Deck */}
            <path
              d="M33 55 V69 M50 47 V69 M67 55 V69"
              stroke={strokeColor}
              strokeWidth="1.4"
              strokeLinecap="round"
            />
            <path
              d="M26 69 H74"
              stroke={strokeColor}
              strokeWidth="1.5"
              strokeLinecap="round"
            />

            {/* Overwater Still Ripples */}
            <path
              d="M19 75 C31 73 42 77 50 75 C58 73 69 77 81 75"
              stroke={strokeColor}
              strokeWidth="1.2"
              strokeLinecap="round"
              opacity="0.85"
            />
            <path
              d="M27 81 C36 79 43 83 50 81 C57 79 64 83 73 81"
              stroke={strokeColor}
              strokeWidth="0.8"
              strokeLinecap="round"
              opacity="0.55"
            />
          </g>
        )}

        {/* 4. Lotus: Sacred Geometry Blossom */}
        {variant === "lotus" && (
          <g>
            <polygon
              points="50,4 85,19 96,54 75,89 25,89 4,54 15,19"
              stroke={strokeColor}
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.5"
            />

            {/* Center Spire Petal */}
            <path
              d="M50 14 C43 28 39 44 50 68 C61 44 57 28 50 14 Z"
              stroke={strokeColor}
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill={fillColor}
              fillOpacity="0.12"
            />
            <path
              d="M50 20 V62"
              stroke={strokeColor}
              strokeWidth="0.8"
              opacity="0.6"
              strokeLinecap="round"
            />

            {/* Inner Left Petal */}
            <path
              d="M50 36 C38 30 25 40 28 56 C34 66 44 64 50 68"
              stroke={strokeColor}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />

            {/* Inner Right Petal */}
            <path
              d="M50 36 C62 30 75 40 72 56 C66 66 56 64 50 68"
              stroke={strokeColor}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />

            {/* Outer Blooming Left & Right Petals */}
            <path
              d="M50 48 C30 42 14 54 16 68 C24 76 38 74 50 75"
              stroke={strokeColor}
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.8"
            />
            <path
              d="M50 48 C70 42 86 54 84 68 C76 76 62 74 50 75"
              stroke={strokeColor}
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.8"
            />

            {/* Central Star Jewel Core */}
            <g transform="translate(50, 48)">
              <polygon
                points="0,-4 1.2,-1.2 4,0 1.2,1.2 0,4 -1.2,1.2 -4,0 -1.2,-1.2"
                fill={fillColor}
              />
              <circle cx="0" cy="0" r="0.7" fill="#FFFFFF" />
            </g>

            {/* Pedestal Pod */}
            <path
              d="M30 78 C38 82 62 82 70 78"
              stroke={strokeColor}
              strokeWidth="1.2"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="50" cy="81" r="1.5" fill={fillColor} />
            <path
              d="M38 86 H62"
              stroke={strokeColor}
              strokeWidth="0.8"
              strokeLinecap="round"
              opacity="0.5"
            />
          </g>
        )}

        {/* 5. Minimal: Modern Ultra-Luxury Geometric Seal */}
        {variant === "minimal" && (
          <g>
            <circle
              cx="50"
              cy="50"
              r="44"
              stroke={strokeColor}
              strokeWidth="1.2"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke={strokeColor}
              strokeWidth="0.6"
              strokeDasharray="2 2"
              opacity="0.6"
            />
            <path
              d="M38 34 C38 32 41 30 46 30 C51 30 54 32.5 54 36 C54 40 50 42.5 44 44 C38 45.5 34 48 34 52.5 C34 57 38 60 45 60 C50 60 53 58 54 56"
              stroke={strokeColor}
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <path
              d="M58 30 V60 M58 30 H66 C71 30 74 33 74 38 C74 43 71 46 66 46 H58 M64 46 L74 60"
              stroke={strokeColor}
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="50" cy="18" r="1.5" fill={fillColor} />
            <circle cx="50" cy="82" r="1.5" fill={fillColor} />
          </g>
        )}
      </svg>
    );
  };

  if (layout === "stacked") {
    return (
      <div className={`flex flex-col items-center group select-none text-center ${className}`}>
        {renderIcon()}
        {showText && (
          <div className="mt-3 flex flex-col items-center leading-none">
            <span className="font-editorial text-2xl md:text-3xl tracking-[0.26em] text-foreground font-normal uppercase transition-colors duration-500 group-hover:text-gold">
              SANDEEP
            </span>
            <div className="flex items-center gap-2 mt-1.5 opacity-90">
              <span className="inline-block w-3.5 h-px bg-linear-to-r from-transparent to-gold/60" />
              <span className="font-sans text-[8.5px] md:text-[9.5px] tracking-[0.42em] text-gold uppercase font-medium">
                {subtitle}
              </span>
              <span className="inline-block w-3.5 h-px bg-linear-to-l from-transparent to-gold/60" />
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3.5 group select-none ${className}`}>
      {renderIcon()}

      {showText && (
        <div className="flex flex-col select-none leading-none">
          <span className="font-editorial text-xl md:text-2xl tracking-[0.22em] text-foreground font-normal uppercase transition-colors duration-500 group-hover:text-gold">
            SANDEEP
          </span>
          <span className="font-sans text-[8.5px] md:text-[9.5px] tracking-[0.38em] text-gold uppercase font-medium mt-1 flex items-center gap-1.5 opacity-90">
            <span className="inline-block w-2 h-px bg-gold/50" />
            {subtitle}
            <span className="inline-block w-2 h-px bg-gold/50" />
          </span>
        </div>
      )}
    </div>
  );
}
