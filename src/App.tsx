import React, { useState, useEffect } from 'react';
import {
  DEFAULT_PROFILE,
  DEFAULT_SPECIAL_NOTE,
  DEFAULT_LOVE_NOTES,
  DEFAULT_REASONS,
  loadFromStorage,
  saveToStorage,
} from './utils/storage';
import { CoupleProfile, LoveNote, LoveReason, SpecialLoveNote } from './types';
import { OpeningIntro3D } from './components/OpeningIntro3D';
import { TimeTogetherSlide } from './components/TimeTogetherSlide';
import { SpecialLoveNoteSlide } from './components/SpecialLoveNoteSlide';
import { LoveScene3D } from './components/LoveScene3D';
import { StarSkySlide } from './components/StarSkySlide';
import { LoveLetters } from './components/LoveLetters';
import { ReasonsJar } from './components/ReasonsJar';
import { PasswordSlide } from './components/PasswordSlide';
import { EndingSlide } from './components/EndingSlide';
import { HeartbeatModal } from './components/HeartbeatModal';
import { MusicBoxPlayer } from './components/MusicBoxPlayer';
import { HeartCursorTrail } from './components/HeartCursorTrail';
import { RosePetalsBackground } from './components/RosePetalsBackground';
import { AtmosphericOverlay } from './components/AtmosphericOverlay';
import { AtmosphereModal } from './components/AtmosphereModal';
import { EditProfileModal } from './components/EditProfileModal';
import { useAtmosphere } from './utils/useAtmosphere';
import { sound } from './utils/audio';
import confetti from 'canvas-confetti';
import {
  Heart,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Clock,
  BookOpen,
  Box,
  Stars,
  Mail,
  Smile,
  Activity,
  Lock,
  Infinity as InfinityIcon,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // Couple Profile with customizable names & anniversary (Aishhh & Sadan)
  const [profile, setProfile] = useState<CoupleProfile>(() => {
    const loaded = loadFromStorage<CoupleProfile>('girlfriend_profile', DEFAULT_PROFILE);
    if (
      !loaded.partnerName ||
      loaded.partnerName.toLowerCase().includes('princess') ||
      loaded.partnerName.toLowerCase().includes('girlfriend')
    ) {
      const updated: CoupleProfile = {
        ...DEFAULT_PROFILE,
        partnerName: 'Aishhh',
        yourName: 'Sadan',
        nickname: 'Aishhh',
      };
      saveToStorage('girlfriend_profile', updated);
      return updated;
    }
    return loaded;
  });

  // 3D Opening Intro state
  const [showIntro, setShowIntro] = useState(true);

  // Vault Unlock State (Passcode 1802) - Always starts locked on new session/refresh
  const [isVaultUnlocked, setIsVaultUnlocked] = useState<boolean>(false);

  // Clear any persisted unlock flag so it never opens pre-unlocked
  useEffect(() => {
    try {
      localStorage.removeItem('girlfriend_vault_unlocked');
    } catch {}
  }, []);

  // Modals state
  const [showHeartbeat, setShowHeartbeat] = useState(false);
  const [showAtmosphereModal, setShowAtmosphereModal] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);

  // Live Location Atmospheric Weather Engine
  const {
    weatherData,
    setMode: setAtmosphereMode,
    setIntensity: setAtmosphereIntensity,
    toggleAmbientRainAudio,
    detectLiveLocation,
  } = useAtmosphere();

  // Slideshow Navigation State: 0 to 6
  // 0: Password Lock (1802)
  // 1: Time Together
  // 2: Love Note
  // 3: 3D Crystal Heart
  // 4: Starlight Night Sky
  // 5: Love Letters
  // 6: Reasons Jar
  const [currentSlide, setCurrentSlide] = useState(0);

  // Special Love Note state
  const [specialNote, setSpecialNote] = useState<SpecialLoveNote>(() => {
    const loaded = loadFromStorage('girlfriend_special_note', DEFAULT_SPECIAL_NOTE);
    if (
      !loaded.title ||
      loaded.title.toLowerCase().includes('princess') ||
      loaded.signature.toLowerCase().includes('charming')
    ) {
      const updated: SpecialLoveNote = {
        ...DEFAULT_SPECIAL_NOTE,
        title: 'To My Dearest Aishhh',
        signature: 'With all my heart, forever yours, Sadan',
      };
      saveToStorage('girlfriend_special_note', updated);
      return updated;
    }
    return loaded;
  });

  const [notes, setNotes] = useState<LoveNote[]>(() => {
    const loaded = loadFromStorage('girlfriend_notes', DEFAULT_LOVE_NOTES);
    if (
      !loaded ||
      loaded.length === 0 ||
      loaded.some((n) => n.content?.toLowerCase().includes('princess') || n.title?.toLowerCase().includes('princess'))
    ) {
      saveToStorage('girlfriend_notes', DEFAULT_LOVE_NOTES);
      return DEFAULT_LOVE_NOTES;
    }
    return loaded;
  });

  const [reasons, setReasons] = useState<LoveReason[]>(() =>
    loadFromStorage('girlfriend_reasons', DEFAULT_REASONS)
  );

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Audio playback state synced with MusicBoxPlayer sound engine
  const [isMusicPlaying, setIsMusicPlaying] = useState<boolean>(sound.getIsPlaying());
  const [currentTrack, setCurrentTrack] = useState(sound.getCurrentTrack());

  useEffect(() => {
    const unsubscribe = sound.subscribe((playing, track) => {
      setIsMusicPlaying(playing);
      setCurrentTrack(track);
    });
    return unsubscribe;
  }, []);

  // Sync to storage
  useEffect(() => {
    saveToStorage('girlfriend_profile', profile);
  }, [profile]);

  useEffect(() => {
    saveToStorage('girlfriend_special_note', specialNote);
  }, [specialNote]);

  useEffect(() => {
    saveToStorage('girlfriend_notes', notes);
  }, [notes]);

  useEffect(() => {
    saveToStorage('girlfriend_reasons', reasons);
  }, [reasons]);

  // Keyboard navigation for slideshow
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showIntro) return;
      if (e.key === 'ArrowRight') {
        goToNextSlide();
      } else if (e.key === 'ArrowLeft') {
        goToPrevSlide();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showIntro, currentSlide, isVaultUnlocked]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const slideDefinitions = [
    { id: 0, title: 'Secret Code', icon: Lock, label: 'Secret Passcode' },
    { id: 1, title: 'Our Time', icon: Clock, label: 'Time Together' },
    { id: 2, title: 'Love Note', icon: BookOpen, label: 'Love Note' },
    { id: 3, title: '3D Heart', icon: Box, label: '3D Heart' },
    { id: 4, title: 'Starlight Sky', icon: Stars, label: 'Night Sky' },
    { id: 5, title: 'Love Letters', icon: Mail, label: 'Love Letters' },
    { id: 6, title: 'Reasons Jar', icon: Smile, label: 'Reasons Jar' },
    { id: 7, title: 'Our Forever', icon: InfinityIcon, label: 'Our Forever' },
  ];

  const totalSlides = slideDefinitions.length;

  const goToNextSlide = () => {
    if (currentSlide === 0 && !isVaultUnlocked) {
      sound.playBell(260, 0.3, 0.15);
      showToast('Enter our secret passcode to unlock! 🔑');
      return;
    }
    // Prevent navigating past the last slide!
    if (currentSlide >= totalSlides - 1) {
      return;
    }
    sound.playChime('pop');
    setCurrentSlide((prev) => Math.min(totalSlides - 1, prev + 1));
  };

  const goToPrevSlide = () => {
    if (currentSlide <= 0) {
      return;
    }
    if (!isVaultUnlocked) {
      setCurrentSlide(0);
      return;
    }
    sound.playChime('pop');
    setCurrentSlide((prev) => Math.max(0, prev - 1));
  };

  // Subtle pulse animation for 'Next' and 'Prev' navigation buttons after 5 seconds of inactivity
  const [isNavPulseActive, setIsNavPulseActive] = useState(false);

  useEffect(() => {
    let inactivityTimer: ReturnType<typeof setTimeout>;

    const resetInactivityTimer = () => {
      setIsNavPulseActive(false);
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        setIsNavPulseActive(true);
      }, 5000);
    };

    // Initialize 5-second countdown
    resetInactivityTimer();

    // Listen for any user activity (mouse, touch, keyboard, scroll, click)
    const activityEvents = [
      'mousemove',
      'mousedown',
      'mouseup',
      'keydown',
      'touchstart',
      'touchend',
      'scroll',
      'pointerdown',
      'wheel',
    ];

    const onUserActivity = () => {
      resetInactivityTimer();
    };

    activityEvents.forEach((evt) => {
      window.addEventListener(evt, onUserActivity, { passive: true });
    });

    return () => {
      clearTimeout(inactivityTimer);
      activityEvents.forEach((evt) => {
        window.removeEventListener(evt, onUserActivity);
      });
    };
  }, [currentSlide]); // Reset 5-second inactivity countdown on slide change as well

  // Mobile touch swipe handling for effortless slide navigation
  const touchStartX = React.useRef<number | null>(null);
  const touchStartY = React.useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const diffX = touchStartX.current - e.changedTouches[0].clientX;
    const diffY = touchStartY.current - e.changedTouches[0].clientY;

    // Dominant horizontal swipe with threshold >= 45px
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 45) {
      if (diffX > 0) {
        // Swiped Left -> Next slide (if not at end)
        if (currentSlide < totalSlides - 1) {
          goToNextSlide();
        }
      } else {
        // Swiped Right -> Previous slide (if not at beginning)
        if (currentSlide > 0) {
          goToPrevSlide();
        }
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  // Shower of Love / Kisses action - reduced, subtle & sweet
  const handleShowerLove = () => {
    sound.playKiss();

    // Gentle single subtle burst of soft petals/hearts
    confetti({
      particleCount: 12,
      spread: 45,
      origin: { y: 0.65 },
      colors: ['#ff4d88', '#fb7185', '#ffd166'],
      shapes: ['circle'],
      scalar: 0.9,
    });

    showToast(`Sent sweet kisses to ${profile.partnerName}! 💋✨`);
  };

  const handleAddNote = (newNote: LoveNote) => {
    setNotes((prev) => [newNote, ...prev]);
    showToast('Love letter added to your collection! 💌');
  };

  const handleAddReason = (newReason: LoveReason) => {
    setReasons((prev) => [...prev, newReason]);
    showToast('New reason dropped into the jar! ⭐');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF5F7] text-[#4A3540] relative selection:bg-pink-200 selection:text-pink-900 font-sans">
      {/* Subtle Drifting Rose Petals Background Particle System (only after entering) */}
      {!showIntro && <RosePetalsBackground />}

      {/* Subtle Weather Atmospheric Overlay (Light Rain, Soft Sunlight, Sunset Glow, etc.) */}
      <AtmosphericOverlay
        condition={weatherData.condition}
        intensity={weatherData.intensity}
      />

      {/* Floating Hearts Custom Cursor Trail (Mouse + Touch) */}
      <HeartCursorTrail />

      {/* 1. 3D OPENING INTRO: Heart pops out with her name */}
      <AnimatePresence>
        {showIntro && (
          <OpeningIntro3D
            partnerName={profile.partnerName}
            onEnter={() => {
              setShowIntro(false);
              setCurrentSlide(0); // Start at slide 0 (Our Time Together)
            }}
          />
        )}
      </AnimatePresence>

      {/* Interactive Modals */}
      <HeartbeatModal
        isOpen={showHeartbeat}
        onClose={() => setShowHeartbeat(false)}
        partnerName={profile.partnerName}
      />

      <EditProfileModal
        isOpen={showEditProfile}
        onClose={() => setShowEditProfile(false)}
        profile={profile}
        onSave={(updated) => {
          setProfile(updated);
          showToast(`Saved personalized profile for ${updated.partnerName} & ${updated.yourName}! 💑`);
        }}
      />

      {/* Weather Atmosphere Mood & Skies Modal */}
      <AtmosphereModal
        isOpen={showAtmosphereModal}
        onClose={() => setShowAtmosphereModal(false)}
        weatherData={weatherData}
        onSetMode={setAtmosphereMode}
        onSetIntensity={setAtmosphereIntensity}
        onToggleRainAudio={toggleAmbientRainAudio}
        onRefreshLocation={detectLiveLocation}
      />

      {/* Background aesthetic decorative pastel blurs */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-pink-200/35 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-10 right-1/4 w-[28rem] h-[28rem] bg-rose-200/25 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed top-1/2 left-10 w-80 h-80 bg-amber-100/30 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#FFF5F7]/90 backdrop-blur-md border-b border-pink-200/60 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2">
          {/* Logo / Title & Name Personalization */}
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 shrink-0">
              <Heart className="w-4 h-4 fill-rose-500" />
            </div>
            <div className="flex items-center gap-1.5 min-w-0">
              <span
                className="font-romantic text-xl sm:text-2xl text-rose-950 font-bold tracking-wide truncate max-w-[110px] xs:max-w-[150px] sm:max-w-none"
                style={{ fontFamily: "'Dancing Script', cursive" }}
              >
                For {profile.partnerName}
              </span>
              <button
                id="edit-profile-btn"
                onClick={() => {
                  sound.playChime('sparkle');
                  setShowEditProfile(true);
                }}
                className="px-2 py-0.5 rounded-full bg-pink-100 hover:bg-pink-200 active:bg-pink-300 text-rose-700 text-[10px] sm:text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer shadow-2xs border border-pink-200/80 shrink-0"
                title="Personalize names (Aishhh & Sadan)"
              >
                <Sparkles className="w-3 h-3 text-rose-500" />
                <span className="hidden xs:inline">Edit Names</span>
              </button>
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Weather Atmosphere Mood Button */}
            <button
              id="header-atmosphere-weather-btn"
              onClick={() => {
                sound.playChime('sparkle');
                setShowAtmosphereModal(true);
              }}
              className="min-h-[44px] px-2.5 sm:px-3 py-2 rounded-full bg-rose-50 hover:bg-rose-100 active:bg-rose-200 active:scale-95 text-rose-800 font-medium text-xs sm:text-sm border border-rose-200/80 transition-all cursor-pointer flex items-center justify-center gap-1.5 select-none touch-manipulation shadow-2xs"
              title={`Weather Atmosphere: ${weatherData.weatherDescription} (Click to customize sky)`}
              aria-label="Atmospheric weather settings"
            >
              <span className="text-sm shrink-0">
                {weatherData.condition === 'sunlight' && '☀️'}
                {weatherData.condition === 'rain' && '🌧️'}
                {weatherData.condition === 'golden_hour' && '🌅'}
                {weatherData.condition === 'cloudy' && '🌫️'}
                {weatherData.condition === 'night_stars' && '✨'}
                {weatherData.condition === 'snow' && '❄️'}
              </span>
              <span className="hidden sm:inline text-xs font-semibold">
                {weatherData.condition === 'sunlight' && 'Sunlight'}
                {weatherData.condition === 'rain' && 'Light Rain'}
                {weatherData.condition === 'golden_hour' && 'Sunset'}
                {weatherData.condition === 'cloudy' && 'Misty'}
                {weatherData.condition === 'night_stars' && 'Starlight'}
                {weatherData.condition === 'snow' && 'Snow'}
              </span>
              {weatherData.temperature !== null && (
                <span className="hidden md:inline text-[11px] text-rose-600 font-normal">
                  {weatherData.temperature}°
                </span>
              )}
            </button>

            {/* MusicBoxPlayer Mute/Unmute Quick Toggle */}
            <button
              id="header-music-toggle-btn"
              onClick={() => {
                sound.toggleMusicBox();
              }}
              className={`min-h-[44px] min-w-[44px] px-3 py-2 rounded-full transition-all cursor-pointer flex items-center justify-center gap-1.5 select-none touch-manipulation active:scale-95 ${
                isMusicPlaying
                  ? 'bg-rose-100 hover:bg-rose-200 active:bg-rose-300 text-rose-800 ring-1 ring-rose-300/80 shadow-2xs'
                  : 'bg-stone-100/90 hover:bg-rose-50 active:bg-rose-100 text-stone-600 hover:text-rose-700'
              }`}
              title={
                isMusicPlaying
                  ? `Mute romantic music (Playing: ${currentTrack?.title || 'Romance'})`
                  : 'Play romantic music'
              }
              aria-label={isMusicPlaying ? 'Mute background music' : 'Unmute background music'}
            >
              {isMusicPlaying ? (
                <>
                  <Volume2 className="w-4 h-4 text-rose-600 animate-pulse" />
                  <span className="hidden md:inline text-xs font-medium">Mute</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4 text-stone-500" />
                  <span className="hidden md:inline text-xs font-medium">Unmute</span>
                </>
              )}
            </button>

            {/* Heartbeat Sync Sensor Button */}
            <button
              id="heartbeat-sync-btn"
              onClick={() => {
                sound.playHeartbeat();
                setShowHeartbeat(true);
              }}
              className="min-h-[44px] px-3 sm:px-3.5 py-2.5 rounded-full bg-rose-100 hover:bg-rose-200 active:bg-rose-300/80 active:scale-95 text-rose-800 font-medium text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-1.5 select-none touch-manipulation"
              title="Feel my live heartbeat sync"
            >
              <Activity className="w-4 h-4 text-rose-600 animate-pulse" />
              <span className="hidden md:inline">Heartbeat</span>
            </button>

            {/* Replay Intro */}
            <button
              id="replay-intro-btn"
              onClick={() => {
                sound.playChime('sparkle');
                setShowIntro(true);
              }}
              className="min-h-[44px] min-w-[44px] px-3 sm:px-3.5 py-2.5 rounded-full bg-pink-100 hover:bg-pink-200 active:bg-pink-300/80 active:scale-95 text-rose-700 font-medium text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-1.5 select-none touch-manipulation"
              title="Replay 3D opening heart pop-out"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden md:inline">Intro</span>
            </button>

            {/* Shower Kisses */}
            <button
              id="shower-love-header-btn"
              onClick={handleShowerLove}
              className="min-h-[44px] px-3 sm:px-4 py-2.5 rounded-full bg-rose-500 hover:bg-rose-600 active:bg-rose-700 active:scale-95 text-white font-medium text-xs sm:text-sm shadow-xs hover:shadow transition-all cursor-pointer flex items-center justify-center gap-1.5 select-none touch-manipulation"
              title="Shower the screen with kisses!"
            >
              <Sparkles className="w-4 h-4 shrink-0" />
              <span className="hidden xs:inline">Send Kisses</span>
              <span className="xs:hidden">Kisses</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Slideshow Viewport with Mobile Touch Swiping */}
      <main
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="flex-1 max-w-5xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6 flex flex-col justify-center"
      >
        <AnimatePresence mode="wait">
          {/* SLIDE 0: Passcode Lock (1802) */}
          {currentSlide === 0 && (
            <motion.div
              key="slide-password"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
              className="w-full"
            >
              <PasswordSlide
                partnerName={profile.partnerName}
                isUnlocked={isVaultUnlocked}
                onUnlockSuccess={() => {
                  setIsVaultUnlocked(true);
                  showToast('Vault unlocked! 💖✨');
                }}
                onNext={() => {
                  setCurrentSlide(1);
                }}
                onRelock={() => {
                  setIsVaultUnlocked(false);
                  showToast('Secret vault locked! 🔒');
                }}
              />
            </motion.div>
          )}

          {/* SLIDE 1: Our Time Together */}
          {currentSlide === 1 && (
            <motion.div
              key="slide-time"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
              className="w-full"
            >
              <TimeTogetherSlide
                partnerName={profile.partnerName}
                yourName={profile.yourName}
                anniversaryDate={profile.anniversaryDate}
                onNext={goToNextSlide}
              />
            </motion.div>
          )}

          {/* SLIDE 2: A Beautiful Love Note */}
          {currentSlide === 2 && (
            <motion.div
              key="slide-note"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
              className="w-full"
            >
              <SpecialLoveNoteSlide
                note={specialNote}
                partnerName={profile.partnerName}
                yourName={profile.yourName}
                onUpdateNote={(updated) => {
                  setSpecialNote(updated);
                  showToast('Your custom love note was saved! 💖');
                }}
                onNext={goToNextSlide}
              />
            </motion.div>
          )}

          {/* SLIDE 3: Interactive 3D Crystal Heart Animation */}
          {currentSlide === 3 && (
            <motion.div
              key="slide-3d"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
              className="w-full"
            >
              <div className="flex flex-col items-center">
                <LoveScene3D
                  partnerName={profile.partnerName}
                  onHeartClick={() => {
                    showToast(`You touched my heart, ${profile.partnerName}! ❤️`);
                  }}
                />
                <button
                  onClick={goToNextSlide}
                  className="mt-6 inline-flex items-center gap-2 px-8 py-3 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-semibold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  <span>Explore Our Night Sky</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* SLIDE 4: Starlight Constellation Sky of 1 Jan 2025 */}
          {currentSlide === 4 && (
            <motion.div
              key="slide-sky"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
              className="w-full"
            >
              <StarSkySlide
                partnerName={profile.partnerName}
                anniversaryDate="1 January 2025"
                onNext={goToNextSlide}
              />
            </motion.div>
          )}

          {/* SLIDE 5: Interactive Love Letters */}
          {currentSlide === 5 && (
            <motion.div
              key="slide-letters"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
              className="w-full"
            >
              <div className="flex flex-col items-center">
                <LoveLetters
                  notes={notes}
                  partnerName={profile.partnerName}
                  yourName={profile.yourName}
                  onAddNote={handleAddNote}
                />
                <motion.button
                  onClick={goToNextSlide}
                  animate={
                    isNavPulseActive
                      ? { scale: [1, 1.05, 1], boxShadow: ['0 4px 14px rgba(244,63,94,0.3)', '0 8px 22px rgba(244,63,94,0.55)', '0 4px 14px rgba(244,63,94,0.3)'] }
                      : { scale: 1, boxShadow: '0 4px 14px rgba(244,63,94,0.3)' }
                  }
                  transition={
                    isNavPulseActive
                      ? { duration: 1.9, repeat: Infinity, ease: 'easeInOut' }
                      : { duration: 0.2 }
                  }
                  className="mt-6 inline-flex items-center gap-2 px-8 py-3 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-semibold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  <span>Open Reasons Jar</span>
                  <ChevronRight className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* SLIDE 6: Reasons Why I Love You Jar */}
          {currentSlide === 6 && (
            <motion.div
              key="slide-jar"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
              className="w-full"
            >
              <div className="flex flex-col items-center">
                <ReasonsJar
                  reasons={reasons}
                  partnerName={profile.partnerName}
                  onAddReason={handleAddReason}
                />
                <motion.button
                  onClick={goToNextSlide}
                  animate={
                    isNavPulseActive
                      ? { scale: [1, 1.05, 1], boxShadow: ['0 4px 14px rgba(244,63,94,0.35)', '0 8px 24px rgba(244,63,94,0.6)', '0 4px 14px rgba(244,63,94,0.35)'] }
                      : { scale: 1, boxShadow: '0 4px 14px rgba(244,63,94,0.35)' }
                  }
                  transition={
                    isNavPulseActive
                      ? { duration: 1.9, repeat: Infinity, ease: 'easeInOut' }
                      : { duration: 0.2 }
                  }
                  className="mt-6 inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-600 hover:to-pink-700 text-white font-semibold text-xs shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* SLIDE 7: Grand Finale Ending Page */}
          {currentSlide === 7 && (
            <motion.div
              key="slide-ending"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
              className="w-full"
            >
              <EndingSlide
                partnerName={profile.partnerName}
                yourName={profile.yourName}
                onRestart={() => {
                  sound.playChime('sparkle');
                  setCurrentSlide(1);
                }}
                onOpenHeartbeat={() => setShowHeartbeat(true)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Slideshow Navigation Controller */}
      <div className="sticky bottom-2 sm:bottom-4 z-30 max-w-xl mx-auto w-full px-2 sm:px-4 mt-auto mb-2">
        <nav
          aria-label="Slideshow Navigation"
          className="bg-white/95 backdrop-blur-md rounded-full p-1 sm:px-4 sm:py-2 border border-pink-200 shadow-[0_8px_30px_rgba(255,182,193,0.35)] flex items-center justify-between gap-1 sm:gap-3"
        >
          {/* Previous Button */}
          <motion.button
            id="nav-prev-slide-btn"
            onClick={goToPrevSlide}
            disabled={currentSlide === 0}
            animate={
              isNavPulseActive && currentSlide > 0
                ? {
                    scale: [1, 1.06, 1],
                    boxShadow: [
                      '0 0 0 0px rgba(244, 63, 94, 0)',
                      '0 0 0 4px rgba(244, 63, 94, 0.22)',
                      '0 0 0 0px rgba(244, 63, 94, 0)',
                    ],
                  }
                : { scale: 1, boxShadow: '0 0 0 0px rgba(244, 63, 94, 0)' }
            }
            transition={
              isNavPulseActive && currentSlide > 0
                ? {
                    duration: 1.9,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }
                : { duration: 0.2 }
            }
            className={`relative min-h-[44px] min-w-[40px] px-2.5 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-1 shrink-0 select-none touch-manipulation ${
              currentSlide === 0
                ? 'opacity-30 cursor-not-allowed text-stone-400'
                : 'text-rose-800 hover:bg-pink-100/70 active:bg-pink-200/80 active:scale-95 cursor-pointer'
            }`}
            title={currentSlide === 0 ? 'First slide' : 'Previous Slide'}
            aria-label="Previous Slide"
          >
            {isNavPulseActive && currentSlide > 0 && (
              <motion.span
                className="absolute inset-0 rounded-full border border-rose-400/60 pointer-events-none"
                initial={{ opacity: 0.7, scale: 0.95 }}
                animate={{ opacity: 0, scale: 1.25 }}
                transition={{ duration: 1.9, repeat: Infinity, ease: 'easeOut' }}
              />
            )}
            <ChevronLeft className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            <span className="hidden xs:inline">Prev</span>
          </motion.button>

          {/* Sleek Animated Progress Ribbon */}
          <div className="flex flex-col items-center justify-center px-1 sm:px-3">
            {/* Chapter Label & Indicator */}
            <div className="flex items-center gap-1.5 mb-1 text-[11px] sm:text-xs font-semibold text-rose-800/90 select-none">
              <span className="font-bold text-rose-600">Chapter {currentSlide + 1}</span>
              <span className="text-rose-300">•</span>
              <span className="truncate max-w-[110px] xs:max-w-[150px] sm:max-w-[210px]">
                {slideDefinitions[currentSlide].label}
              </span>
              <span className="text-[10px] text-rose-400 font-normal">
                ({currentSlide + 1}/{totalSlides})
              </span>
            </div>

            {/* Interactive Progress Ribbon Track */}
            <div
              className="relative w-36 xs:w-52 sm:w-72 md:w-80 h-3 sm:h-3.5 bg-rose-100/80 rounded-full border border-pink-200/90 shadow-inner flex items-center p-0.5 cursor-pointer touch-manipulation group"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const ratio = Math.max(0, Math.min(1, clickX / rect.width));
                const targetIndex = Math.round(ratio * (totalSlides - 1));
                if (!isVaultUnlocked && targetIndex > 0) {
                  sound.playBell(260, 0.3, 0.15);
                  showToast('Enter our secret passcode to unlock! 🔐');
                  setCurrentSlide(0);
                  return;
                }
                sound.playChime('pop');
                setCurrentSlide(targetIndex);
              }}
              title={`Jump through chapters (Currently on: ${slideDefinitions[currentSlide].label})`}
            >
              {/* Animated Gradient Fill Ribbon */}
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-rose-400 via-pink-500 to-rose-500 relative shadow-xs"
                initial={false}
                animate={{
                  width: `${Math.max((currentSlide / (totalSlides - 1)) * 100, 6)}%`,
                }}
                transition={{ type: 'spring', stiffness: 280, damping: 28 }}
              >
                {/* Glowing Leading Heart Tip */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-4 h-4 rounded-full bg-white shadow-md flex items-center justify-center border border-rose-300 pointer-events-none">
                  <Heart className="w-2.5 h-2.5 fill-rose-500 text-rose-500" />
                </div>
              </motion.div>

              {/* Step Notch Markers */}
              <div className="absolute inset-0 flex items-center justify-between px-1 pointer-events-none">
                {slideDefinitions.map((_, i) => (
                  <span
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full transition-colors ${
                      i <= currentSlide ? 'bg-white/90' : 'bg-rose-300/40'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Next Button or Replay button if on final slide */}
          {currentSlide === totalSlides - 1 ? (
            <motion.button
              id="nav-replay-slide-btn"
              onClick={() => {
                sound.playChime('sparkle');
                setCurrentSlide(1);
              }}
              animate={
                isNavPulseActive
                  ? {
                      scale: [1, 1.07, 1],
                      boxShadow: [
                        '0 4px 14px rgba(244, 63, 94, 0.35)',
                        '0 8px 24px rgba(244, 63, 94, 0.65)',
                        '0 4px 14px rgba(244, 63, 94, 0.35)',
                      ],
                    }
                  : { scale: 1, boxShadow: '0 4px 14px rgba(244, 63, 94, 0.35)' }
              }
              transition={
                isNavPulseActive
                  ? {
                      duration: 1.9,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }
                  : { duration: 0.2 }
              }
              className="relative min-h-[44px] min-w-[44px] px-3.5 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 active:from-rose-700 active:to-pink-700 text-white shadow-md active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0 select-none touch-manipulation"
              title="Replay our journey from start"
              aria-label="Replay Slideshow"
            >
              {isNavPulseActive && (
                <motion.span
                  className="absolute inset-0 rounded-full bg-rose-400 pointer-events-none"
                  initial={{ opacity: 0.5, scale: 0.95 }}
                  animate={{ opacity: 0, scale: 1.3 }}
                  transition={{ duration: 1.9, repeat: Infinity, ease: 'easeOut' }}
                />
              )}
              <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Replay</span>
            </motion.button>
          ) : (
            <motion.button
              id="nav-next-slide-btn"
              onClick={goToNextSlide}
              animate={
                isNavPulseActive
                  ? {
                      scale: [1, 1.07, 1],
                      boxShadow: [
                        '0 4px 14px rgba(244, 63, 94, 0.35)',
                        '0 8px 24px rgba(244, 63, 94, 0.65)',
                        '0 4px 14px rgba(244, 63, 94, 0.35)',
                      ],
                    }
                  : { scale: 1, boxShadow: '0 4px 14px rgba(244, 63, 94, 0.35)' }
              }
              transition={
                isNavPulseActive
                  ? {
                      duration: 1.9,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }
                  : { duration: 0.2 }
              }
              className="relative min-h-[44px] min-w-[44px] px-3.5 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white shadow-md active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0 select-none touch-manipulation"
              title="Next Slide"
              aria-label="Next Slide"
            >
              {isNavPulseActive && (
                <motion.span
                  className="absolute inset-0 rounded-full bg-rose-400 pointer-events-none"
                  initial={{ opacity: 0.5, scale: 0.95 }}
                  animate={{ opacity: 0, scale: 1.3 }}
                  transition={{ duration: 1.9, repeat: Infinity, ease: 'easeOut' }}
                />
              )}
              <span>Next</span>
              <ChevronRight className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </motion.button>
          )}
        </nav>
      </div>

      {/* Footer */}
      <footer className="border-t border-pink-200/80 py-4 text-center text-xs text-rose-600/80 bg-white/40">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-1 font-medium">
            <span>Made with all my love for</span>
            <span className="text-rose-900 font-semibold">{profile.partnerName}</span>
          </div>
          <p className="text-[11px] text-rose-400">
            Together since {new Date(profile.anniversaryDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} • Use arrow keys or buttons to explore
          </p>
        </div>
      </footer>

      {/* Floating Music Box & Soundscape Player */}
      <MusicBoxPlayer />

      {/* Cute Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
          <div className="px-5 py-2.5 rounded-full bg-rose-900/90 text-white text-xs sm:text-sm font-medium shadow-lg backdrop-blur-md border border-rose-700/50 flex items-center gap-2 animate-bounce">
            <Heart className="w-4 h-4 fill-pink-400 text-pink-400" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
}
