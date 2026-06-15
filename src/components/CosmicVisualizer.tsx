import React, { useState, useEffect } from "react";

interface Props {
  type: string;
  imageCaption?: string;
}

export default function CosmicVisualizer({ type, imageCaption }: Props) {
  // Shared state for interactive diagrams
  const [sliderMass, setSliderMass] = useState(10); // in solar masses
  const [interactiveParam, setInteractiveParam] = useState(50);
  const [tick, setTick] = useState(0);

  // Simple animation ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setTick((prev) => (prev + 1) % 360);
    }, 40);
    return () => clearInterval(interval);
  }, []);

  // Compute Schwarzschild radius: Rs = 3km * Mass (approx)
  const rsRadius = (3 * sliderMass).toFixed(1);

  // Render proper simulation based on question visualType
  const renderSimulation = () => {
    switch (type) {
      case "accretion":
        return (
          <div className="relative w-full h-56 flex items-center justify-center bg-black/80 rounded-xl overflow-hidden border border-cyan-500/20">
            <svg className="w-full h-full max-w-xs" viewBox="0 0 200 200">
              <defs>
                <radialGradient id="accGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#7C3AED" stopOpacity="0" />
                </radialGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              {/* Accretion ring gas */}
              <ellipse
                cx="100"
                cy="100"
                rx="85"
                ry="22"
                fill="none"
                stroke="url(#accGlow)"
                strokeWidth="16"
                transform={`rotate(${-tick * 0.4}, 100, 100)`}
              />
              <ellipse
                cx="100"
                cy="100"
                rx="70"
                ry="15"
                fill="none"
                stroke="#06B6D4"
                strokeWidth="6"
                filter="url(#glow)"
                opacity="0.8"
                transform={`rotate(${tick * 1.5}, 100, 100)`}
              />
              <ellipse
                cx="100"
                cy="100"
                rx="55"
                ry="10"
                fill="none"
                stroke="#F97316"
                strokeWidth="3"
                filter="url(#glow)"
                transform={`rotate(${tick * 2}, 100, 100)`}
              />
              {/* Central Black Hole Sphere */}
              <circle cx="100" cy="100" r="28" fill="#000" />
              {/* Shadow event horizon edge */}
              <circle cx="100" cy="100" r="30" fill="none" stroke="#7C3AED" strokeWidth="1.5" opacity="0.6" filter="url(#glow)" />
              {/* Relativistic Jet beams */}
              <path d="M 100 0 L 100 200" stroke="#06B6D4" strokeWidth="2" strokeDasharray="5, 10" opacity="0.5" filter="url(#glow)" />
              <path d="M 100 60 L 100 140" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.8" />
            </svg>
            <div className="absolute top-2 left-2 text-[10px] font-mono text-cyan-400 bg-black/70 px-1.5 py-0.5 rounded border border-cyan-500/30">
              SIMULASI: PIRINGAN AKRESI
            </div>
          </div>
        );

      case "stellar_collapse":
        // Blue Supergiant collapses into a black hole
        const step = Math.floor(tick / 60) % 3; // 0: Star, 1: Expansion/Supernova, 2: Black Hole remnant
        return (
          <div className="relative w-full h-56 flex items-center justify-center bg-black/80 rounded-xl overflow-hidden border border-cyan-500/20">
            <svg className="w-full h-full max-w-xs" viewBox="0 0 200 200">
              <defs>
                <radialGradient id="starGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#1E3A8A" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="novaGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#F97316" stopOpacity="1" />
                  <stop offset="40%" stopColor="#EC4899" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#7C3AED" stopOpacity="0" />
                </radialGradient>
              </defs>
              
              {step === 0 && (
                <g>
                  {/* Phase 0: Blue star stable */}
                  <circle cx="100" cy="100" r="50" fill="url(#starGlow)" />
                  <circle cx="100" cy="100" r="30" fill="#E0F2FE" opacity={0.8 + Math.sin(tick * 0.1) * 0.1} />
                  <text x="100" y="180" textAnchor="middle" fill="#93C5FD" fontSize="10" fontFamily="sans-serif">Tahap 1: Bintang Biru Raksasa</text>
                </g>
              )}

              {step === 1 && (
                <g>
                  {/* Phase 1: Supernova Blast wave */}
                  <circle cx="100" cy="100" r={20 + (tick % 60) * 2} fill="url(#novaGlow)" />
                  <circle cx="100" cy="100" r="10" fill="#FFFFFF" />
                  <text x="100" y="180" textAnchor="middle" fill="#F97416" fontSize="10" fontFamily="sans-serif">Tahap 2: Ledakan Supernova</text>
                </g>
              )}

              {step === 2 && (
                <g>
                  {/* Phase 2: Remnant Black hole */}
                  <circle cx="100" cy="100" r="60" fill="none" stroke="#2563EB" strokeWidth="0.5" strokeDasharray="4,4" opacity="0.4" />
                  <ellipse cx="100" cy="100" rx="75" ry="10" fill="none" stroke="#312E81" strokeWidth="3" opacity="0.6" />
                  <circle cx="100" cy="100" r="18" fill="#000000" />
                  <circle cx="100" cy="100" r="21" fill="none" stroke="#06B6D4" strokeWidth="1" opacity="0.7" />
                  <text x="100" y="180" textAnchor="middle" fill="#A78BFA" fontSize="10" fontFamily="sans-serif">Tahap 3: Inti Runtuh Menjadi Lubang Hitam</text>
                </g>
              )}
            </svg>
            <div className="absolute top-2 left-2 text-[10px] font-mono text-cyan-400 bg-black/70 px-1.5 py-0.5 rounded border border-cyan-500/30">
              SIKLUS: KERUNTUHAN GRAVITASI
            </div>
          </div>
        );

      case "bending_light":
        return (
          <div className="relative w-full h-56 flex items-center justify-center bg-black/80 rounded-xl overflow-hidden border border-cyan-500/20">
            <svg className="w-full h-full max-w-xs" viewBox="0 0 200 200">
              {/* Photon Paths */}
              {/* Trajectory 1: Deflected */}
              <path d="M 0 45 Q 90 40 105 80 T 50 200" fill="none" stroke="#F43F5E" strokeWidth="2" strokeDasharray="4,4" opacity="0.6"/>
              {/* Trajectory 2: Trapped/Swallowed */}
              <path d="M 0 85 Q 85 85 100 100" fill="none" stroke="#EC4899" strokeWidth="2" />
              <circle cx="100" cy="100" r="12" fill="#EC4899">
                <animate attributeName="r" values="2;4;2" dur="1s" repeatCount="indefinite" />
              </circle>
              {/* Trajectory 3: Unaffected */}
              <path d="M 0 10 L 200 10" fill="none" stroke="#10B981" strokeWidth="1.5" />
              
              {/* Black hole */}
              <circle cx="100" cy="100" r="22" fill="#000000" />
              <circle cx="100" cy="100" r="24" fill="none" stroke="#3B82F6" strokeWidth="2" opacity="0.8" />
              
              <text x="10" y="35" fill="#F43F5E" fontSize="8" fontFamily="sans-serif">Sinar Terbelokkan</text>
              <text x="10" y="75" fill="#EC4899" fontSize="8" fontFamily="sans-serif">Sinar Tersedot</text>
              <text x="10" y="19" fill="#10B981" fontSize="8" fontFamily="sans-serif">Sinar Lurus</text>
            </svg>
            <div className="absolute top-2 left-2 text-[10px] font-mono text-cyan-400 bg-black/70 px-1.5 py-0.5 rounded border border-cyan-500/30">
              FISIKA: PEMBELOKAN CAHAYA (LENSING)
            </div>
          </div>
        );

      case "event_horizon":
        return (
          <div className="relative w-full h-56 flex items-center justify-center bg-black/80 rounded-xl overflow-hidden border border-cyan-500/20">
            <svg className="w-full h-full max-w-xs" viewBox="0 0 200 200">
              <defs>
                <radialGradient id="redshift" cx="40%" cy="40%" r="60%">
                  <stop offset="0%" stopColor="#000000" />
                  <stop offset="60%" stopColor="#7C3AED" stopOpacity="0.4" />
                  <stop offset="85%" stopColor="#EF4444" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#06B6D4" stopOpacity="0" />
                </radialGradient>
              </defs>
              <circle cx="100" cy="100" r="80" fill="url(#redshift)" />
              {/* Event horizon boundary line */}
              <circle cx="100" cy="100" r="45" fill="#000" stroke="#EF4444" strokeWidth="2" />
              <text x="100" y="103" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="bold" fontFamily="sans-serif">BATAS TIADA KEMBALI</text>
              <text x="100" y="165" textAnchor="middle" fill="#EF4444" fontSize="8" fontFamily="sans-serif">Cakrawala Peristiwa</text>
              {/* Falling light arrows */}
              <path d="M 100 15 L 100 35 M 100 35 L 96 30 M 100 35 L 104 30" stroke="#EF4444" strokeWidth="2" opacity="0.7" />
            </svg>
            <div className="absolute top-2 left-2 text-[10px] font-mono text-cyan-400 bg-black/70 px-1.5 py-0.5 rounded border border-cyan-500/30">
              STRUKTUR: EVENT HORIZON
            </div>
          </div>
        );

      case "singularity":
        return (
          <div className="relative w-full h-56 flex items-center justify-center bg-black/80 rounded-xl overflow-hidden border border-cyan-500/20">
            <svg className="w-full h-full max-w-xs" viewBox="0 0 200 200">
              {/* Warped space-time mesh funnel lines */}
              <path d="M 5 60 Q 100 60 100 160 Q 100 60 195 60" fill="none" stroke="#4B5563" strokeWidth="1" />
              <path d="M 15 65 Q 100 65 100 160 Q 100 65 185 65" fill="none" stroke="#1E40AF" strokeWidth="1" />
              <path d="M 35 70 Q 100 70 100 160 Q 100 70 165 70" fill="none" stroke="#3B82F6" strokeWidth="1.5" />
              <path d="M 60 80 Q 100 80 100 160 Q 100 80 140 80" fill="none" stroke="#06B6D4" strokeWidth="2" />
              
              {/* Flat space indicators */}
              <line x1="5" y1="60" x2="195" y2="60" stroke="#374151" strokeWidth="1" strokeDasharray="3,3" />
              
              {/* Singularity Point */}
              <circle cx="100" cy="160" r="4" fill="#FFFFFF" />
              <circle cx="100" cy="160" r="10" fill="none" stroke="#67E8F9" strokeWidth="1" opacity="0.6">
                <animate attributeName="r" values="3;12;3" dur="2s" repeatCount="indefinite" />
              </circle>
              
              <text x="100" y="45" textAnchor="middle" fill="#9CA3AF" fontSize="9" fontFamily="sans-serif">Struktur Ruang-Waktu Mendatar</text>
              <text x="100" y="185" textAnchor="middle" fill="#06B6D4" fontSize="10" fontWeight="bold" fontFamily="sans-serif">Singularitas (Kepadatan Tak Terhingga)</text>
            </svg>
            <div className="absolute top-2 left-2 text-[10px] font-mono text-cyan-400 bg-black/70 px-1.5 py-0.5 rounded border border-cyan-500/30">
              MATEMATIKA: KELENGKUNGAN INFINIT
            </div>
          </div>
        );

      case "spaghettification":
        return (
          <div className="relative w-full h-56 flex items-center justify-center bg-black/80 rounded-xl overflow-hidden border border-cyan-500/20">
            <svg className="w-full h-full max-w-xs" viewBox="0 0 200 200">
              {/* Tidal stretches */}
              <path d="M 100 10 C 100 10, 80 40, 95 80 C 100 95, 99 110, 100 150" fill="none" stroke="#06B6D4" strokeWidth="2.5" opacity="0.7">
                <animate attributeName="strokeDashoffset" values="0;20" dur="1s" repeatCount="indefinite" />
              </path>
              <path d="M 100 10 C 100 10, 120 40, 105 80 C 100 95, 101 110, 100 150" fill="none" stroke="#7C3AED" strokeWidth="2.5" opacity="0.7" />

              {/* Stretched astronaut figure */}
              <g transform="translate(0, 0)">
                {/* Head */}
                <circle cx="100" cy="30" r="7" fill="#F3F4F6" stroke="#9CA3AF" strokeWidth="1" />
                {/* Extremely stretched torso */}
                <path d="M 100 37 L 100 110" stroke="#F3F4F6" strokeWidth="4" strokeLinecap="round" />
                {/* Spaghetti legs merging into center */}
                <path d="M 98 108 L 100 155" stroke="#FFFFFF" strokeWidth="1.5" />
                <path d="M 102 108 L 100 155" stroke="#FFFFFF" strokeWidth="1.5" />
                {/* Stretched arms */}
                <path d="M 100 50 Q 88 55 93 85" fill="none" stroke="#E5E7EB" strokeWidth="2.5" />
                <path d="M 100 50 Q 112 55 107 85" fill="none" stroke="#E5E7EB" strokeWidth="2.5" />
              </g>

              {/* Accretion throat at bottom */}
              <ellipse cx="100" cy="160" rx="40" ry="12" fill="none" stroke="#EC4899" strokeWidth="4" opacity="0.7" />
              <circle cx="100" cy="160" r="14" fill="#000" />
              <text x="100" y="190" textAnchor="middle" fill="#E5E7EB" fontSize="9" fontFamily="sans-serif">Tarikan Pasang Surut Spageti</text>
            </svg>
            <div className="absolute top-2 left-2 text-[10px] font-mono text-cyan-400 bg-black/70 px-1.5 py-0.5 rounded border border-cyan-500/30">
              EFEK: SPAGETIFIKASI (TIDAL FORCE)
            </div>
          </div>
        );

      case "hawking_radiation":
        return (
          <div className="relative w-full h-56 flex items-center justify-center bg-black/80 rounded-xl overflow-hidden border border-cyan-500/20">
            <svg className="w-full h-full max-w-xs" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="40" fill="#000" stroke="#EC4899" strokeWidth="1.5" />
              
              {/* Event horizon boundary shadow */}
              <circle cx="100" cy="100" r="41" fill="none" stroke="#7C3AED" strokeWidth="1" strokeDasharray="3,3" />

              {/* Virtual particles spawning near horizon */}
              {/* Pair 1: Escaping (+) and Swallowed (-) */}
              <g>
                <line x1="145" y1="85" x2="165" y2="70" stroke="#34D399" strokeWidth="1" strokeDasharray="2,2" />
                <circle cx="165" cy="70" r="5" fill="#10B981" />
                <text x="163" y="73" fill="#FFF" fontSize="8" fontWeight="bold" fontFamily="sans-serif">+</text>
                
                <line x1="145" y1="85" x2="120" y2="100" stroke="#EF4444" strokeWidth="1" />
                <circle cx="120" cy="100" r="5" fill="#EF4444" />
                <text x="118" y="103" fill="#FFF" fontSize="8" fontWeight="bold" fontFamily="sans-serif">-</text>
                <text x="165" y="60" textAnchor="middle" fill="#34D399" fontSize="8" fontFamily="sans-serif">Radiasi Lolos</text>
              </g>

              {/* Pair 2: Swallowed (+) and Escaping (-) */}
              <g>
                <line x1="55" y1="115" x2="35" y2="130" stroke="#38BDF8" strokeWidth="1" strokeDasharray="2,2" />
                <circle cx="35" cy="130" r="5" fill="#0284C7" />
                <text x="33" y="133" fill="#FFF" fontSize="8" fontWeight="bold" fontFamily="sans-serif">-</text>

                <line x1="55" y1="115" x2="75" y2="105" stroke="#EF4444" strokeWidth="1" />
                <circle cx="75" cy="105" r="5" fill="#EF4444" />
                <text x="73" y="108" fill="#FFF" fontSize="8" fontWeight="bold" fontFamily="sans-serif">+</text>
              </g>
              
              <text x="100" y="180" textAnchor="middle" fill="#F472B6" fontSize="9" fontFamily="sans-serif">Penguapan Kuantum Stephen Hawking</text>
            </svg>
            <div className="absolute top-2 left-2 text-[10px] font-mono text-cyan-400 bg-black/70 px-1.5 py-0.5 rounded border border-cyan-500/30">
              KUANTUM: RADIASI HAWKING
            </div>
          </div>
        );

      case "historical_formula":
        return (
          <div className="relative w-full h-64 flex flex-col items-center justify-center bg-slate-950 p-3 rounded-xl border border-cyan-500/20">
            {/* Real-time slider interactive calculator */}
            <div className="text-center mb-1">
              <span className="text-[11px] font-mono text-cyan-400 tracking-wider">KALKULATOR SCHWARZSCHILD</span>
            </div>
            
            <div className="bg-black/80 px-3 py-2 rounded-lg border border-cyan-500/10 w-full mb-3 text-center">
              <p className="text-[10px] text-slate-400 font-mono mb-1">Rumus Radius Schwarzschild:</p>
              <div className="text-sm font-semibold text-white tracking-widest font-mono">
                Rs = <span className="text-cyan-400">2GM / c²</span> &asymp; <span className="text-purple-400">3km &times; M</span>
              </div>
              <p className="text-xs text-cyan-300 mt-2 font-mono font-bold">
                Massa: <span className="text-amber-400">{sliderMass} M&odot;</span> (Massa Matahari)
              </p>
              <p className="text-xs text-purple-300 mt-0.5 font-mono">
                Ukuran Lubang Hitam (Rs): <span className="text-green-400 font-bold">{rsRadius} Km</span>
              </p>
            </div>

            <div className="w-full px-2 mb-2">
              <label className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
                <span>Atur Massa Bintang:</span>
                <span className="font-bold text-cyan-400">{sliderMass} Solar Mass</span>
              </label>
              <input
                type="range"
                min="3"
                max="100"
                value={sliderMass}
                onChange={(e) => setSliderMass(parseInt(e.target.value))}
                className="w-full accent-cyan-500 bg-slate-800 rounded-lg appearance-none h-1.5 cursor-pointer"
              />
            </div>

            {/* Dynamic visual scaling sphere */}
            <div className="relative w-full h-16 flex items-center justify-center">
              <div 
                className="bg-black rounded-full border-2 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all duration-300 flex items-center justify-center"
                style={{ 
                  width: `${Math.max(10, Math.min(60, sliderMass * 0.6))}px`, 
                  height: `${Math.max(10, Math.min(60, sliderMass * 0.6))}px` 
                }}
              >
                <span className="text-[8px] font-mono text-white opacity-80">{rsRadius}km</span>
              </div>
            </div>
          </div>
        );

      case "invisible":
        return (
          <div className="relative w-full h-56 flex items-center justify-center bg-black/80 rounded-xl overflow-hidden border border-cyan-500/20">
            <svg className="w-full h-full max-w-xs" viewBox="0 0 200 200">
              {/* Backing warped stars pattern */}
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#2B2D42" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="200" height="200" fill="url(#grid)" />
              
              {/* Lensed concentric warping rings */}
              <circle cx="100" cy="100" r="50" fill="none" stroke="#06B6D4" strokeWidth="1.5" opacity="0.3" />
              <circle cx="100" cy="100" r="35" fill="none" stroke="#7C3AED" strokeWidth="3" opacity="0.5" />
              {/* Gravitational Lens core */}
              <circle cx="100" cy="100" r="20" fill="#000000" />
              
              {/* Warped glowing Einstein Ring star boundary */}
              <circle cx="100" cy="100" r="23" fill="none" stroke="#F59E0B" strokeWidth="2.5" filter="url(#glow)" />
              
              <text x="100" y="165" textAnchor="middle" fill="#9CA3AF" fontSize="8" fontFamily="sans-serif">Bintang Melengkung (Cincin Einstein)</text>
              <text x="100" y="180" textAnchor="middle" fill="#F59E0B" fontSize="9" fontWeight="bold" fontFamily="sans-serif">Lensa Gravitasi Ekstrem</text>
            </svg>
            <div className="absolute top-2 left-2 text-[10px] font-mono text-cyan-400 bg-black/70 px-1.5 py-0.5 rounded border border-cyan-500/30">
              FISIKA: LENSA GRAVITASI
            </div>
          </div>
        );

      case "sgr_a":
        return (
          <div className="relative w-full h-56 flex items-center justify-center bg-black/80 rounded-xl overflow-hidden border border-cyan-500/20">
            <svg className="w-full h-full max-w-xs" viewBox="0 0 200 200">
              {/* Sgr A* orbits of real stars (S2, S10 etc) */}
              <ellipse cx="100" cy="100" rx="40" ry="85" fill="none" stroke="#EF4444" strokeWidth="1" strokeDasharray="3,3" transform="rotate(30, 100, 100)" />
              <ellipse cx="100" cy="100" rx="75" ry="35" fill="none" stroke="#10B981" strokeWidth="1" strokeDasharray="5,3" transform="rotate(-40, 100, 100)" />
              <ellipse cx="100" cy="100" rx="55" ry="20" fill="none" stroke="#3B82F6" strokeWidth="1" transform="rotate(15, 100, 100)" />
              
              {/* Central Sgr A* core (nearly invisible, tiny outline) */}
              <circle cx="100" cy="100" r="4" fill="#000000" stroke="#06B6D4" strokeWidth="1" />
              {/* Pulsing gas flares */}
              <circle cx="100" cy="100" r="10" fill="none" stroke="#7C3AED" strokeWidth="1" opacity="0.5">
                <animate attributeName="r" values="3;16;3" dur="3s" repeatCount="indefinite" />
              </circle>

              <text x="100" y="175" textAnchor="middle" fill="#6B7280" fontSize="8" fontFamily="sans-serif">Orbit Keplerian Bintang S0-2 di Galaksi Kita</text>
              <text x="100" y="190" textAnchor="middle" fill="#FFF" fontSize="9" fontWeight="bold" fontFamily="sans-serif">Sagittarius A* (Pusat Bima Sakti)</text>
            </svg>
            <div className="absolute top-2 left-2 text-[10px] font-mono text-cyan-400 bg-black/70 px-1.5 py-0.5 rounded border border-cyan-500/30">
              PENGAMATAN: ORBIT SGR A*
            </div>
          </div>
        );

      case "eht":
        return (
          <div className="relative w-full h-64 flex flex-col items-center justify-center bg-slate-950 p-3 rounded-xl border border-cyan-500/20">
            <span className="text-[10px] font-mono text-cyan-400 mb-1">INTERAKTIF: RESOLUSI TELESKOP EHT</span>
            
            <div className="relative w-32 h-32 bg-black rounded-lg border border-cyan-500/10 overflow-hidden flex items-center justify-center">
              {/* Outer hot accretion blur */}
              <div 
                className="absolute w-24 h-24 rounded-full bg-orange-600 transition-all duration-300"
                style={{ filter: `blur(${Math.max(1, 15 - interactiveParam * 0.15)}px)`, opacity: 0.8 }}
              />
              <div 
                className="absolute w-16 h-16 rounded-full bg-amber-400 transition-all duration-300"
                style={{ filter: `blur(${Math.max(0.5, 10 - interactiveParam * 0.1)}px)`, opacity: 0.9 }}
              />
              {/* Event horizon dark pit */}
              <div className="absolute w-10 h-10 rounded-full bg-black z-10" />
            </div>

            <div className="w-full mt-3 px-2">
              <label className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
                <span>Garis Dasar Teleskop Se-Bumi (Aperture):</span>
                <span className="font-bold text-amber-400">{interactiveParam}%</span>
              </label>
              <input
                type="range"
                min="10"
                max="100"
                value={interactiveParam}
                onChange={(e) => setInteractiveParam(parseInt(e.target.value))}
                className="w-full accent-cyan-500 bg-slate-800 rounded-lg appearance-none h-1.5 cursor-pointer"
              />
              <div className="text-[10px] font-mono text-center text-slate-400 mt-2">
                {interactiveParam < 50 ? "⚠️ Citra Kabur (Teleskop kurang luas)" : "✅ Citra Tajam Cincin Oranye (Citra EHT Nyata)"}
              </div>
            </div>
          </div>
        );

      case "earth_orbit":
        return (
          <div className="relative w-full h-56 flex items-center justify-center bg-black/80 rounded-xl overflow-hidden border border-cyan-500/20">
            <svg className="w-full h-full max-w-xs" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="60" fill="none" stroke="#2563EB" strokeWidth="1.5" opacity="0.6"/>
              
              {/* Center Black Hole Replacing Sun */}
              <circle cx="100" cy="100" r="10" fill="#000000" stroke="#EF4444" strokeWidth="2" />
              <circle cx="100" cy="100" r="13" fill="none" stroke="#7C3AED" strokeWidth="1" opacity="0.5" />
              
              {/* Earth orbiting */}
              <g transform={`rotate(${tick}, 100, 100)`}>
                <circle cx="100" cy="40" r="6" fill="#3B82F6" /> {/* Earth */}
                <circle cx="100" cy="40" r="8" fill="none" stroke="#38BDF8" strokeWidth="1" opacity="0.5" />
                {/* Cold ice overlay indicator since sun is dark */}
                <text x="100" y="32" textAnchor="middle" fill="#93C5FD" fontSize="6" fontFamily="sans-serif">Bumi Beku</text>
              </g>

              <text x="100" y="175" textAnchor="middle" fill="#9CA3AF" fontSize="8" fontFamily="sans-serif">Meskipun Matahari Jadi Lubang Hitam,</text>
              <text x="100" y="190" textAnchor="middle" fill="#10B981" fontSize="9" fontWeight="bold" fontFamily="sans-serif">Gaya Gravitasi Orbit Tetap Stabil</text>
            </svg>
            <div className="absolute top-2 left-2 text-[10px] font-mono text-cyan-400 bg-black/70 px-1.5 py-0.5 rounded border border-cyan-500/30">
              UJI KONSEP: ORBIT BUMI
            </div>
          </div>
        );

      case "evaporation":
        return (
          <div className="relative w-full h-56 flex items-center justify-center bg-black/80 rounded-xl overflow-hidden border border-cyan-500/20">
            <svg className="w-full h-full max-w-xs" viewBox="0 0 200 200">
              {/* Animated evaporation rings/photons flying out */}
              <circle cx="100" cy="100" r={40 + (tick % 40)} fill="none" stroke="#EC4899" strokeWidth="1.5" opacity={(40 - (tick % 40)) / 40} />
              <circle cx="100" cy="100" r={10 + (tick % 60) * 1.5} fill="none" stroke="#F59E0B" strokeWidth="1" opacity={(60 - (tick % 60)) / 60} />
              
              {/* Shrinking core simulating loss of mass */}
              <circle cx="100" cy="100" r={Math.max(2, 30 - (tick % 100) * 0.28)} fill="#000000" stroke="#EF4444" strokeWidth="2" />
              <circle cx="100" cy="100" r="2" fill="#FFFFFF" />

              <text x="100" y="175" textAnchor="middle" fill="#F472B6" fontSize="8" fontFamily="sans-serif">Mass Lost Over Time &rarr; Evaporasi Akhir</text>
              <text x="100" y="190" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="bold" fontFamily="sans-serif">Ledakan Sumbu Penguapan</text>
            </svg>
            <div className="absolute top-2 left-2 text-[10px] font-mono text-cyan-400 bg-black/70 px-1.5 py-0.5 rounded border border-cyan-500/30">
              KOSMIS: EVAPORASI MASSA
            </div>
          </div>
        );

      case "supermassive":
        return (
          <div className="relative w-full h-56 flex items-center justify-center bg-black/80 rounded-xl overflow-hidden border border-cyan-500/20">
            <svg className="w-full h-full max-w-xs" viewBox="0 0 200 200">
              {/* Giant black hole TON 618 horizon taking most of space */}
              <circle cx="100" cy="100" r="85" fill="#020202" stroke="#EF4444" strokeWidth="4" />
              {/* Accretion glow edge */}
              <circle cx="100" cy="100" r="89" fill="none" stroke="#F59E0B" strokeWidth="1" opacity="0.5" />
              
              {/* Tiny tiny solar system inside representing scales */}
              <circle cx="100" cy="100" r="6" fill="#FBBF24" /> {/* Sun */}
              <circle cx="100" cy="100" r="14" fill="none" stroke="#4B5563" strokeWidth="0.5" /> {/* Neptune Orbit */}
              <circle cx="114" cy="100" r="1.5" fill="#10B981" /> {/* Planet */}
              
              {/* Scaling pointers */}
              <text x="100" y="17" textAnchor="middle" fill="#EF4444" fontSize="10" fontWeight="bold" fontFamily="sans-serif">TON 618 (66 Miliar Sun Mass)</text>
              <text x="100" y="118" textAnchor="middle" fill="#FBBF24" fontSize="6" fontFamily="sans-serif">Seluruh Tata Surya Kita</text>
              <text x="100" y="125" textAnchor="middle" fill="#FBBF24" fontSize="5" fontFamily="sans-serif">(Kerdil di Dalam Lubang Hitam Supermasif)</text>
            </svg>
            <div className="absolute top-2 left-2 text-[10px] font-mono text-cyan-400 bg-black/70 px-1.5 py-0.5 rounded border border-cyan-500/30">
              PERBANDINGAN SKALA: TON 618
            </div>
          </div>
        );

      case "merger":
        return (
          <div className="relative w-full h-56 flex items-center justify-center bg-black/80 rounded-xl overflow-hidden border border-cyan-500/20">
            <svg className="w-full h-full max-w-xs" viewBox="0 0 200 200">
              {/* Gravitational Wave Concentric Circles */}
              <circle cx="100" cy="100" r={30 + (tick % 30) * 2} fill="none" stroke="#22D3EE" strokeWidth="1" opacity={(30 - (tick % 30)) / 30} />
              <circle cx="100" cy="100" r={10 + (tick % 50) * 1.5} fill="none" stroke="#818CF8" strokeWidth="1.5" opacity={(50 - (tick % 50)) / 50} />
              
              {/* Two merging black holes rotating around common center */}
              <g transform={`rotate(${tick * 4}, 100, 100)`}>
                {/* BH 1 */}
                <circle cx="75" cy="100" r="12" fill="#000" stroke="#06B6D4" strokeWidth="1.5" />
                {/* BH 2 */}
                <circle cx="125" cy="100" r="8" fill="#000" stroke="#7C3AED" strokeWidth="1.5" />
                
                {/* Gas siphons connecting them */}
                <path d="M 87 100 Q 100 90 117 100" fill="none" stroke="#F59E0B" strokeWidth="1" />
              </g>

              <text x="100" y="180" textAnchor="middle" fill="#E5E7EB" fontSize="10" fontWeight="bold" fontFamily="sans-serif">LIGO: Gelombang Gravitasi</text>
            </svg>
            <div className="absolute top-2 left-2 text-[10px] font-mono text-cyan-400 bg-black/70 px-1.5 py-0.5 rounded border border-cyan-500/30">
              MATERI: TABRAKAN KOSMIS (MERGER)
            </div>
          </div>
        );

      case "cygnus_x1":
        return (
          <div className="relative w-full h-56 flex items-center justify-center bg-black/80 rounded-xl overflow-hidden border border-cyan-500/20">
            <svg className="w-full h-full max-w-xs" viewBox="0 0 200 200">
              {/* Blue Giant Companion Star */}
              <circle cx="45" cy="100" r="35" fill="none" stroke="#06B6D4" strokeWidth="1" />
              <circle cx="45" cy="100" r="32" fill="#38BDF8" opacity="0.8" />
              <circle cx="45" cy="100" r="15" fill="#E0F2FE" />
              
              {/* Accretion bridge of gas pulled towards Black Hole */}
              <path d="M 75 100 Q 120 120 150 100" fill="none" stroke="#F59E0B" strokeWidth="4">
                <animate attributeName="strokeDashoffset" values="0;18" dur="1s" repeatCount="indefinite" />
              </path>
              
              {/* Cyber Black Hole cygnus x-1 */}
              <circle cx="155" cy="100" r="11" fill="#000" stroke="#F59E0B" strokeWidth="2" />
              <ellipse cx="155" cy="100" rx="20" ry="5" fill="none" stroke="#EF4444" strokeWidth="1" />

              <text x="45" y="152" textAnchor="middle" fill="#38BDF8" fontSize="8" fontFamily="sans-serif">Bintang Biru HDE 226868</text>
              <text x="155" y="152" textAnchor="middle" fill="#F59E0B" fontSize="8" fontFamily="sans-serif">Cygnus X-1 BH</text>
              <text x="100" y="185" textAnchor="middle" fill="#EF4444" fontSize="10" fontWeight="bold" fontFamily="sans-serif">Transmisi Gas Bintang Biner</text>
            </svg>
            <div className="absolute top-2 left-2 text-[10px] font-mono text-cyan-400 bg-black/70 px-1.5 py-0.5 rounded border border-cyan-500/30">
              PENGAMATAN: SISTEM CARY CYGNUS X-1
            </div>
          </div>
        );

      case "time_dilation":
        return (
          <div className="relative w-full h-56 flex items-center justify-around bg-black/80 rounded-xl overflow-hidden border border-cyan-500/20 p-2">
            {/* Clock 1: Normal Time */}
            <div className="flex flex-col items-center">
              <span className="text-[9px] font-mono text-emerald-400">JAM JAUH (NORMAL)</span>
              <svg className="w-20 h-20 mt-1" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="35" fill="none" stroke="#10B981" strokeWidth="2" />
                {/* Fast rotating hand */}
                <line x1="50" y1="50" x2={50 + Math.cos(tick * 0.15) * 30} y2={50 + Math.sin(tick * 0.15) * 30} stroke="#10B981" strokeWidth="2.5" />
                <circle cx="50" cy="50" r="3" fill="#FFF" />
              </svg>
              <span className="text-xs font-mono text-emerald-400 mt-1 font-bold">1 Detik = 1s</span>
            </div>

            {/* Gravity pit divider */}
            <div className="w-0.5 h-16 bg-slate-700 self-center" />

            {/* Clock 2: Warp slow Time */}
            <div className="flex flex-col items-center">
              <span className="text-[9px] font-mono text-rose-400">JAM TEPI LUBANG (LAMBAT)</span>
              <svg className="w-20 h-20 mt-1" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="35" fill="none" stroke="#F43F5E" strokeWidth="2" />
                {/* Very slow rotating hand */}
                <line x1="50" y1="50" x2={50 + Math.cos(tick * 0.02) * 30} y2={50 + Math.sin(tick * 0.02) * 30} stroke="#F43F5E" strokeWidth="2.5" />
                <circle cx="50" cy="50" r="3" fill="#FFF" />
              </svg>
              <span className="text-xs font-mono text-rose-400 mt-1 font-bold">1 Detik = 3600s</span>
            </div>
            <div className="absolute top-2 left-2 text-[10px] font-mono text-cyan-400 bg-black/70 px-1.5 py-0.5 rounded border border-cyan-500/30">
              TEORI: DILATASI WAKTU GRAVITASI
            </div>
          </div>
        );

      case "kerr":
        return (
          <div className="relative w-full h-56 flex items-center justify-center bg-black/80 rounded-xl overflow-hidden border border-cyan-500/20">
            <svg className="w-full h-full max-w-xs" viewBox="0 0 200 200">
              {/* Spinning frame dragging coordinate curls */}
              <path d="M 0 100 C 50 100, 70 80, 100 100" fill="none" stroke="#CCC" strokeWidth="0.5" opacity="0.3" transform={`rotate(${tick * 1.5}, 100, 100)`} />
              <path d="M 200 100 C 150 100, 130 120, 100 100" fill="none" stroke="#CCC" strokeWidth="0.5" opacity="0.3" transform={`rotate(${tick * 1.5}, 100, 100)`} />
              
              {/* Ergosphere (outer distorted flattened ring) */}
              <ellipse cx="100" cy="100" rx="65" ry="46" fill="none" stroke="#06B6D4" strokeWidth="2.5" strokeDasharray="6,4" />
              <text x="100" y="32" textAnchor="middle" fill="#06B6D4" fontSize="8" fontFamily="sans-serif">Ergosfer (Ruang Terseret)</text>
              
              {/* Flattened Kerr event horizon (spinning) */}
              <ellipse cx="100" cy="100" rx="38" ry="32" fill="#000" stroke="#7C3AED" strokeWidth="3" />
              <text x="100" y="180" textAnchor="middle" fill="#FFF" fontSize="9" fontWeight="bold" fontFamily="sans-serif">Lubang Hitam Berputar (Kerr)</text>
            </svg>
            <div className="absolute top-2 left-2 text-[10px] font-mono text-cyan-400 bg-black/70 px-1.5 py-0.5 rounded border border-cyan-500/30">
              FISIKA: PENYERETAN RUANG (FRAME DRAGGING)
            </div>
          </div>
        );

      case "wheeler":
        return (
          <div className="relative w-full h-56 flex items-center justify-center bg-slate-900 border-2 border-amber-800 rounded-xl p-4 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(#1E293B_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
            <div className="relative z-10 text-center font-serif text-amber-100 max-w-xs">
              <span className="text-[10px] font-mono text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded bg-amber-950/40">FRASA SEJARAH</span>
              <p className="text-xl italic font-bold my-3 tracking-wide text-white">"A BLACK HOLE HAS NO HAIR"</p>
              <span className="text-[11px] font-mono text-amber-300 block">- John Archibald Wheeler</span>
              <p className="text-[10px] text-amber-200/60 mt-2 italic font-sans">Mempopulerkan istilah 'Lubang Hitam' pasca keruntuhan relativis bintang 1967.</p>
            </div>
            <div className="absolute top-2 left-2 text-[10px] font-mono text-yellow-400 bg-black/70 px-1.5 py-0.5 rounded border border-yellow-500/30">
              SEJARAH: JOHN WHEELER COINAGE
            </div>
          </div>
        );

      default:
        // Elegant celestial loader
        return (
          <div className="relative w-full h-56 flex items-center justify-center bg-black/80 rounded-xl">
            <div className="w-12 h-12 rounded-full border-4 border-cyan-500 border-t-transparent animate-spin" />
            <span className="text-xs font-mono text-cyan-400 absolute bottom-4 animate-pulse">Memuat Visualisasi Kosmis...</span>
          </div>
        );
    }
  };

  return (
    <div id="cosmic-visualizer" className="w-[100%] flex flex-col gap-2">
      {renderSimulation()}
      {imageCaption && (
        <div className="text-[11px] md:text-sm font-sans text-slate-350 opacity-90 text-center leading-relaxed">
          <strong>Keterangan Visual:</strong> {imageCaption}
        </div>
      )}
    </div>
  );
}
