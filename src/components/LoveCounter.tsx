import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Heart, Sparkles, Calendar, Clock, Edit3, Flame } from 'lucide-react';
import { sound } from '../utils/audio';

interface LoveCounterProps {
  anniversaryDate: string;
  partnerName: string;
  yourName: string;
}

export const LoveCounter: React.FC<LoveCounterProps> = ({
  anniversaryDate,
  partnerName,
  yourName,
}) => {
  const [timeElapsed, setTimeElapsed] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalSeconds: 0,
  });

  useEffect(() => {
    const calculateTime = () => {
      const start = new Date(anniversaryDate).getTime();
      const now = Date.now();
      const diff = Math.max(0, now - start);

      const totalSeconds = Math.floor(diff / 1000);
      const days = Math.floor(totalSeconds / (3600 * 24));
      const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      setTimeElapsed({ days, hours, minutes, seconds, totalSeconds });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [anniversaryDate]);

  return (
    <div
      id="love-counter-widget"
      className="relative rounded-3xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400 p-6 sm:p-8 text-white shadow-[0_12px_40px_rgba(244,63,94,0.3)] overflow-hidden"
    >
      {/* Background Floating Hearts Silhouette */}
      <div className="absolute -right-6 -bottom-6 opacity-15 pointer-events-none">
        <Heart className="w-56 h-56 fill-white" />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold mb-3">
            <Flame className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
            <span>Our Love Journey</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
            {partnerName} & {yourName}
          </h3>
          <p className="text-xs sm:text-sm text-pink-100 mt-1 max-w-sm">
            Counting every single second since we met on 1 January 2025.
          </p>

          <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-pink-200 bg-white/10 px-3 py-1 rounded-full border border-white/15">
            <Calendar className="w-3.5 h-3.5 text-pink-200" />
            <span>Meeting Date: 1 January 2025</span>
          </div>
        </div>

        {/* Live Counters */}
        <div className="grid grid-cols-4 gap-2.5 sm:gap-4 text-center">
          <div className="bg-white/15 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/20 min-w-[65px] sm:min-w-[85px]">
            <span className="text-2xl sm:text-4xl font-extrabold tracking-tight block font-mono">
              {timeElapsed.days}
            </span>
            <span className="text-[10px] sm:text-xs font-medium uppercase tracking-wider text-pink-100">
              Days
            </span>
          </div>

          <div className="bg-white/15 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/20 min-w-[65px] sm:min-w-[85px]">
            <span className="text-2xl sm:text-4xl font-extrabold tracking-tight block font-mono">
              {String(timeElapsed.hours).padStart(2, '0')}
            </span>
            <span className="text-[10px] sm:text-xs font-medium uppercase tracking-wider text-pink-100">
              Hours
            </span>
          </div>

          <div className="bg-white/15 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/20 min-w-[65px] sm:min-w-[85px]">
            <span className="text-2xl sm:text-4xl font-extrabold tracking-tight block font-mono">
              {String(timeElapsed.minutes).padStart(2, '0')}
            </span>
            <span className="text-[10px] sm:text-xs font-medium uppercase tracking-wider text-pink-100">
              Mins
            </span>
          </div>

          <div className="bg-white/15 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/20 min-w-[65px] sm:min-w-[85px]">
            <span className="text-2xl sm:text-4xl font-extrabold tracking-tight block font-mono">
              {String(timeElapsed.seconds).padStart(2, '0')}
            </span>
            <span className="text-[10px] sm:text-xs font-medium uppercase tracking-wider text-pink-100">
              Secs
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
