import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Heart,
  Sparkles,
  Infinity as InfinityIcon,
  RotateCcw,
  Sun,
  Coffee,
  Compass,
  Flame,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/audio';

interface EndingSlideProps {
  partnerName: string;
  yourName: string;
  onRestart: () => void;
  onOpenHeartbeat: () => void;
}

export const EndingSlide: React.FC<EndingSlideProps> = ({
  partnerName,
  yourName,
  onRestart,
  onOpenHeartbeat,
}) => {
  const [promiseSealed, setPromiseSealed] = useState<boolean>(false);
  const [sealCount, setSealCount] = useState<number>(0);

  const triggerGrandFinale = () => {
    sound.playChime('sparkle');
    setSealCount((prev) => prev + 1);
    setPromiseSealed(true);

    try {
      // Magnificent multi-stage fireworks confetti
      const end = Date.now() + 1800;
      const colors = ['#f43f5e', '#ec4899', '#f472b6', '#fbbf24', '#fbcfe8', '#e11d48'];

      (function frame() {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 60,
          origin: { x: 0.1, y: 0.7 },
          colors: colors,
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 60,
          origin: { x: 0.9, y: 0.7 },
          colors: colors,
        });
        confetti({
          particleCount: 6,
          origin: { x: 0.5, y: 0.4 },
          spread: 100,
          colors: ['#fb7185', '#fda4af', '#f59e0b', '#ffffff'],
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();
    } catch {
      // safe fallback
    }
  };

  const promises = [
    {
      icon: Sun,
      title: 'Every Golden Sunset',
      desc: 'To hold your hand at the close of every day and thank the universe for you.',
      tag: 'Cherished',
    },
    {
      icon: Coffee,
      title: 'Every Quiet Morning',
      desc: 'To wake up next to you, share sweet smiles, and build our home with love.',
      tag: 'Tender',
    },
    {
      icon: Compass,
      title: 'Every Uncharted Path',
      desc: 'Through laughter, challenges, and every adventure, standing by you always.',
      tag: 'Unconditional',
    },
    {
      icon: Flame,
      title: 'A Love That Grows',
      desc: 'Loving you deeper with each passing second, more than yesterday, less than tomorrow.',
      tag: 'Endless',
    },
  ];

  return (
    <div className="w-full flex flex-col items-center justify-center py-4 sm:py-8 px-2 sm:px-4">
      {/* Background Decorative Auras */}
      <div className="relative w-full max-w-3xl">
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-80 h-80 bg-gradient-to-br from-pink-300/30 via-rose-300/20 to-amber-200/20 rounded-full blur-3xl pointer-events-none" />

        {/* Main Grand Finale Card */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative bg-gradient-to-b from-white/95 via-pink-50/70 to-rose-50/90 backdrop-blur-xl rounded-3xl p-6 sm:p-10 shadow-2xl border border-rose-200/80 overflow-hidden text-center flex flex-col items-center"
        >
          {/* Subtle Top Rose-Gold Accent Line */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-rose-300 via-pink-500 to-amber-300" />

          {/* Floating Infinity Top Emblem */}
          <motion.div
            animate={{
              scale: [1, 1.08, 1],
              rotate: [0, 2, -2, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-rose-500 via-pink-500 to-rose-400 text-white shadow-xl shadow-rose-500/25 flex items-center justify-center mb-6 relative group"
          >
            <InfinityIcon className="w-9 h-9 sm:w-11 sm:h-11 drop-shadow-md text-amber-100" />
            <motion.div
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -inset-1 rounded-3xl border border-rose-300/60 pointer-events-none"
            />
          </motion.div>

          {/* Partner Monogram Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-100/90 text-rose-800 text-xs font-semibold uppercase tracking-wider mb-4 border border-rose-200 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>To {partnerName} • From {yourName}</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          </div>

          {/* Core Masterpiece Message (Highlighted as requested) */}
          <div className="max-w-2xl mx-auto my-2">
            <h2 className="text-2xl sm:text-4xl md:text-[2.6rem] font-bold text-rose-950 font-serif leading-tight tracking-tight mb-4">
              Our Forever Begins Here
            </h2>

            <div className="relative py-3 px-4 sm:px-6 my-4 rounded-2xl bg-white/70 backdrop-blur-xs border border-rose-200/70 shadow-inner">
              <span className="text-4xl text-rose-300 font-serif absolute -top-3 left-3 select-none">“</span>
              <p className="text-base sm:text-xl md:text-2xl text-rose-900 font-serif italic font-medium leading-relaxed px-3 sm:px-6">
                We may have reached the end of this website, but it’s just the beginning of the life we will live together forever.
              </p>
              <span className="text-4xl text-rose-300 font-serif absolute -bottom-6 right-3 select-none">”</span>
            </div>

            <p className="text-xs sm:text-sm text-rose-800/80 font-sans max-w-xl mx-auto mt-4 leading-relaxed">
              Every slide, every letter, and every counted second was made to remind you how deeply and unconditionally you are adored.
              Tomorrow and every day after, I will choose you all over again.
            </p>
          </div>

          {/* Bento Grid: Our Forever Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full max-w-2xl mt-8 mb-8 text-left">
            {promises.map((p, idx) => {
              const Icon = p.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + idx * 0.08, duration: 0.4 }}
                  className="p-4 rounded-2xl bg-white/80 border border-pink-200/80 shadow-xs hover:shadow-md transition-all group hover:border-rose-300"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-rose-500/80 bg-rose-50 px-2 py-0.5 rounded-full">
                      {p.tag}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-rose-950 mb-1">{p.title}</h4>
                  <p className="text-xs text-rose-800/75 leading-relaxed">{p.desc}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Interactive Infinity Seal Button */}
          <div className="w-full max-w-md flex flex-col items-center gap-3 mb-6">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              onClick={triggerGrandFinale}
              className={`w-full min-h-[48px] py-3.5 px-6 rounded-2xl font-bold text-sm sm:text-base transition-all duration-300 shadow-lg cursor-pointer flex items-center justify-center gap-2.5 select-none touch-manipulation ${
                promiseSealed
                  ? 'bg-gradient-to-r from-rose-500 via-pink-600 to-rose-600 text-white shadow-rose-400/40 ring-4 ring-pink-200'
                  : 'bg-gradient-to-r from-rose-600 via-pink-500 to-rose-500 hover:from-rose-700 hover:to-pink-600 text-white shadow-rose-500/30'
              }`}
            >
              {promiseSealed ? (
                <>
                  <Check className="w-5 h-5 text-amber-200" />
                  <span>Forever Sealed with Love ({sealCount})</span>
                  <Sparkles className="w-4 h-4 text-amber-200" />
                </>
              ) : (
                <>
                  <Heart className="w-5 h-5 fill-white text-white animate-pulse" />
                  <span>Tap to Seal Our Forever Promise</span>
                  <Sparkles className="w-4 h-4 text-amber-200" />
                </>
              )}
            </motion.button>

            <span className="text-[11px] text-rose-400 font-medium">
              Click anytime to shower celebration confetti & fireworks ✨
            </span>
          </div>

          {/* Secondary Footer Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-rose-200/60 w-full max-w-md">
            <button
              onClick={onRestart}
              className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 rounded-full bg-white/90 hover:bg-rose-50 active:bg-rose-100 text-rose-800 border border-rose-200 text-xs sm:text-sm font-semibold shadow-2xs hover:shadow-xs transition-all cursor-pointer select-none touch-manipulation active:scale-95"
            >
              <RotateCcw className="w-4 h-4 text-rose-500" />
              <span>Replay Slideshow</span>
            </button>

            <button
              onClick={onOpenHeartbeat}
              className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 rounded-full bg-rose-100 hover:bg-rose-200/80 active:bg-rose-300 text-rose-800 text-xs sm:text-sm font-semibold shadow-2xs transition-all cursor-pointer select-none touch-manipulation active:scale-95"
            >
              <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
              <span>Listen to My Heartbeat</span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
