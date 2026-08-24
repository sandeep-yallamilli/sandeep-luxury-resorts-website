"use client";

import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Html } from "@react-three/drei";
import * as THREE from "three";

// Resort location coordinates (lat, lon) mapped to 3D sphere coordinates
interface ResortLocation {
  name: string;
  lat: number;
  lon: number;
  country: string;
  description: string;
}

const RESORTS: ResortLocation[] = [
  { name: "Sandeep Maldives Private Pavilion", lat: 3.2, lon: 73.0, country: "Maldives", description: "Exclusive overwater sanctuary with private infinity pools." },
  { name: "Sandeep Bali Forest Sanctuary", lat: -8.4, lon: 115.1, country: "Indonesia", description: "Jungle retreat built into volcanic cliffs overlooking sacred rivers." },
  { name: "Sandeep Kyoto Zen Pavilion", lat: 35.0, lon: 135.7, country: "Japan", description: "Minimalist garden retreat surrounded by ancient maple trees." },
  { name: "Sandeep Alps Snow Chalet", lat: 46.0, lon: 7.7, country: "Switzerland", description: "Ultra-luxury ski-in chalet with soaring panoramic peaks." },
  { name: "Sandeep Rajasthan Desert Tent", lat: 26.0, lon: 76.3, country: "India", description: "Opulent safari tents on the edge of tigers' hunting grounds." },
  { name: "Sandeep Santorini Caldera Cliffside", lat: 36.39, lon: 25.46, country: "Greece", description: "White-washed cliffside cave suites hanging over the Aegean Caldera." },
  { name: "Sandeep Amalfi Coast Cliff Manor", lat: 40.63, lon: 14.48, country: "Italy", description: "Hanging terraced citrus gardens and cliffside stone manors in Positano." },
  { name: "Sandeep Bora Bora Overwater Lagoon", lat: -16.50, lon: -151.74, country: "French Polynesia", description: "Overwater coral bungalows under Mount Otemanu with glass floor views." },
  { name: "Sandeep Serengeti Wildlife Sanctuary", lat: -2.33, lon: 34.83, country: "Tanzania", description: "Savanna luxury tented pavilions along the Great Migration corridor." },
  { name: "Sandeep Fiji Private Island Sanctuary", lat: -17.7134, lon: 177.1154, country: "Fiji", description: "Private turquoise coral reef lagoon and overwater glass villa sanctuary." }
];


// Helper to convert Lat/Lon to Vector3 coordinates on a sphere of radius R
function convertLatLngToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.sin(theta));
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.cos(theta);

  return new THREE.Vector3(x, y, z);
}

function GlobeModel({ onHoverResort }: { onHoverResort: (resort: ResortLocation | null) => void }) {
  const globeRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Slowly rotate the globe if not hovered
  useFrame((state, delta) => {
    if (groupRef.current && hoveredIndex === null) {
      groupRef.current.rotation.y += 0.05 * delta;
    }
  });

  const radius = 2.5;

  return (
    <group ref={groupRef}>
      {/* Central Globe Sphere */}
      <mesh ref={globeRef}>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshStandardMaterial
          color="#081120"
          roughness={0.7}
          metalness={0.2}
          wireframe={true}
          transparent={true}
          opacity={0.35}
        />
      </mesh>

      {/* Inner glowing core */}
      <mesh>
        <sphereGeometry args={[radius - 0.05, 32, 32]} />
        <meshBasicMaterial color="#05070A" transparent={true} opacity={0.8} />
      </mesh>

      {/* Grid Overlay lines to look high-tech and Awwwards-level */}
      <gridHelper args={[10, 10, "#D6B56C", "#081120"]} position={[0, -radius, 0]} />

      {/* Resort Coordinate Markers */}
      {RESORTS.map((resort, idx) => {
        const position = convertLatLngToVector3(resort.lat, resort.lon, radius);
        const isHovered = hoveredIndex === idx;

        return (
          <group key={resort.name} position={position}>
            {/* Pulsing base ring */}
            <mesh>
              <ringGeometry args={[0.08, 0.12, 16]} />
              <meshBasicMaterial
                color={isHovered ? "#4FD1C5" : "#D6B56C"}
                side={THREE.DoubleSide}
                transparent
                opacity={0.8}
              />
            </mesh>

            {/* Glowing Coordinate Dot */}
            <mesh
              onPointerOver={(e) => {
                e.stopPropagation();
                setHoveredIndex(idx);
                onHoverResort(resort);
                document.body.style.cursor = "pointer";
              }}
              onPointerOut={() => {
                setHoveredIndex(null);
                onHoverResort(null);
                document.body.style.cursor = "default";
              }}
            >
              <sphereGeometry args={[isHovered ? 0.08 : 0.05, 16, 16]} />
              <meshBasicMaterial color={isHovered ? "#4FD1C5" : "#D6B56C"} />
            </mesh>

            {/* Editorial tooltips embedded directly in the 3D space */}
            {isHovered && (
              <Html distanceFactor={8} position={[0, 0.2, 0]} center>
                <div className="glass-panel text-white p-3 rounded-lg border border-gold/30 shadow-2xl w-56 text-xs transition-opacity duration-300">
                  <div className="text-gold font-editorial font-medium mb-1 tracking-wider uppercase">{resort.country}</div>
                  <h4 className="font-semibold text-white mb-1 font-sans">{resort.name}</h4>
                  <p className="text-foreground/70 leading-relaxed font-sans">{resort.description}</p>
                </div>
              </Html>
            )}
          </group>
        );
      })}
    </group>
  );
}

export default function InteractiveGlobe() {
  const [activeResort, setActiveResort] = useState<ResortLocation | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-80 sm:h-100 md:h-125 lg:h-150 flex items-center justify-center bg-background text-foreground rounded-2xl border border-gold/10 transition-colors duration-500">
        <div className="text-center p-6">
          <h3 className="font-editorial text-xl sm:text-2xl text-gold mb-2">Explore the World of Sandeep</h3>
          <p className="text-xs sm:text-sm text-foreground/60 max-w-md">Our global sanctuaries are situated in the world&apos;s most pristine destinations. Spin the interactive globe to begin your journey.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-87.5 sm:h-105 md:h-125 lg:h-150 bg-background rounded-2xl overflow-hidden border border-gold/10 shadow-2xl transition-colors duration-500">
      {/* UI Overlay Panel */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10 max-w-70 sm:max-w-sm pointer-events-none">
        <span className="text-gold tracking-[0.2em] text-[9px] sm:text-[10px] uppercase block mb-0.5 sm:mb-1">Interactive Globe</span>
        <h3 className="font-editorial text-xl sm:text-3xl text-foreground mb-1 sm:mb-2 leading-tight">Global Sanctuaries</h3>
        <p className="text-foreground/60 text-[10px] sm:text-xs leading-relaxed font-sans hidden sm:block">
          Hover over the glowing markers to preview our ultra-luxury resorts. Use drag to rotate the globe and scroll to zoom.
        </p>
      </div>

      {activeResort && (
        <div className="absolute bottom-4 right-4 left-4 sm:left-auto sm:bottom-6 sm:right-6 z-10 sm:max-w-xs glass-panel text-foreground p-4 sm:p-5 rounded-xl border border-gold/20 shadow-2xl animate-fade-in-up">
          <span className="text-gold tracking-[0.2em] text-[9px] sm:text-[10px] uppercase font-semibold">{activeResort.country}</span>
          <h4 className="font-editorial text-lg sm:text-xl text-foreground mt-0.5 sm:mt-1 mb-1 sm:mb-2">{activeResort.name}</h4>
          <p className="text-foreground/70 text-[11px] sm:text-xs leading-relaxed mb-3 sm:mb-4">{activeResort.description}</p>
          <a href={`/resorts#${activeResort.country.toLowerCase()}`} className="text-gold text-xs font-semibold hover:text-foreground transition-colors duration-300 inline-flex items-center gap-1">
            Explore Destination &rarr;
          </a>
        </div>
      )}

      {/* React Three Fiber Canvas */}
      <Canvas camera={{ position: [0, 0, 5.5], fov: 60 }} dpr={[1, 1.5]} gl={{ antialias: true, powerPreference: "high-performance" }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1.2} color="#D6B56C" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4FD1C5" />

        <GlobeModel onHoverResort={setActiveResort} />

        <Stars radius={100} depth={50} count={300} factor={4} saturation={0} fade speed={1} />
        <OrbitControls
          enableZoom={true}
          minDistance={3.5}
          maxDistance={8}
          enablePan={false}
          autoRotate={false}
        />
      </Canvas>
    </div>
  );
}

