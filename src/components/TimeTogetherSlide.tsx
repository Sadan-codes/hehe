import React, { useState, useEffect } from 'react';
import { Heart, Calendar, Clock, Sparkles, ArrowRight, Hourglass, PartyPopper } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/audio';
import { DailyLoveAffirmation } from './DailyLoveAffirmation';

interface TimeTogetherSlideProps {
  partnerName: string;
  yourName: string;
  anniversaryDate?: string;
  onNext: () => void;
}

interface OccasionDef {
  id: 'anniversary' | 'monthly' | 'valentines';
  title: string;
  shortLabel: string;
  targetDate: Date;
  formattedDate: string;
  badge: string;
  note: string;
}

export const TimeTogetherSlide: React.FC<TimeTogetherSlideProps> = ({
  partnerName,
  yourName,
  anniversaryDate = '2025-01-01',
  onNext,
}) => {
  const [selectedOccasionId, setSelectedOccasionId] = useState<'anniversary' | 'monthly' | 'valentines'>('anniversary');
  const [now, setNow] = useState<Date>(new Date());

  const [time, setTime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalSeconds: 0,
  });

  useEffect(() => {
    const meetingDate = new Date(anniversaryDate || '2025-01-01T00:00:00');

    const updateTimer = () => {
      const current = new Date();
      setNow(current);
      const diff = Math.max(0, current.getTime() - meetingDate.getTime());

      const seconds = Math.floor((diff / 1000) % 60);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const totalSeconds = Math.floor(diff / 1000);

      setTime({ days, hours, minutes, seconds, totalSeconds });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [anniversaryDate]);

  // Compute upcoming occasions dynamically relative to the current time
  const occasions: OccasionDef[] = React.useMemo(() => {
    const baseAnniv = new Date(anniversaryDate || '2025-01-01T00:00:00');
    const annivMonth = isNaN(baseAnniv.getMonth()) ? 0 : baseAnniv.getMonth();
    const annivDay = isNaN(baseAnniv.getDate()) ? 1 : baseAnniv.getDate();
    const startYear = isNaN(baseAnniv.getFullYear()) ? 2025 : baseAnniv.getFullYear();

    const ordinal = (n: number) => {
      const s = ['th', 'st', 'nd', 'rd'];
      const v = n % 100;
      return n + (s[(v - 20) % 10] || s[v] || s[0]);
    };

    // 1. Next Annual Anniversary
    let annivYear = now.getFullYear();
    let nextAnniv = new Date(annivYear, annivMonth, annivDay, 0, 0, 0, 0);
    if (nextAnniv.getTime() <= now.getTime()) {
      annivYear += 1;
      nextAnniv = new Date(annivYear, annivMonth, annivDay, 0, 0, 0, 0);
    }
    const yearsTogether = annivYear - startYear;

    // 2. Next Monthly Milestone (Monthiversary)
    let mYear = now.getFullYear();
    let mMonth = now.getMonth();
    let nextMonthly = new Date(mYear, mMonth, annivDay, 0, 0, 0, 0);
    if (nextMonthly.getTime() <= now.getTime()) {
      mMonth += 1;
      if (mMonth > 11) {
        mMonth = 0;
        mYear += 1;
      }
      nextMonthly = new Date(mYear, mMonth, annivDay, 0, 0, 0, 0);
    }

    // 3. Next Valentine's Day (Feb 14)
    let vYear = now.getFullYear();
    let nextVDay = new Date(vYear, 1, 14, 0, 0, 0, 0);
    if (nextVDay.getTime() <= now.getTime()) {
      vYear += 1;
      nextVDay = new Date(vYear, 1, 14, 0, 0, 0, 0);
    }

    return [
      {
        id: 'anniversary',
        title: `${ordinal(yearsTogether)} Anniversary`,
        shortLabel: 'Next Anniversary',
        targetDate: nextAnniv,
        formattedDate: nextAnniv.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        }),
        badge: 'Annual Celebration',
        note: 'Counting down every heartbeat until we celebrate another milestone of our forever story!',
      },
      {
        id: 'monthly',
        title: 'Next Monthiversary',
        shortLabel: 'Monthiversary',
        targetDate: nextMonthly,
        formattedDate: nextMonthly.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'long',
          day: 'numeric',
        }),
        badge: 'Monthly Milestone',
        note: 'Every single month with you is a precious reason to fall in love all over again.',
      },
      {
        id: 'valentines',
        title: "Valentine's Day",
        shortLabel: "Valentine's",
        targetDate: nextVDay,
        formattedDate: nextVDay.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        }),
        badge: 'Day of Romance',
        note: 'A special day for sweet chocolate kisses, red roses, and loving you endlessly.',
      },
    ];
  }, [anniversaryDate, now]);

  const activeOccasion = occasions.find((o) => o.id === selectedOccasionId) || occasions[0];

  // Calculate live countdown to the active occasion
  const diffToOccasion = Math.max(0, activeOccasion.targetDate.getTime() - now.getTime());
  const countdownDays = Math.floor(diffToOccasion / (1000 * 60 * 60 * 24));
  const countdownHours = Math.floor((diffToOccasion / (1000 * 60 * 60)) % 24);
  const countdownMinutes = Math.floor((diffToOccasion / (1000 * 60)) % 60);
  const countdownSeconds = Math.floor((diffToOccasion / 1000) % 60);

  const handleCelebrateOccasion = () => {
    sound.playChime('sparkle');
    try {
      confetti({
        particleCount: 45,
        spread: 70,
        origin: { y: 0.65 },
        colors: ['#f43f5e', '#ec4899', '#fda4af', '#fb7185', '#ffe4e6'],
      });
    } catch {
      // safe fallback
    }
  };

  const totalHeartbeats = (time.totalSeconds * 1.25).toLocaleString('en-US', {
    maximumFractionDigits: 0,
  });

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center py-6 px-4 text-center">
      {/* Top romantic pill */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-100/90 border border-rose-200 text-rose-700 text-xs sm:text-sm font-semibold mb-6 shadow-xs animate-pulse">
        <Sparkles className="w-4 h-4 text-rose-500" />
        <span>Since 1 January 2025 • Our Forever Story</span>
      </div>

      {/* Main Title */}
      <h2
        className="text-4xl sm:text-6xl md:text-7xl font-bold text-rose-950 tracking-tight mb-3"
        style={{ fontFamily: "'Dancing Script', cursive" }}
      >
        Our Time Together
      </h2>

      <p className="text-sm sm:text-base text-rose-800/80 max-w-xl mb-10">
        Every single second since <span className="font-semibold text-rose-900">1 January 2025</span> has been brighter, sweeter, and more meaningful with you by my side.
      </p>

      {/* Hero Time Counters Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5 w-full max-w-3xl mb-8">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-pink-200/80 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center justify-center">
          <span className="text-4xl sm:text-6xl font-extrabold text-rose-600 tracking-tight font-mono">
            {time.days}
          </span>
          <span className="text-xs uppercase tracking-widest font-semibold text-rose-900/70 mt-2">
            Days of Love
          </span>
        </div>

        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-pink-200/80 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center justify-center">
          <span className="text-4xl sm:text-6xl font-extrabold text-rose-600 tracking-tight font-mono">
            {String(time.hours).padStart(2, '0')}
          </span>
          <span className="text-xs uppercase tracking-widest font-semibold text-rose-900/70 mt-2">
            Hours
          </span>
        </div>

        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-pink-200/80 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center justify-center">
          <span className="text-4xl sm:text-6xl font-extrabold text-rose-600 tracking-tight font-mono">
            {String(time.minutes).padStart(2, '0')}
          </span>
          <span className="text-xs uppercase tracking-widest font-semibold text-rose-900/70 mt-2">
            Minutes
          </span>
        </div>

        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-pink-200/80 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center justify-center relative overflow-hidden">
          <span className="text-4xl sm:text-6xl font-extrabold text-rose-500 tracking-tight font-mono">
            {String(time.seconds).padStart(2, '0')}
          </span>
          <span className="text-xs uppercase tracking-widest font-semibold text-rose-900/70 mt-2">
            Seconds
          </span>
          <div className="absolute top-2 right-2">
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400 animate-ping" />
          </div>
        </div>
      </div>

      {/* Elegant Countdown Widget to the Next Special Occasion / Anniversary */}
      <div className="bg-white/95 backdrop-blur-md rounded-3xl p-5 sm:p-6 border border-rose-200/90 shadow-[0_10px_35px_rgba(255,182,193,0.3)] max-w-2xl w-full mb-8 relative overflow-hidden text-rose-950 transition-all">
        {/* Subtle decorative background gradient */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-gradient-to-br from-rose-200/40 via-pink-200/30 to-transparent rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-tr from-pink-200/30 via-rose-100/40 to-transparent rounded-full blur-xl pointer-events-none" />

        {/* Top Header & Occasion Switcher */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-4 border-b border-pink-100/90 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-rose-500/15 text-rose-600 flex items-center justify-center shadow-2xs">
              <Hourglass className="w-4 h-4 text-rose-600 animate-pulse" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
                  Next Special Occasion
                </span>
                <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-semibold text-[10px]">
                  {activeOccasion.badge}
                </span>
              </div>
              <p className="text-sm sm:text-base font-bold text-rose-950">
                {activeOccasion.title}
              </p>
            </div>
          </div>

          {/* Occasion Selection Pills */}
          <div className="flex items-center gap-1 bg-rose-50/90 p-1 rounded-full border border-pink-200/80">
            {occasions.map((occ) => {
              const isSelected = occ.id === selectedOccasionId;
              return (
                <button
                  key={occ.id}
                  onClick={() => {
                    sound.playChime('pop');
                    setSelectedOccasionId(occ.id);
                  }}
                  className={`min-h-[34px] px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer select-none touch-manipulation ${
                    isSelected
                      ? 'bg-rose-500 text-white shadow-xs'
                      : 'text-rose-700 hover:text-rose-950 hover:bg-rose-100/70'
                  }`}
                  aria-label={`View countdown for ${occ.title}`}
                >
                  {occ.shortLabel}
                </button>
              );
            })}
          </div>
        </div>

        {/* Countdown Focus Section */}
        <div className="py-5 flex flex-col sm:flex-row items-center justify-between gap-5 relative z-10">
          {/* Days Left Hero */}
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <div className="flex items-baseline gap-2">
              <span className="text-5xl sm:text-6xl font-black font-mono text-rose-600 tracking-tight">
                {countdownDays}
              </span>
              <div className="flex flex-col text-left">
                <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-rose-900">
                  Days Left
                </span>
                <span className="text-[11px] text-rose-500 font-medium">
                  until celebration
                </span>
              </div>
            </div>

            <p className="text-xs text-rose-800/80 font-medium mt-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-rose-500" />
              <span>{activeOccasion.formattedDate}</span>
            </p>
          </div>

          {/* Detailed Ticking Timer Badge */}
          <div className="flex flex-col items-center sm:items-end gap-2">
            <div className="flex items-center gap-1.5 bg-rose-50/90 px-3.5 py-2 rounded-2xl border border-pink-200">
              <div className="text-center px-1.5">
                <span className="text-base sm:text-lg font-bold font-mono text-rose-700 block leading-tight">
                  {String(countdownHours).padStart(2, '0')}
                </span>
                <span className="text-[9px] uppercase tracking-wider text-rose-500 font-semibold block">
                  Hours
                </span>
              </div>
              <span className="text-rose-300 font-bold">:</span>
              <div className="text-center px-1.5">
                <span className="text-base sm:text-lg font-bold font-mono text-rose-700 block leading-tight">
                  {String(countdownMinutes).padStart(2, '0')}
                </span>
                <span className="text-[9px] uppercase tracking-wider text-rose-500 font-semibold block">
                  Mins
                </span>
              </div>
              <span className="text-rose-300 font-bold">:</span>
              <div className="text-center px-1.5">
                <span className="text-base sm:text-lg font-bold font-mono text-rose-600 block leading-tight">
                  {String(countdownSeconds).padStart(2, '0')}
                </span>
                <span className="text-[9px] uppercase tracking-wider text-rose-500 font-semibold block">
                  Secs
                </span>
              </div>
            </div>

            <button
              onClick={handleCelebrateOccasion}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-100/60 hover:bg-rose-100 px-3 py-1.5 rounded-full transition-all cursor-pointer active:scale-95 touch-manipulation"
              title="Sprinkle some early love confetti!"
            >
              <PartyPopper className="w-3.5 h-3.5 text-rose-500" />
              <span>Can't wait! 🎉</span>
            </button>
          </div>
        </div>

        {/* Sweet Note Footer of the Widget */}
        <div className="pt-3 border-t border-pink-100 text-xs text-rose-700/90 italic text-center sm:text-left flex items-center justify-center sm:justify-start gap-2 relative z-10">
          <Sparkles className="w-3.5 h-3.5 text-rose-400 shrink-0" />
          <span>"{activeOccasion.note}"</span>
        </div>
      </div>

      {/* Daily Love Affirmation Box (Rotates unique encouraging message every 24 hours) */}
      <DailyLoveAffirmation partnerName={partnerName} yourName={yourName} />

      {/* Sweet Milestone Statistics Card */}
      <div className="bg-gradient-to-r from-rose-500/10 via-pink-500/10 to-rose-500/10 border border-pink-200 rounded-2xl p-5 sm:p-6 w-full max-w-2xl mb-8 flex flex-col sm:flex-row items-center justify-around gap-4 text-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-rose-500/15 flex items-center justify-center text-rose-600">
            <Calendar className="w-5 h-5" />
          </div>
          <div className="text-left">
            <p className="text-xs text-rose-800/70 font-medium">Official Anniversary</p>
            <p className="text-sm sm:text-base font-bold text-rose-950">1 January 2025</p>
          </div>
        </div>

        <div className="hidden sm:block w-px h-10 bg-rose-200" />

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-rose-500/15 flex items-center justify-center text-rose-600">
            <Clock className="w-5 h-5" />
          </div>
          <div className="text-left">
            <p className="text-xs text-rose-800/70 font-medium">Heartbeats Together</p>
            <p className="text-sm sm:text-base font-bold text-rose-950">~{totalHeartbeats} Beats</p>
          </div>
        </div>

        <div className="hidden sm:block w-px h-10 bg-rose-200" />

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-rose-500/15 flex items-center justify-center text-rose-600">
            <Heart className="w-5 h-5 fill-rose-600" />
          </div>
          <div className="text-left">
            <p className="text-xs text-rose-800/70 font-medium">Couple</p>
            <p className="text-sm sm:text-base font-bold text-rose-950">{partnerName} & {yourName}</p>
          </div>
        </div>
      </div>

      {/* Forward Action Button */}
      <button
        onClick={() => {
          sound.playChime('sparkle');
          onNext();
        }}
        className="group inline-flex items-center justify-center gap-2 min-h-[48px] min-w-[140px] px-8 sm:px-10 py-3.5 rounded-full bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer select-none touch-manipulation"
      >
        <span>Next</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
      </button>
    </div>
  );
};
