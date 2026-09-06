import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Lock,
  Unlock,
  KeyRound,
  Sparkles,
  Delete,
  Heart,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  LockKeyhole,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/audio';

interface PasswordSlideProps {
  partnerName: string;
  isUnlocked: boolean;
  onUnlockSuccess: () => void;
  onNext: () => void;
  onRelock: () => void;
}

const CORRECT_CODE = '1802';

// Keypad metadata with romantic sub-labels
const KEYPAD_DIGITS = [
  { digit: '1', label: 'LOVE' },
  { digit: '2', label: 'ETERNAL' },
  { digit: '3', label: 'YOURS' },
  { digit: '4', label: 'HEART' },
  { digit: '5', label: 'SWEET' },
  { digit: '6', label: 'DREAM' },
  { digit: '7', label: 'DEVOTION' },
  { digit: '8', label: 'ALWAYS' },
  { digit: '9', label: 'DARLING' },
];

export const PasswordSlide: React.FC<PasswordSlideProps> = ({
  partnerName,
  isUnlocked,
  onUnlockSuccess,
  onNext,
  onRelock,
}) => {
  const [pin, setPin] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);
  const [isSuccessAnim, setIsSuccessAnim] = useState<boolean>(false);
  const [showDigits, setShowDigits] = useState<boolean>(true);

  // Trigger celebratory confetti burst
  const triggerUnlockCelebration = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#f43f5e', '#ec4899', '#fbbf24', '#f472b6', '#ffffff'],
      });
    } catch {
      // safe fallback
    }
  };

  const handleDigitPress = useCallback(
    (digit: string) => {
      if (isSuccessAnim || isUnlocked) return;
      if (pin.length >= 4) return;

      sound.playChime('pop');
      const newPin = pin + digit;
      setPin(newPin);
      setIsError(false);

      // Check automatically on 4th digit
      if (newPin.length === 4) {
        if (newPin === CORRECT_CODE) {
          // Success!
          setIsSuccessAnim(true);
          sound.playChime('sparkle');
          if (!sound.getIsPlaying()) {
            sound.startMusicBox();
          }
          triggerUnlockCelebration();

          setTimeout(() => {
            onUnlockSuccess();
            setIsSuccessAnim(false);
            setPin('');
            // Auto-advance to slide 1
            setTimeout(() => {
              onNext();
            }, 600);
          }, 1400);
        } else {
          // Error shake
          setIsError(true);
          sound.playBell(220, 0.4, 0.2); // gentle low buzz
          setTimeout(() => {
            setPin('');
            setIsError(false);
          }, 900);
        }
      }
    },
    [pin, isSuccessAnim, isUnlocked, onUnlockSuccess, onNext]
  );

  const handleDelete = useCallback(() => {
    if (isSuccessAnim || isUnlocked) return;
    if (pin.length > 0) {
      sound.playBell(440, 0.15, 0.1);
      setPin((prev) => prev.slice(0, -1));
      setIsError(false);
    }
  }, [pin, isSuccessAnim, isUnlocked]);

  const handleClear = useCallback(() => {
    if (isSuccessAnim || isUnlocked) return;
    sound.playBell(330, 0.15, 0.1);
    setPin('');
    setIsError(false);
  }, [isSuccessAnim, isUnlocked]);

  // Physical keyboard listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isUnlocked && !isSuccessAnim) return;

      if (e.key >= '0' && e.key <= '9') {
        e.preventDefault();
        handleDigitPress(e.key);
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleDelete();
      } else if (e.key === 'Escape' || e.key === 'c' || e.key === 'C') {
        handleClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleDigitPress, handleDelete, handleClear, isUnlocked, isSuccessAnim]);

  return (
    <div className="w-full flex flex-col items-center justify-center py-2 sm:py-6 px-3">
      {/* Decorative Aura Orbs */}
      <div className="relative w-full max-w-md">
        <div className="absolute -top-16 -left-16 w-56 h-56 bg-gradient-to-br from-rose-300/30 via-pink-400/20 to-amber-200/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-56 h-56 bg-gradient-to-tr from-pink-400/25 via-rose-300/20 to-rose-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Main Luxury Glass Vault Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
          className="relative w-full bg-gradient-to-b from-white/95 via-white/90 to-rose-50/90 backdrop-blur-xl rounded-[2.2rem] p-6 sm:p-8 shadow-[0_20px_50px_rgba(244,63,94,0.12)] border border-rose-200/80 overflow-hidden flex flex-col items-center"
        >
          {/* Top Rose-Gold Shimmer Bar */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-rose-300 via-pink-500 via-amber-300 to-rose-400" />

          {/* Top Luxury Pill Badge */}
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-rose-50 via-pink-50 to-rose-100 text-rose-700 text-xs font-semibold mb-4 border border-rose-200/80 shadow-2xs">
            <KeyRound className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
            <span className="tracking-wide">SECRET LOVE VAULT</span>
          </div>

          {/* 3D-Styled Luxury Padlock Artwork */}
          <div className="relative mb-4 flex items-center justify-center">
            <motion.div
              animate={
                isSuccessAnim || isUnlocked
                  ? {
                      scale: [1, 1.15, 1.05],
                      rotate: [0, -6, 6, 0],
                    }
                  : isError
                  ? {
                      x: [0, -12, 12, -8, 8, -4, 4, 0],
                    }
                  : {
                      y: [0, -5, 0],
                    }
              }
              transition={
                isSuccessAnim || isUnlocked
                  ? { duration: 0.8, ease: 'easeOut' }
                  : isError
                  ? { duration: 0.5 }
                  : { duration: 3.5, repeat: Infinity, ease: 'easeInOut' }
              }
              className={`w-20 h-20 sm:w-24 sm:h-24 rounded-3xl flex items-center justify-center relative transition-all duration-500 ${
                isSuccessAnim || isUnlocked
                  ? 'bg-gradient-to-tr from-emerald-400 via-teal-500 to-emerald-600 text-white shadow-xl shadow-emerald-300/50'
                  : isError
                  ? 'bg-gradient-to-tr from-rose-500 via-red-500 to-rose-600 text-white shadow-xl shadow-red-300/60'
                  : 'bg-gradient-to-tr from-rose-500 via-pink-500 to-amber-500 text-white shadow-xl shadow-rose-400/40'
              }`}
            >
              {/* Metallic Golden Padlock Shackle with Spring Pivot */}
              <motion.div
                animate={
                  isSuccessAnim || isUnlocked
                    ? { y: -16, rotate: -28 }
                    : { y: 0, rotate: 0 }
                }
                transition={{ type: 'spring', stiffness: 240, damping: 15 }}
                className="absolute -top-6 w-12 h-11 border-[5px] rounded-t-full -z-10 shadow-sm transition-colors duration-500"
                style={{
                  borderColor: isSuccessAnim || isUnlocked ? '#34d399' : '#f59e0b',
                  transformOrigin: 'top left',
                }}
              />

              {/* Gleam Sweep Reflection */}
              <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
                <div className="w-full h-full bg-gradient-to-tr from-white/25 via-transparent to-transparent opacity-80" />
              </div>

              {/* Icon inside vault body */}
              {isSuccessAnim || isUnlocked ? (
                <Unlock className="w-9 h-9 sm:w-11 sm:h-11 drop-shadow-md text-emerald-50" />
              ) : (
                <Lock className="w-9 h-9 sm:w-11 sm:h-11 drop-shadow-md text-rose-50" />
              )}

              {/* Floating Mini Hearts & Sparkles when unlocked */}
              <AnimatePresence>
                {(isSuccessAnim || isUnlocked) && (
                  <>
                    <motion.span
                      initial={{ opacity: 0, scale: 0, y: 0 }}
                      animate={{ opacity: 1, scale: 1.2, y: -32, x: -22 }}
                      exit={{ opacity: 0 }}
                      className="absolute text-rose-500 text-lg pointer-events-none"
                    >
                      💖
                    </motion.span>
                    <motion.span
                      initial={{ opacity: 0, scale: 0, y: 0 }}
                      animate={{ opacity: 1, scale: 1.2, y: -36, x: 24 }}
                      exit={{ opacity: 0 }}
                      className="absolute text-amber-400 text-lg pointer-events-none"
                    >
                      ✨
                    </motion.span>
                  </>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Heading */}
          <h2 className="text-xl sm:text-2xl font-bold text-rose-950 font-serif text-center mb-1 tracking-tight">
            {isSuccessAnim || isUnlocked ? (
              <span className="text-emerald-700 flex items-center justify-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                Welcome, {partnerName}!
              </span>
            ) : (
              `For My Love, ${partnerName}`
            )}
          </h2>

          <p className="text-xs sm:text-sm text-rose-800/80 text-center max-w-xs mb-5 font-sans leading-relaxed">
            {isSuccessAnim ? (
              <span className="text-emerald-600 font-semibold animate-pulse">
                Passcode verified! Opening our world... ✨
              </span>
            ) : isUnlocked ? (
              'Our secret vault is unlocked. You can explore all our memories anytime!'
            ) : isError ? (
              <span className="text-rose-600 font-semibold">
                Incorrect passcode! Please try again 💕
              </span>
            ) : (
              'Enter our special 4-digit secret key to unlock our love story.'
            )}
          </p>

          {/* Already Unlocked View */}
          {isUnlocked && !isSuccessAnim ? (
            <div className="w-full flex flex-col items-center gap-3.5">
              <div className="w-full p-4 rounded-2xl bg-emerald-50/90 border border-emerald-200/80 text-center flex flex-col items-center gap-1.5 shadow-xs">
                <div className="flex items-center gap-2 text-emerald-800 font-semibold text-sm">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Passcode 1802 Activated</span>
                </div>
                <p className="text-xs text-emerald-700/85">
                  You have full access to all love letters, starlight sky, reasons, and our forever ending.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full mt-1">
                <button
                  id="enter-slideshow-btn"
                  onClick={onNext}
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Next</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  id="relock-vault-btn"
                  onClick={() => {
                    sound.playBell(300, 0.2, 0.1);
                    onRelock();
                    setPin('');
                  }}
                  className="w-full sm:w-auto py-3 px-5 rounded-2xl bg-rose-100 hover:bg-rose-200 text-rose-800 font-medium text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  title="Lock again to re-test the passcode"
                >
                  <LockKeyhole className="w-3.5 h-3.5" />
                  <span>Relock</span>
                </button>
              </div>
            </div>
          ) : (
            /* Passcode Input View */
            <div className="w-full flex flex-col items-center">
              {/* 4 Digit Slots - Luxury Crystal Jewel Style */}
              <motion.div
                animate={isError ? { x: [-10, 10, -8, 8, -4, 4, 0] } : {}}
                transition={{ duration: 0.45 }}
                className="flex items-center justify-center gap-3 sm:gap-4 mb-5"
              >
                {[0, 1, 2, 3].map((index) => {
                  const hasChar = pin.length > index;
                  const char = pin[index];

                  return (
                    <motion.div
                      key={index}
                      animate={
                        hasChar
                          ? {
                              scale: [1, 1.18, 1],
                              borderColor: isError ? '#f43f5e' : isSuccessAnim ? '#10b981' : '#f43f5e',
                            }
                          : { scale: 1 }
                      }
                      transition={{ duration: 0.2 }}
                      className={`w-12 h-14 sm:w-14 sm:h-16 rounded-2xl flex items-center justify-center border-2 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.04)] relative ${
                        isError
                          ? 'border-red-400 bg-red-50 text-red-600 shadow-red-100'
                          : isSuccessAnim
                          ? 'border-emerald-400 bg-emerald-50 text-emerald-700 shadow-emerald-100'
                          : hasChar
                          ? 'border-rose-400 bg-gradient-to-b from-white to-rose-50 text-rose-900 shadow-rose-200/50'
                          : 'border-pink-200/80 bg-white/80 text-pink-300'
                      }`}
                    >
                      {hasChar ? (
                        showDigits ? (
                          <span className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-rose-950">
                            {char}
                          </span>
                        ) : (
                          <Heart className="w-5 h-5 sm:w-6 sm:h-6 fill-rose-500 text-rose-500 animate-pulse" />
                        )
                      ) : (
                        <span className="w-2.5 h-2.5 rounded-full bg-pink-200" />
                      )}
                    </motion.div>
                  );
                })}
              </motion.div>

              {/* Toggle Show/Hide digits */}
              <div className="flex items-center justify-center w-full px-2 mb-4 text-xs">
                <button
                  type="button"
                  onClick={() => setShowDigits(!showDigits)}
                  className="text-rose-700/80 hover:text-rose-950 underline underline-offset-2 cursor-pointer transition-colors font-medium"
                >
                  {showDigits ? 'Mask with hearts' : 'Show numbers'}
                </button>
              </div>

              {/* Styled Keypad - Tactile Luxury Rose-Gold Keycaps */}
              <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5 w-full max-w-xs mb-4">
                {KEYPAD_DIGITS.map(({ digit, label }) => (
                  <motion.button
                    key={digit}
                    whileHover={{ scale: 1.04, y: -2 }}
                    whileTap={{ scale: 0.94, y: 1 }}
                    onClick={() => handleDigitPress(digit)}
                    disabled={isSuccessAnim}
                    className="h-14 sm:h-16 rounded-2xl bg-gradient-to-b from-white via-white to-pink-50/70 hover:from-white hover:to-rose-100/70 border border-pink-200/90 hover:border-rose-400 text-rose-950 font-bold shadow-[0_4px_0_#fecdd3,0_6px_14px_rgba(244,63,94,0.08)] active:shadow-[0_1px_0_#fecdd3] active:translate-y-1 transition-all flex flex-col items-center justify-center cursor-pointer disabled:opacity-50 group"
                  >
                    <span className="text-xl sm:text-2xl font-bold font-sans text-rose-950 leading-none group-hover:text-rose-600 transition-colors">
                      {digit}
                    </span>
                    <span className="text-[9px] font-bold text-rose-400/90 tracking-widest mt-0.5 uppercase">
                      {label}
                    </span>
                  </motion.button>
                ))}

                {/* Clear Button */}
                <motion.button
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.94, y: 1 }}
                  onClick={handleClear}
                  disabled={isSuccessAnim || pin.length === 0}
                  className="h-14 sm:h-16 rounded-2xl bg-gradient-to-b from-rose-50 to-pink-100 hover:from-rose-100 hover:to-pink-200/80 border border-pink-200 text-rose-700 font-bold text-xs shadow-[0_4px_0_#fecdd3,0_4px_10px_rgba(244,63,94,0.06)] active:shadow-[0_1px_0_#fecdd3] active:translate-y-1 transition-all flex flex-col items-center justify-center cursor-pointer disabled:opacity-40"
                >
                  <span className="text-xs uppercase tracking-wider font-semibold">Clear</span>
                  <span className="text-[9px] text-rose-400">RESET</span>
                </motion.button>

                {/* Zero Button */}
                <motion.button
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.94, y: 1 }}
                  onClick={() => handleDigitPress('0')}
                  disabled={isSuccessAnim}
                  className="h-14 sm:h-16 rounded-2xl bg-gradient-to-b from-white via-white to-pink-50/70 hover:from-white hover:to-rose-100/70 border border-pink-200/90 hover:border-rose-400 text-rose-950 font-bold shadow-[0_4px_0_#fecdd3,0_6px_14px_rgba(244,63,94,0.08)] active:shadow-[0_1px_0_#fecdd3] active:translate-y-1 transition-all flex flex-col items-center justify-center cursor-pointer disabled:opacity-50 group"
                >
                  <span className="text-xl sm:text-2xl font-bold font-sans text-rose-950 leading-none group-hover:text-rose-600 transition-colors">
                    0
                  </span>
                  <span className="text-[9px] font-bold text-rose-400/90 tracking-widest mt-0.5 uppercase">
                    INFINITY ∞
                  </span>
                </motion.button>

                {/* Backspace Button */}
                <motion.button
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.94, y: 1 }}
                  onClick={handleDelete}
                  disabled={isSuccessAnim || pin.length === 0}
                  className="h-14 sm:h-16 rounded-2xl bg-gradient-to-b from-rose-50 to-pink-100 hover:from-rose-100 hover:to-pink-200/80 border border-pink-200 text-rose-700 font-semibold shadow-[0_4px_0_#fecdd3,0_4px_10px_rgba(244,63,94,0.06)] active:shadow-[0_1px_0_#fecdd3] active:translate-y-1 transition-all flex flex-col items-center justify-center cursor-pointer disabled:opacity-40"
                  title="Delete last digit"
                >
                  <Delete className="w-5 h-5 text-rose-600" />
                  <span className="text-[9px] text-rose-400 mt-0.5">DELETE</span>
                </motion.button>
              </div>

              <p className="text-[11px] text-rose-400 font-medium text-center">
                ✨ Tap the keys or press numbers on your keyboard
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
