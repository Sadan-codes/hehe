import React, { useState, useEffect } from 'react';
import { Sparkles, Heart, RefreshCw, Sun, Clock, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/audio';

interface DailyLoveAffirmationProps {
  partnerName: string;
  yourName: string;
}

interface AffirmationItem {
  theme: string;
  message: string;
  reflection: string;
}

const DAILY_AFFIRMATIONS: AffirmationItem[] = [
  {
    theme: 'Quiet Comfort',
    message: 'Our love is built not only in grand milestones, but in the soft, quiet safety of knowing we have each other at the end of every day.',
    reflection: 'Even in silence, holding your hand feels like coming home.',
  },
  {
    theme: 'Enduring Growth',
    message: 'Every challenge we meet is an invitation to grow closer, kinder, and more patient with each other’s hearts.',
    reflection: 'Together, we turn every hurdle into a stepping stone for our forever.',
  },
  {
    theme: 'Joy in the Little Things',
    message: 'The sweetest treasures of life are hidden inside your laughter, your gentle smiles, and the warm hugs we share.',
    reflection: 'A single shared smile with you can brighten an entire week.',
  },
  {
    theme: 'Unconditional Sanctuary',
    message: 'In a busy and unpredictable world, our bond remains our calm, unwavering sanctuary where you are always cherished.',
    reflection: 'You will never have to face this world alone.',
  },
  {
    theme: 'Grateful Hearts',
    message: 'Choosing you every day is the easiest and most beautiful decision my heart has ever made.',
    reflection: 'My love for you grows deeper with every sunrise.',
  },
  {
    theme: 'Shared Dreams',
    message: 'The future we are weaving together is brighter and more magical than anything I could have ever imagined on my own.',
    reflection: 'Hand in hand, there is no dream too large for us to reach.',
  },
  {
    theme: 'Patient Grace',
    message: 'True love listens with empathy, forgives with generosity, and protects each other with tender care.',
    reflection: 'Your peace and happiness will always matter to me as much as my own.',
  },
  {
    theme: 'Deep Belonging',
    message: 'To know you and to be loved by you is the greatest privilege of my life.',
    reflection: 'Every memory we create is etched forever into my soul.',
  },
  {
    theme: 'Strength in Partnership',
    message: 'We are stronger together than we could ever be apart; two souls lifting each other toward light and joy.',
    reflection: 'You inspire me to be the best version of myself every single day.',
  },
  {
    theme: 'Infinite Wonder',
    message: 'Even after all this time, discovering new depths in your thoughts and heart remains my favorite adventure.',
    reflection: 'I will never tire of falling in love with you over and over.',
  },
  {
    theme: 'Gentle Healing',
    message: 'Your warmth has a way of softening every worry and making heavy days feel light and bearable.',
    reflection: 'Your embrace is my safest place on earth.',
  },
  {
    theme: 'Playful Spark',
    message: 'May we never lose our childlike spark, our shared giggles, and our spontaneous moments of silly joy.',
    reflection: 'Loving you is full of fun, laughter, and pure happiness.',
  },
  {
    theme: 'Unbreakable Trust',
    message: 'Our love is anchored in honest words, gentle respect, and a promise that never wavers.',
    reflection: 'You have my whole heart, today, tomorrow, and always.',
  },
  {
    theme: 'Radiant Sunshine',
    message: 'Your presence brings an effortless warmth that lights up even the greyest afternoons.',
    reflection: 'Thank you for simply being the wonderful soul that you are.',
  },
  {
    theme: 'Cherished Rhythm',
    message: 'The rhythm of our days together is poetry in motion—simple, tender, and deeply cherished.',
    reflection: 'Every ordinary cup of coffee or quiet evening is extraordinary with you.',
  },
  {
    theme: 'Boundless Devotion',
    message: 'No distance, time, or circumstance could ever diminish the depth of love I hold for you.',
    reflection: 'My heart beats in harmony with yours across every moment.',
  },
  {
    theme: 'Mutual Flourishing',
    message: 'A beautiful relationship allows both souls to bloom freely, cheered on by each other’s unconditional support.',
    reflection: 'I will always be your loudest cheerleader and biggest believer.',
  },
  {
    theme: 'Timeless Romance',
    message: 'Years will pass and seasons will turn, but my devotion to your happiness will always remain brand new.',
    reflection: 'Our love story is my favorite book, and we are still writing its sweetest chapters.',
  },
  {
    theme: 'Courage & Peace',
    message: 'With you, my heart finds courage to dream boldly and peace to rest completely.',
    reflection: 'You are both my greatest adventure and my softest landing.',
  },
  {
    theme: 'Everlasting Home',
    message: 'Home is not a place on a map; home is whenever your hand is in mine.',
    reflection: 'Wherever life takes us, as long as we are together, we are home.',
  },
];

export const DailyLoveAffirmation: React.FC<DailyLoveAffirmationProps> = ({
  partnerName,
  yourName,
}) => {
  const [timeUntilReset, setTimeUntilReset] = useState<string>('');
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isLoved, setIsLoved] = useState<boolean>(false);

  // Derive today's unique affirmation based on current calendar date (resets every 24h at midnight)
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
  );
  const currentIndex = Math.abs((dayOfYear + today.getFullYear()) % DAILY_AFFIRMATIONS.length);
  const currentAffirmation = DAILY_AFFIRMATIONS[currentIndex];

  // Calculate live countdown to the next midnight (when affirmation resets)
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0);
      const diff = tomorrow.getTime() - now.getTime();

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeUntilReset(`${hours}h ${minutes}m ${seconds}s`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleHeartClick = () => {
    sound.playChime('sparkle');
    setIsLoved(!isLoved);
    try {
      confetti({
        particleCount: 30,
        spread: 55,
        origin: { y: 0.7 },
        colors: ['#f43f5e', '#ec4899', '#fda4af', '#fb7185'],
      });
    } catch {
      // safe fallback
    }
  };

  const handleCopy = async () => {
    const textToCopy = `"${currentAffirmation.message}" — Daily Love Affirmation for ${partnerName} & ${yourName}`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
      sound.playChime('pop');
      setTimeout(() => setIsCopied(false), 2400);
    } catch {
      // safe fallback
    }
  };

  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div
      id="daily-love-affirmation-box"
      className="bg-white/95 backdrop-blur-md rounded-3xl p-5 sm:p-6 border border-pink-200/90 shadow-[0_8px_30px_rgba(255,182,193,0.28)] max-w-2xl w-full mb-8 relative overflow-hidden text-rose-950 transition-all group"
    >
      {/* Decorative subtle ambient blush blobs */}
      <div className="absolute -top-10 -left-10 w-28 h-28 bg-pink-200/35 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-rose-200/30 rounded-full blur-2xl pointer-events-none" />

      {/* Header Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3.5 border-b border-pink-100/90 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-rose-500/15 text-rose-600 flex items-center justify-center shadow-2xs">
            <Sun className="w-4 h-4 text-rose-600 animate-spin-slow" />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
                Daily Love Affirmation
              </span>
              <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-semibold text-[10px]">
                {currentAffirmation.theme}
              </span>
            </div>
            <p className="text-xs text-rose-800/80 font-medium">
              {formattedDate} • For {partnerName} & {yourName}
            </p>
          </div>
        </div>

        {/* 24-hour cycle badge */}
        <div className="flex items-center gap-1.5 bg-rose-50/90 px-3 py-1 rounded-full border border-pink-200/80 text-[11px] font-semibold text-rose-700">
          <Clock className="w-3 h-3 text-rose-500" />
          <span className="text-rose-500 font-medium">New in:</span>
          <span className="font-mono text-rose-800 font-bold">{timeUntilReset}</span>
        </div>
      </div>

      {/* Main Affirmation Quote Box */}
      <div className="py-4 relative z-10 text-center sm:text-left">
        <div className="relative">
          <span className="text-4xl sm:text-5xl font-serif text-rose-300 absolute -top-4 -left-2 select-none pointer-events-none">
            “
          </span>
          <p className="text-base sm:text-lg font-medium text-rose-950 leading-relaxed pl-3 pr-2 relative z-10">
            {currentAffirmation.message}
          </p>
        </div>

        {/* Gentle Reflection Thought */}
        <div className="mt-3.5 pl-3 flex items-start gap-2 text-xs sm:text-sm text-rose-700/85 italic bg-rose-50/60 p-3 rounded-2xl border border-pink-100">
          <Sparkles className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <span>"{currentAffirmation.reflection}"</span>
        </div>
      </div>

      {/* Footer Controls */}
      <div className="pt-3 border-t border-pink-100/90 flex flex-wrap items-center justify-between gap-2.5 relative z-10">
        <span className="text-[11px] text-rose-800/70 font-medium">
          A fresh reminder of our bond every 24 hours.
        </span>

        <div className="flex items-center gap-2">
          {/* Heart / Cherish button */}
          <button
            onClick={handleHeartClick}
            className={`min-h-[38px] px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 select-none touch-manipulation border ${
              isLoved
                ? 'bg-rose-500 text-white border-rose-500 shadow-xs'
                : 'bg-rose-50 text-rose-700 border-pink-200 hover:bg-rose-100'
            }`}
            title="Cherish this affirmation"
            aria-label="Cherish this affirmation"
          >
            <Heart className={`w-3.5 h-3.5 ${isLoved ? 'fill-white text-white' : 'fill-rose-500 text-rose-500'}`} />
            <span>{isLoved ? 'Cherished' : 'Cherish'}</span>
          </button>

          {/* Copy / Share affirmation button */}
          <button
            onClick={handleCopy}
            className="min-h-[38px] px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 bg-white hover:bg-rose-50 text-rose-700 border border-pink-200 transition-all cursor-pointer active:scale-95 select-none touch-manipulation"
            title="Copy today's love affirmation"
            aria-label="Copy today's love affirmation"
          >
            {isCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-green-600" />
                <span className="text-green-700">Copied!</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-3.5 h-3.5 text-rose-500" />
                <span>Copy Note</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
