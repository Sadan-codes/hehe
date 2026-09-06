import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LoveReason } from '../types';
import { sound } from '../utils/audio';
import { Sparkles, Heart, Shuffle, BookmarkCheck, Trash2, Palette } from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  LipstickKissMark,
  KissStamp,
  LIPSTICK_SHADES,
} from './LipstickKissMark';

interface ReasonsJarProps {
  reasons: LoveReason[];
  partnerName: string;
  onAddReason?: (reason: LoveReason) => void;
}

export const ReasonsJar: React.FC<ReasonsJarProps> = ({
  reasons,
  partnerName,
}) => {
  const [currentReason, setCurrentReason] = useState<LoveReason | null>(reasons[0] || null);
  const [isJarShaking, setIsJarShaking] = useState(false);
  const [discoveredIds, setDiscoveredIds] = useState<Set<string>>(new Set([reasons[0]?.id || '1']));

  // Digital Lipstick Kiss Stamper State
  const [kisses, setKisses] = useState<KissStamp[]>([]);
  const [activeShade, setActiveShade] = useState(LIPSTICK_SHADES[0]);
  const [isKissStamperActive, setIsKissStamperActive] = useState(true);
  const [newestKissId, setNewestKissId] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const jarRef = useRef<HTMLDivElement | null>(null);

  const drawNextReason = () => {
    sound.playChime('sparkle');
    setIsJarShaking(true);

    setTimeout(() => {
      setIsJarShaking(false);
      // Pick a random reason that is different if possible
      const available = reasons.filter((r) => r.id !== currentReason?.id);
      const next = available.length > 0
        ? available[Math.floor(Math.random() * available.length)]
        : reasons[0];

      setCurrentReason(next);
      setDiscoveredIds((prev) => new Set([...prev, next.id]));

      confetti({
        particleCount: 20,
        spread: 50,
        origin: { y: 0.7 },
        colors: ['#f43f5e', '#ec4899', '#fb7185', '#fbcfe8'],
      });
    }, 400);
  };

  // Add digital kiss stamp at exact coordinates
  const addKissStamp = (clientX: number, clientY: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    sound.playKiss();

    const id = `kiss-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const newKiss: KissStamp = {
      id,
      x,
      y,
      rotation: (Math.random() - 0.5) * 36, // natural random tilt between -18° and +18°
      scale: 0.92 + Math.random() * 0.22,
      color: activeShade.hex,
      shadeName: activeShade.name,
      createdAt: Date.now(),
    };

    setNewestKissId(id);
    setKisses((prev) => [...prev.slice(-35), newKiss]);
  };

  // Handle clicking anywhere in the container to stamp a kiss
  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isKissStamperActive) return;
    const target = e.target as HTMLElement;
    // Don't stamp if clicking a button, link, or input
    if (target.closest('button, a, input, select, textarea, [role="button"]')) {
      return;
    }
    addKissStamp(e.clientX, e.clientY);
  };

  // Quick Action: Stamp a kiss directly on the Glass Jar
  const handleKissTheJar = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!jarRef.current || !containerRef.current) return;
    const jarRect = jarRef.current.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();

    // Center of jar with slight organic variation
    const x = jarRect.left + jarRect.width / 2 - containerRect.left + (Math.random() - 0.5) * 35;
    const y = jarRect.top + jarRect.height * 0.55 - containerRect.top + (Math.random() - 0.5) * 45;

    sound.playKiss();

    confetti({
      particleCount: 6,
      spread: 35,
      origin: {
        x: (jarRect.left + jarRect.width / 2) / window.innerWidth,
        y: (jarRect.top + jarRect.height * 0.55) / window.innerHeight,
      },
      colors: [activeShade.hex, '#f43f5e', '#ec4899', '#fbcfe8'],
    });

    const id = `kiss-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const newKiss: KissStamp = {
      id,
      x,
      y,
      rotation: (Math.random() - 0.5) * 28,
      scale: 1.05 + Math.random() * 0.15,
      color: activeShade.hex,
      shadeName: activeShade.name,
      createdAt: Date.now(),
    };

    setNewestKissId(id);
    setKisses((prev) => [...prev.slice(-35), newKiss]);
  };

  // Clear all kiss stamps
  const handleClearKisses = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playChime('pop');
    setKisses([]);
  };

  return (
    <section
      id="reasons-jar-section"
      ref={containerRef}
      onClick={handleContainerClick}
      className={`relative select-none ${
        isKissStamperActive ? 'cursor-crosshair' : ''
      }`}
    >
      {/* Digital Lipstick Kiss Stamps Layer */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-20">
        {kisses.map((kiss) => (
          <LipstickKissMark
            key={kiss.id}
            stamp={kiss}
            isNew={kiss.id === newestKissId}
          />
        ))}
      </div>

      {/* Header & Kiss Stamper Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-semibold mb-2 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Little Moments of Joy</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-rose-950 tracking-tight">
            Reasons Why I Love You
          </h2>
          <p className="text-sm text-rose-700/80 mt-1 max-w-md">
            Tap the glass jar to draw a folded star, or stamp digital lipstick kisses anywhere on the screen!
          </p>
        </div>

        {/* Kiss Stamper Interactive Control Bar */}
        <div className="flex flex-wrap items-center gap-2 p-2 rounded-2xl bg-white/90 backdrop-blur-md border border-pink-200/80 shadow-xs">
          {/* Kiss Stamper Toggle */}
          <button
            onClick={() => {
              sound.playChime('pop');
              setIsKissStamperActive((prev) => !prev);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 touch-manipulation active:scale-95 ${
              isKissStamperActive
                ? 'bg-rose-500 text-white shadow-2xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
            title={
              isKissStamperActive
                ? 'Kiss Stamper is active! Tap anywhere to stamp'
                : 'Turn on Kiss Stamper'
            }
          >
            <span className="text-sm">💋</span>
            <span className="hidden xs:inline">
              {isKissStamperActive ? 'Kiss Stamper On' : 'Stamper Off'}
            </span>
          </button>

          {/* Lipstick Shade Swatches */}
          {isKissStamperActive && (
            <div className="flex items-center gap-1 px-1.5 py-1 rounded-xl bg-pink-50/80 border border-pink-100">
              <span className="text-[10px] font-bold text-rose-400 hidden md:inline px-1">
                Shade:
              </span>
              {LIPSTICK_SHADES.map((shade) => (
                <button
                  key={shade.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    sound.playChime('pop');
                    setActiveShade(shade);
                  }}
                  style={{ backgroundColor: shade.hex }}
                  className={`w-5 h-5 rounded-full transition-transform cursor-pointer touch-manipulation ${
                    activeShade.id === shade.id
                      ? 'scale-125 ring-2 ring-white ring-offset-1 ring-offset-rose-400 shadow-xs'
                      : 'opacity-70 hover:opacity-100 hover:scale-110'
                  }`}
                  title={`${shade.name} Lipstick`}
                  aria-label={`Select ${shade.name} lipstick`}
                />
              ))}
            </div>
          )}

          {/* Kiss Counter & Clear Button */}
          {kisses.length > 0 && (
            <div className="flex items-center gap-1 pl-1">
              <span className="text-xs font-semibold text-rose-800 px-2 py-1 rounded-xl bg-rose-50 border border-rose-200">
                💋 {kisses.length}
              </span>
              <button
                onClick={handleClearKisses}
                className="p-1.5 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                title="Wipe kisses off screen"
                aria-label="Clear all kiss marks"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Click-to-stamp subtle banner hint */}
      {isKissStamperActive && (
        <div className="mb-3 px-3 py-1 rounded-full bg-pink-100/70 text-rose-800 text-xs font-medium inline-flex items-center gap-1.5 border border-pink-200/60 shadow-2xs">
          <span className="animate-pulse">💋</span>
          <span>
            Click or tap anywhere on the slide to leave a{' '}
            <strong className="text-rose-600 font-semibold">
              {activeShade.name}
            </strong>{' '}
            lipstick kiss mark!
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left: The Interactive Glass Jar Visual */}
        <div
          ref={jarRef}
          className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-pink-50/60 to-rose-50/60 rounded-3xl border border-pink-100 shadow-[0_8px_30px_rgba(255,182,193,0.2)] relative"
        >
          <motion.div
            animate={
              isJarShaking
                ? { rotate: [-4, 4, -4, 4, 0], scale: [1, 1.04, 0.98, 1] }
                : { y: [0, -4, 0] }
            }
            transition={
              isJarShaking
                ? { duration: 0.4 }
                : { duration: 4, repeat: Infinity, ease: 'easeInOut' }
            }
            onClick={drawNextReason}
            className="cursor-pointer relative group"
            title="Click to shake and draw a reason!"
          >
            {/* Glass Jar Graphic Styled with SVG and Tailwind */}
            <div className="relative w-48 h-64 sm:w-52 sm:h-72 flex flex-col items-center">
              {/* Cork Stopper */}
              <div className="w-20 h-5 bg-[#D7A97A] rounded-t-md border border-[#B3875B] shadow-inner" />
              {/* Jar Neck */}
              <div className="w-28 h-4 bg-white/60 border-x-2 border-t border-pink-200/90 rounded-xs backdrop-blur-xs flex items-center justify-center">
                {/* Tied Pink Ribbon */}
                <div className="w-full h-2 bg-rose-400/80 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-rose-500 rounded-full shadow-xs" />
                </div>
              </div>

              {/* Jar Body */}
              <div className="w-full flex-1 bg-gradient-to-b from-white/70 via-pink-50/50 to-white/80 rounded-b-[40px] rounded-t-[10px] border-2 border-pink-200/90 backdrop-blur-md shadow-[inset_0_0_25px_rgba(255,182,193,0.35)] p-4 relative overflow-hidden flex flex-wrap gap-2 items-center justify-center content-center">
                {/* Shiny Glass Reflection */}
                <div className="absolute top-2 left-3 w-3 h-44 bg-gradient-to-b from-white/90 to-transparent rounded-full transform -rotate-6 opacity-60 pointer-events-none" />
                <div className="absolute top-3 left-8 w-1.5 h-28 bg-gradient-to-b from-white/70 to-transparent rounded-full transform -rotate-6 opacity-40 pointer-events-none" />

                {/* Floating Origami Paper Stars inside the jar */}
                {reasons.slice(0, 16).map((r, i) => (
                  <motion.span
                    key={r.id}
                    animate={{
                      y: [0, (i % 3) * -3, 0],
                      rotate: [0, (i % 2 === 0 ? 10 : -10), 0],
                    }}
                    transition={{
                      duration: 3 + (i % 3),
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="text-lg filter drop-shadow-xs select-none"
                  >
                    {r.emoji}
                  </motion.span>
                ))}

                {/* Jar Center Label */}
                <div className="absolute bottom-6 px-4 py-1.5 bg-white/95 rounded-xl border border-pink-200 shadow-sm text-center">
                  <span className="text-[10px] font-bold text-rose-400 uppercase tracking-widest block">
                    Love Jar
                  </span>
                  <span className="text-xs font-semibold text-rose-800">
                    {reasons.length} Sweet Reasons
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons Below Jar */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <button
              id="draw-reason-btn"
              onClick={drawNextReason}
              disabled={isJarShaking}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-rose-500 hover:bg-rose-600 active:scale-95 text-white font-medium text-xs sm:text-sm shadow-md hover:shadow-lg transition-all cursor-pointer touch-manipulation"
            >
              <Shuffle className={`w-4 h-4 ${isJarShaking ? 'animate-spin' : ''}`} />
              <span>Draw Another Star</span>
            </button>

            {/* Direct 'Kiss the Jar' button */}
            <button
              id="kiss-jar-action-btn"
              onClick={handleKissTheJar}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-rose-100 hover:bg-rose-200 active:bg-rose-300 active:scale-95 text-rose-800 font-medium text-xs sm:text-sm border border-rose-300 transition-all cursor-pointer touch-manipulation shadow-2xs"
              title="Stamp a lipstick kiss directly on the glass jar!"
            >
              <span>💋</span>
              <span>Kiss Jar</span>
            </button>
          </div>
        </div>

        {/* Right: The Drawn Unfolded Reason Card */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {currentReason && (
              <motion.div
                key={currentReason.id}
                initial={{ opacity: 0, scale: 0.92, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: -15 }}
                transition={{ duration: 0.3 }}
                className="bg-white/95 rounded-3xl p-6 sm:p-8 border border-pink-200/80 shadow-[0_10px_35px_rgba(255,182,193,0.25)] relative overflow-hidden"
              >
                {/* Top Corner Badge */}
                <div className="flex items-center justify-between gap-3 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl filter drop-shadow-sm">
                      {currentReason.emoji}
                    </span>
                    <div>
                      <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider block">
                        Reason to love you
                      </span>
                      <span className="text-xs text-rose-700/70">
                        For {partnerName}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 border border-pink-100 text-pink-700 text-xs font-medium">
                    <BookmarkCheck className="w-3.5 h-3.5 text-rose-500" />
                    <span>
                      {discoveredIds.size} of {reasons.length} explored
                    </span>
                  </div>
                </div>

                {/* Main reason text quote */}
                <blockquote
                  className="text-xl sm:text-2xl md:text-3xl font-medium text-rose-950 leading-relaxed tracking-tight font-handwriting py-2"
                  style={{ fontFamily: "'Caveat', cursive, sans-serif" }}
                >
                  "{currentReason.text}"
                </blockquote>

                {/* Card footer */}
                <div className="mt-8 pt-4 border-t border-pink-100 flex flex-wrap items-center justify-between gap-3 text-xs text-rose-600">
                  <span className="flex items-center gap-1 font-medium">
                    <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                    Every single day, even more.
                  </span>

                  <button
                    onClick={() => {
                      sound.playChime('sparkle');
                      confetti({ particleCount: 20, spread: 60 });
                    }}
                    className="inline-flex items-center gap-1 text-rose-500 hover:text-rose-700 transition-colors font-medium cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Send a heart for this</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
