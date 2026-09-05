import React from 'react';
import { motion } from 'motion/react';

export interface KissStamp {
  id: string;
  x: number; // percentage or px
  y: number;
  rotation: number;
  scale: number;
  color: string;
  shadeName: string;
  createdAt: number;
}

export const LIPSTICK_SHADES = [
  {
    id: 'ruby',
    name: 'Ruby Romance',
    hex: '#e11d48',
    gradient: 'from-rose-500 to-rose-700',
    shadow: 'rgba(225, 29, 72, 0.45)',
  },
  {
    id: 'rose',
    name: 'Rose Petal',
    hex: '#fb7185',
    gradient: 'from-pink-400 to-rose-500',
    shadow: 'rgba(251, 113, 133, 0.45)',
  },
  {
    id: 'crimson',
    name: 'Deep Berry',
    hex: '#9f1239',
    gradient: 'from-rose-700 to-pink-900',
    shadow: 'rgba(159, 18, 57, 0.45)',
  },
  {
    id: 'coral',
    name: 'Peach Coral',
    hex: '#f43f5e',
    gradient: 'from-rose-400 to-orange-400',
    shadow: 'rgba(244, 63, 94, 0.45)',
  },
  {
    id: 'shimmer',
    name: 'Pink Blossom',
    hex: '#ec4899',
    gradient: 'from-pink-500 to-fuchsia-600',
    shadow: 'rgba(236, 72, 153, 0.45)',
  },
];

interface LipstickKissMarkProps {
  stamp: KissStamp;
  isNew?: boolean;
}

export const LipstickKissMark: React.FC<LipstickKissMarkProps> = ({
  stamp,
  isNew = false,
}) => {
  return (
    <motion.div
      initial={
        isNew
          ? { scale: 0.15, rotate: stamp.rotation - 15, opacity: 0 }
          : { scale: stamp.scale, rotate: stamp.rotation, opacity: 0.95 }
      }
      animate={{
        scale: stamp.scale,
        rotate: stamp.rotation,
        opacity: [0, 1, 0.92],
      }}
      transition={{
        type: 'spring',
        stiffness: 380,
        damping: 18,
      }}
      style={{
        left: `${stamp.x}px`,
        top: `${stamp.y}px`,
        transform: 'translate(-50%, -50%)',
      }}
      className="absolute pointer-events-none select-none z-20 group"
    >
      {/* Realistic Lipstick Kiss Mark SVG */}
      <svg
        width="68"
        height="48"
        viewBox="0 0 100 70"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="filter drop-shadow-[0_2px_6px_rgba(225,29,72,0.35)]"
      >
        <defs>
          <radialGradient
            id={`kiss-grad-${stamp.id}`}
            cx="50%"
            cy="50%"
            r="50%"
            fx="45%"
            fy="45%"
          >
            <stop offset="0%" stopColor={stamp.color} stopOpacity="0.98" />
            <stop offset="70%" stopColor={stamp.color} stopOpacity="0.88" />
            <stop offset="100%" stopColor={stamp.color} stopOpacity="0.75" />
          </radialGradient>

          <filter id={`kiss-blur-${stamp.id}`} x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="0.4" />
          </filter>
        </defs>

        {/* --- UPPER LIP --- */}
        {/* Left lobe */}
        <path
          d="M 12 30 C 18 20, 32 14, 46 22 C 48 23.5, 49 24.5, 50 25 C 51 24.5, 52 23.5, 54 22 C 68 14, 82 20, 88 30 C 80 32, 70 31, 58 29 C 53 28, 50 30, 47 28 C 35 31, 22 32, 12 30 Z"
          fill={`url(#kiss-grad-${stamp.id})`}
          filter={`url(#kiss-blur-${stamp.id})`}
        />

        {/* Upper lip texture ridges */}
        <path
          d="M 28 22 C 29 26, 30 29, 31 31 M 38 19 C 39 24, 40 27, 41 29 M 62 19 C 61 24, 60 27, 59 29 M 72 22 C 71 26, 70 29, 69 31"
          stroke="rgba(255, 255, 255, 0.42)"
          strokeWidth="1.2"
          strokeLinecap="round"
        />

        {/* Cupid's bow highlight */}
        <path
          d="M 46 23 C 48 24.5, 50 25, 52 24.5 C 54 23.5, 55 23, 56 22.5"
          stroke="rgba(255, 255, 255, 0.55)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* --- LOWER LIP --- */}
        <path
          d="M 16 35 C 24 33, 38 31, 50 32 C 62 31, 76 33, 84 35 C 80 48, 68 58, 50 59 C 32 58, 20 48, 16 35 Z"
          fill={`url(#kiss-grad-${stamp.id})`}
          filter={`url(#kiss-blur-${stamp.id})`}
        />

        {/* Plump center crease */}
        <path
          d="M 49.5 35 C 49.5 42, 50 49, 50.5 56"
          stroke="rgba(0, 0, 0, 0.18)"
          strokeWidth="1.2"
          strokeLinecap="round"
        />

        {/* Lower lip texture grooves */}
        <path
          d="M 32 37 C 33 44, 36 50, 39 54 M 42 36 C 43 43, 44 49, 45 54 M 58 36 C 57 43, 56 49, 55 54 M 68 37 C 67 44, 64 50, 61 54"
          stroke="rgba(255, 255, 255, 0.36)"
          strokeWidth="1.1"
          strokeLinecap="round"
        />

        {/* Plump gloss shine on lower lip center */}
        <ellipse
          cx="43"
          cy="44"
          rx="5"
          ry="2.2"
          fill="rgba(255, 255, 255, 0.45)"
          transform="rotate(-8 43 44)"
        />
        <ellipse
          cx="57"
          cy="44"
          rx="4.5"
          ry="2"
          fill="rgba(255, 255, 255, 0.4)"
          transform="rotate(8 57 44)"
        />

        {/* Subtle lipstick edge speckles */}
        <circle cx="14" cy="32" r="1" fill={stamp.color} opacity="0.6" />
        <circle cx="86" cy="32" r="1" fill={stamp.color} opacity="0.6" />
        <circle cx="50" cy="58" r="0.9" fill={stamp.color} opacity="0.7" />
      </svg>

      {/* New stamp impact burst effect */}
      {isNew && (
        <>
          {/* Expanding impact ripple */}
          <motion.div
            initial={{ scale: 0.4, opacity: 0.8 }}
            animate={{ scale: 2.2, opacity: 0 }}
            transition={{ duration: 0.65, ease: 'easeOut' }}
            style={{ borderColor: stamp.color }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full border border-dashed pointer-events-none"
          />

          {/* Floating 'Mwah! 💋' pop text */}
          <motion.div
            initial={{ y: 0, opacity: 1, scale: 0.8 }}
            animate={{ y: -38, opacity: 0, scale: 1.15 }}
            transition={{ duration: 0.85, ease: 'easeOut' }}
            className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-bold text-rose-600 bg-white/95 px-2 py-0.5 rounded-full shadow-xs border border-pink-200 pointer-events-none flex items-center gap-1"
          >
            <span>Mwah!</span>
            <span>💋</span>
          </motion.div>

          {/* Sparkle micro-particles */}
          {[0, 60, 120, 180, 240, 300].map((angle, i) => {
            const rad = (angle * Math.PI) / 180;
            const dist = 32 + (i % 2) * 12;
            const targetX = Math.cos(rad) * dist;
            const targetY = Math.sin(rad) * dist;

            return (
              <motion.div
                key={i}
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{
                  x: targetX,
                  y: targetY,
                  opacity: 0,
                  scale: 0.3,
                }}
                transition={{ duration: 0.65, ease: 'easeOut' }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] pointer-events-none"
              >
                {i % 2 === 0 ? '✨' : '💖'}
              </motion.div>
            );
          })}
        </>
      )}
    </motion.div>
  );
};
