import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Stars,
  Heart,
  Moon,
  Compass,
  ChevronRight,
  Eye,
} from 'lucide-react';

interface StarSkySlideProps {
  partnerName: string;
  anniversaryDate?: string;
  onNext?: () => void;
}

interface ConstellationStar {
  id: number;
  x: number; // percentage 0 - 100
  y: number; // percentage 0 - 100
  label: string;
  whisper: string;
  size: number;
  isUnlocked?: boolean;
}

const STAR_WHISPERS: Omit<ConstellationStar, 'id'>[] = [
  {
    x: 50,
    y: 28,
    label: 'Polaris of Love',
    whisper: 'You are my true North. No matter where life goes, you guide my heart home.',
    size: 6,
  },
  {
    x: 36,
    y: 42,
    label: 'Star of Laughter',
    whisper: 'Your laughter is the sweetest melody I have ever known.',
    size: 5,
  },
  {
    x: 64,
    y: 42,
    label: 'Star of Peace',
    whisper: 'In your arms is the only place in this chaotic world where my soul feels totally at peace.',
    size: 5,
  },
  {
    x: 30,
    y: 60,
    label: 'Star of First Gaze',
    whisper: 'The moment my eyes found yours on 1 January 2025, every single puzzle piece clicked.',
    size: 4,
  },
  {
    x: 70,
    y: 60,
    label: 'Star of Devotion',
    whisper: 'I choose you today, I will choose you tomorrow, and I will choose you in every lifetime.',
    size: 4,
  },
  {
    x: 50,
    y: 78,
    label: 'Heart Anchor',
    whisper: 'You are not just my love—you are my best friend and my favorite miracle.',
    size: 7,
  },
  {
    x: 20,
    y: 75,
    label: 'Star of Tenderness',
    whisper: 'Your kindness inspires me to be a gentler, better person every single day.',
    size: 4,
  },
  {
    x: 80,
    y: 75,
    label: 'Star of Tomorrow',
    whisper: 'Every tomorrow with you is a gift I will never take for granted.',
    size: 4,
  },
];

export const StarSkySlide: React.FC<StarSkySlideProps> = ({
  partnerName,
  anniversaryDate = '1 January 2025',
  onNext,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [activeWhisper, setActiveWhisper] = useState<{
    label: string;
    text: string;
  } | null>(null);
  const [unlockedCount, setUnlockedCount] = useState<number>(0);
  const [wishesMade, setWishesMade] = useState<number>(0);

  // Canvas star particles background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 450);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    // Background stars
    const numStars = 120;
    const stars = Array.from({ length: numStars }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.5 + 0.5,
      alpha: Math.random(),
      speed: Math.random() * 0.02 + 0.005,
    }));

    // Shooting stars queue
    interface ShootingStar {
      x: number;
      y: number;
      length: number;
      speed: number;
      angle: number;
      opacity: number;
    }
    let shootingStars: ShootingStar[] = [];

    const spawnShootingStar = () => {
      shootingStars.push({
        x: Math.random() * width * 0.8,
        y: Math.random() * height * 0.4,
        length: Math.random() * 80 + 50,
        speed: Math.random() * 6 + 4,
        angle: Math.PI / 4 + (Math.random() - 0.5) * 0.2,
        opacity: 1,
      });
    };

    let lastShootingStarTime = Date.now();

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Deep celestial gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#0f172a');
      bgGrad.addColorStop(0.5, '#1e1b4b');
      bgGrad.addColorStop(1, '#2e1065');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Subtle rose nebula glow in center
      const nebula = ctx.createRadialGradient(
        width * 0.5,
        height * 0.5,
        20,
        width * 0.5,
        height * 0.5,
        width * 0.45
      );
      nebula.addColorStop(0, 'rgba(244, 63, 94, 0.15)');
      nebula.addColorStop(0.5, 'rgba(217, 70, 239, 0.08)');
      nebula.addColorStop(1, 'transparent');
      ctx.fillStyle = nebula;
      ctx.fillRect(0, 0, width, height);

      // Draw and twinkle stars
      stars.forEach((star) => {
        star.alpha += star.speed;
        if (star.alpha > 1 || star.alpha < 0.2) star.speed = -star.speed;

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.abs(star.alpha)})`;
        ctx.fill();
      });

      // Constellation Lines connecting stars in a heart shape
      const coords = STAR_WHISPERS.map((s) => ({
        x: (s.x / 100) * width,
        y: (s.y / 100) * height,
      }));

      // Connections:
      // 0 (top center) -> 1 -> 3 -> 5 (bottom) -> 4 -> 2 -> 0
      const edges = [
        [0, 1],
        [1, 3],
        [3, 6],
        [6, 5],
        [5, 7],
        [7, 4],
        [4, 2],
        [2, 0],
      ];

      ctx.save();
      ctx.strokeStyle = 'rgba(244, 114, 182, 0.35)';
      ctx.lineWidth = 1.2;
      ctx.setLineDash([4, 4]);

      edges.forEach(([fromIdx, toIdx]) => {
        if (coords[fromIdx] && coords[toIdx]) {
          ctx.beginPath();
          ctx.moveTo(coords[fromIdx].x, coords[fromIdx].y);
          ctx.lineTo(coords[toIdx].x, coords[toIdx].y);
          ctx.stroke();
        }
      });
      ctx.restore();

      // Random shooting stars
      if (Date.now() - lastShootingStarTime > 3500) {
        spawnShootingStar();
        lastShootingStarTime = Date.now();
      }

      // Render shooting stars
      shootingStars = shootingStars.filter((ss) => ss.opacity > 0.05);
      shootingStars.forEach((ss) => {
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = `rgba(255, 255, 255, ${ss.opacity})`;
        ctx.lineWidth = 2;
        const tailX = ss.x - Math.cos(ss.angle) * ss.length;
        const tailY = ss.y - Math.sin(ss.angle) * ss.length;

        const grad = ctx.createLinearGradient(tailX, tailY, ss.x, ss.y);
        grad.addColorStop(0, 'transparent');
        grad.addColorStop(1, `rgba(253, 164, 175, ${ss.opacity})`);
        ctx.strokeStyle = grad;

        ctx.moveTo(tailX, tailY);
        ctx.lineTo(ss.x, ss.y);
        ctx.stroke();
        ctx.restore();

        ss.x += Math.cos(ss.angle) * ss.speed;
        ss.y += Math.sin(ss.angle) * ss.speed;
        ss.opacity -= 0.015;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleStarClick = (star: (typeof STAR_WHISPERS)[0]) => {
    sound.playChime('sparkle');
    setActiveWhisper({
      label: star.label,
      text: star.whisper,
    });
    setUnlockedCount((prev) => prev + 1);
  };

  const handleMakeWish = () => {
    sound.playChime('sparkle');
    setWishesMade((prev) => prev + 1);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.5 },
      colors: ['#f43f5e', '#a855f7', '#fbbf24', '#ffffff'],
    });
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Header */}
      <div className="text-center max-w-xl mb-4">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-semibold mb-2">
          <Moon className="w-3.5 h-3.5" />
          <span>Our Alignment Since {anniversaryDate}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-rose-950">
          The Sky on the Night We Met
        </h2>
        <p className="text-xs sm:text-sm text-rose-800/75 mt-1">
          Every star holds an unspoken confession. Tap any glowing star on our heart constellation to reveal its secret whisper.
        </p>
      </div>

      {/* Celestial Sky Canvas Card */}
      <div className="relative w-full max-w-4xl aspect-[16/9] min-h-[380px] rounded-3xl overflow-hidden shadow-2xl border border-purple-300/40 select-none">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

        {/* Constellation Overlay Interactive Stars */}
        {STAR_WHISPERS.map((star, i) => (
          <motion.button
            key={i}
            onClick={() => handleStarClick(star)}
            whileHover={{ scale: 1.4 }}
            whileTap={{ scale: 0.9 }}
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group cursor-pointer focus:outline-hidden"
          >
            {/* Glowing Halo */}
            <div
              className="absolute -inset-2 rounded-full bg-rose-400/40 blur-xs animate-ping"
              style={{ animationDuration: '3s' }}
            />
            {/* Pulsing Core */}
            <div
              className="relative rounded-full bg-white shadow-lg border border-pink-200 flex items-center justify-center transition-transform"
              style={{
                width: `${star.size * 3}px`,
                height: `${star.size * 3}px`,
              }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-rose-400" />
            </div>

            {/* Hover Tooltip */}
            <span className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/90 text-purple-950 shadow-md pointer-events-none">
              {star.label}
            </span>
          </motion.button>
        ))}

        {/* Ambient Info Badge */}
        <div className="absolute top-2.5 sm:top-4 left-2.5 sm:left-4 z-20 flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white text-[10px] sm:text-[11px] max-w-[170px] xs:max-w-none truncate">
          <Compass className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-pink-400 animate-spin shrink-0" style={{ animationDuration: '16s' }} />
          <span className="truncate">Heart Constellation</span>
        </div>

        {/* Wish Button */}
        <div className="absolute top-2.5 sm:top-4 right-2.5 sm:right-4 z-20">
          <button
            onClick={handleMakeWish}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-gradient-to-r from-pink-500/90 to-purple-600/90 hover:from-pink-500 hover:to-purple-600 backdrop-blur-md text-white text-[10px] sm:text-xs font-semibold shadow-md transition-all active:scale-95 cursor-pointer touch-manipulation"
          >
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>Wish ({wishesMade})</span>
          </button>
        </div>

        {/* Bottom Starlight Whisper Card Overlay */}
        <div className="absolute bottom-4 left-4 right-4 z-20">
          <AnimatePresence mode="wait">
            {activeWhisper ? (
              <motion.div
                key={activeWhisper.label}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className="bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-pink-200/90 shadow-xl max-w-xl mx-auto flex items-start justify-between gap-3 text-left"
              >
                <div>
                  <div className="flex items-center gap-2 text-rose-500 text-xs font-bold mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{activeWhisper.label}</span>
                  </div>
                  <p className="text-xs sm:text-sm font-serif italic text-rose-950 leading-relaxed">
                    "{activeWhisper.text}"
                  </p>
                </div>
                <button
                  onClick={() => setActiveWhisper(null)}
                  className="text-xs text-rose-400 hover:text-rose-700 px-2 py-1 rounded-lg hover:bg-pink-100 cursor-pointer shrink-0"
                >
                  Close
                </button>
              </motion.div>
            ) : (
              <div className="text-center">
                <span className="inline-block px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white/90 text-xs font-medium">
                  Tap any star to whisper a secret • {unlockedCount} whispers revealed
                </span>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Next slide button */}
      {onNext && (
        <button
          onClick={onNext}
          className="mt-8 inline-flex items-center justify-center gap-2 min-h-[48px] min-w-[140px] px-8 sm:px-10 py-3 rounded-full bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white font-semibold text-sm shadow-md transition-all active:scale-95 cursor-pointer select-none touch-manipulation"
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
