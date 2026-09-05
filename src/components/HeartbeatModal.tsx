import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { sound } from '../utils/audio';
import { Heart, Activity, X, Sparkles, Flame } from 'lucide-react';

interface HeartbeatModalProps {
  isOpen: boolean;
  onClose: () => void;
  partnerName: string;
}

export const HeartbeatModal: React.FC<HeartbeatModalProps> = ({
  isOpen,
  onClose,
  partnerName,
}) => {
  const [isPressing, setIsPressing] = useState(false);
  const [bpm, setBpm] = useState(74);
  const [holdSeconds, setHoldSeconds] = useState(0);
  const heartbeatIntervalRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Sound and BPM acceleration loop
  useEffect(() => {
    if (isPressing) {
      sound.playHeartbeat();
      if ('vibrate' in navigator) {
        try {
          navigator.vibrate([40, 100, 40]);
        } catch {}
      }

      // Dynamic interval based on current BPM: (60 / bpm) * 1000
      const currentInterval = Math.round((60 / bpm) * 1000);

      heartbeatIntervalRef.current = window.setTimeout(() => {
        setHoldSeconds((s) => s + 0.5);
        setBpm((prev) => Math.min(124, prev + 2));
      }, currentInterval);
    } else {
      if (heartbeatIntervalRef.current) {
        clearTimeout(heartbeatIntervalRef.current);
      }
      // Slowly return to resting
      if (bpm > 74) {
        const resetTimer = setTimeout(() => {
          setBpm((prev) => Math.max(74, prev - 4));
        }, 300);
        return () => clearTimeout(resetTimer);
      }
    }

    return () => {
      if (heartbeatIntervalRef.current) clearTimeout(heartbeatIntervalRef.current);
    };
  }, [isPressing, bpm]);

  // Animated ECG monitor line on canvas
  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let step = 0;
    const width = (canvas.width = canvas.parentElement?.clientWidth || 360);
    const height = (canvas.height = 70);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Grid lines
      ctx.strokeStyle = 'rgba(244, 114, 182, 0.15)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 15) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // ECG wave
      ctx.beginPath();
      ctx.strokeStyle = isPressing ? '#f43f5e' : '#fda4af';
      ctx.lineWidth = isPressing ? 2.5 : 1.5;
      ctx.shadowColor = '#f43f5e';
      ctx.shadowBlur = isPressing ? 10 : 3;

      for (let x = 0; x < width; x++) {
        const cycle = ((x + step) % 180) / 180;
        let y = height / 2;

        if (cycle > 0.35 && cycle < 0.38) {
          y -= 8; // P wave
        } else if (cycle >= 0.45 && cycle < 0.48) {
          y += 6; // Q drop
        } else if (cycle >= 0.48 && cycle < 0.52) {
          y -= 28; // R peak
        } else if (cycle >= 0.52 && cycle < 0.55) {
          y += 10; // S dip
        } else if (cycle >= 0.62 && cycle < 0.7) {
          y -= 12; // T wave
        }

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      step += isPressing ? (bpm / 60) * 3 : 2;
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [isOpen, isPressing, bpm]);

  if (!isOpen) return null;

  const getStatusMessage = () => {
    if (!isPressing && bpm <= 74) return `Resting calmly... touch my heart to wake it up.`;
    if (bpm < 85) return `You placed your hand on my chest...`;
    if (bpm < 100) return `It's picking up speed... you're so close.`;
    if (bpm < 115) return `Racing fast! My heart beats only for you, ${partnerName}.`;
    return `Maximum love: 120+ BPM! You literally make my heart skip a beat! ❤️`;
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-pink-200 shadow-2xl text-center overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-pink-100 text-rose-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Title */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-semibold mb-2">
            <Activity className="w-3.5 h-3.5" />
            <span>Interactive Heartbeat Sync</span>
          </div>
          <h3 className="font-serif font-bold text-2xl text-rose-950">
            Feel How My Heart Beats For You
          </h3>
          <p className="text-xs text-rose-800/75 mt-1 max-w-xs mx-auto">
            Press and hold down on the glowing heart to feel and hear my real-time heartbeat.
          </p>

          {/* ECG Monitor Canvas */}
          <div className="my-5 rounded-2xl bg-rose-50/70 border border-pink-200 p-2 overflow-hidden shadow-inner">
            <canvas ref={canvasRef} className="w-full block" />
            <div className="flex items-center justify-between px-3 pt-1 text-[11px] font-mono text-rose-700 font-bold">
              <span>RATE: {bpm} BPM</span>
              <span className="flex items-center gap-1">
                <Flame className="w-3 h-3 text-rose-500" />
                {isPressing ? 'CONNECTED' : 'STANDBY'}
              </span>
            </div>
          </div>

          {/* Touch Sensor Heart */}
          <div className="flex flex-col items-center justify-center my-6">
            <div className="relative">
              {/* Vascular pulse waves when pressing */}
              {isPressing && (
                <>
                  <motion.div
                    animate={{ scale: [1, 2.2], opacity: [0.7, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 60 / bpm,
                      ease: 'easeOut',
                    }}
                    className="absolute -inset-4 rounded-full bg-rose-400/40 pointer-events-none"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.7], opacity: [0.6, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 60 / bpm,
                      delay: 0.15,
                      ease: 'easeOut',
                    }}
                    className="absolute -inset-2 rounded-full bg-pink-500/30 pointer-events-none"
                  />
                </>
              )}

              {/* Interactive Pulsing Heart Button */}
              <motion.button
                onMouseDown={() => setIsPressing(true)}
                onMouseUp={() => setIsPressing(false)}
                onMouseLeave={() => setIsPressing(false)}
                onTouchStart={() => setIsPressing(true)}
                onTouchEnd={() => setIsPressing(false)}
                animate={{
                  scale: isPressing ? [1, 1.12, 1] : 1,
                }}
                transition={{
                  repeat: isPressing ? Infinity : 0,
                  duration: 60 / bpm,
                }}
                className={`w-28 h-28 rounded-full flex items-center justify-center cursor-pointer transition-all shadow-xl select-none focus:outline-hidden ${
                  isPressing
                    ? 'bg-gradient-to-br from-rose-500 to-pink-600 shadow-rose-300 ring-4 ring-rose-300'
                    : 'bg-gradient-to-br from-rose-400 to-pink-500 shadow-pink-200 hover:scale-105'
                }`}
              >
                <Heart
                  className={`w-14 h-14 text-white fill-white transition-transform ${
                    isPressing ? 'scale-110 drop-shadow-md' : ''
                  }`}
                />
              </motion.button>
            </div>

            <span className="mt-4 text-xs font-semibold text-rose-900 tracking-wide uppercase">
              {isPressing ? 'HOLDING... FEEL THE THUMP' : 'PRESS & HOLD FINGER HERE'}
            </span>
          </div>

          {/* Dynamic Whisper Status */}
          <div className="p-3 rounded-2xl bg-pink-50 border border-pink-100 text-xs font-medium text-rose-900 italic font-serif">
            "{getStatusMessage()}"
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
