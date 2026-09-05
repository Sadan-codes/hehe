import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CloudRain,
  Sun,
  Sunset,
  Cloud,
  Sparkles,
  Snowflake,
  MapPin,
  RefreshCw,
  X,
  Sliders,
  Volume2,
  VolumeX,
  Check,
} from 'lucide-react';
import {
  WeatherData,
  AtmosphereMode,
  AtmosphereIntensity,
  WEATHER_PRESETS,
  WeatherCondition,
} from '../utils/weather';

interface AtmosphereModalProps {
  isOpen: boolean;
  onClose: () => void;
  weatherData: WeatherData;
  onSetMode: (mode: AtmosphereMode) => void;
  onSetIntensity: (intensity: AtmosphereIntensity) => void;
  onToggleRainAudio: () => void;
  onRefreshLocation: () => void;
}

export const AtmosphereModal: React.FC<AtmosphereModalProps> = ({
  isOpen,
  onClose,
  weatherData,
  onSetMode,
  onSetIntensity,
  onToggleRainAudio,
  onRefreshLocation,
}) => {
  const getConditionIcon = (cond: WeatherCondition) => {
    switch (cond) {
      case 'sunlight':
        return <Sun className="w-5 h-5 text-amber-500" />;
      case 'rain':
        return <CloudRain className="w-5 h-5 text-sky-500" />;
      case 'golden_hour':
        return <Sunset className="w-5 h-5 text-rose-500" />;
      case 'cloudy':
        return <Cloud className="w-5 h-5 text-stone-400" />;
      case 'night_stars':
        return <Sparkles className="w-5 h-5 text-indigo-400" />;
      case 'snow':
        return <Snowflake className="w-5 h-5 text-sky-300" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="relative w-full max-w-lg bg-white/95 backdrop-blur-md rounded-3xl p-5 sm:p-6 shadow-2xl border border-pink-200/90 max-h-[90vh] overflow-y-auto text-stone-800"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-pink-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-500 shadow-2xs">
                  {getConditionIcon(weatherData.condition)}
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-rose-950">
                    Atmospheric Skies & Mood
                  </h3>
                  <p className="text-xs text-rose-700/80">
                    Mirror your real skies or immerse in romantic weather vibes
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
                aria-label="Close atmosphere settings"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Current Status Card */}
            <div className="mt-4 p-3.5 rounded-2xl bg-gradient-to-r from-pink-50/80 via-rose-50/50 to-amber-50/60 border border-pink-200/70 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="p-2 rounded-xl bg-white shadow-2xs shrink-0">
                  {getConditionIcon(weatherData.condition)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 text-xs text-rose-800 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span className="truncate">{weatherData.locationName}</span>
                    {weatherData.temperature !== null && (
                      <span className="px-1.5 py-0.5 rounded-full bg-white text-rose-900 text-[10px] font-semibold">
                        {weatherData.temperature}°C
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-rose-950 mt-0.5 truncate">
                    {weatherData.weatherDescription}
                  </p>
                </div>
              </div>

              <button
                onClick={onRefreshLocation}
                disabled={weatherData.isLoading}
                className="px-2.5 py-1.5 rounded-full bg-white hover:bg-rose-50 active:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-medium flex items-center gap-1 shrink-0 transition-all cursor-pointer shadow-2xs disabled:opacity-50"
                title="Detect location weather again"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${weatherData.isLoading ? 'animate-spin' : ''}`}
                />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>

            {/* Mode Selection */}
            <div className="mt-5">
              <div className="flex items-center justify-between mb-2.5">
                <label className="text-xs font-bold uppercase tracking-wider text-rose-900/70">
                  Choose Sky Atmosphere
                </label>
                {weatherData.isAuto && (
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-semibold">
                    Live Synced
                  </span>
                )}
              </div>

              {/* Auto Button */}
              <button
                onClick={() => onSetMode('auto')}
                className={`w-full mb-2.5 p-3 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                  weatherData.mode === 'auto'
                    ? 'bg-rose-500 text-white border-rose-600 shadow-sm'
                    : 'bg-stone-50 hover:bg-rose-50/50 border-stone-200/80 text-stone-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm ${
                      weatherData.mode === 'auto' ? 'bg-white/20' : 'bg-rose-100 text-rose-700'
                    }`}
                  >
                    ✨
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-bold flex items-center gap-1.5">
                      Auto: Match Our Local Weather
                      {weatherData.mode === 'auto' && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/25">
                          Active
                        </span>
                      )}
                    </div>
                    <div
                      className={`text-[11px] mt-0.5 ${
                        weatherData.mode === 'auto' ? 'text-rose-100' : 'text-stone-500'
                      }`}
                    >
                      Detects real-time local rain, sunlight, or sunset at {weatherData.locationName}
                    </div>
                  </div>
                </div>
                {weatherData.mode === 'auto' && <Check className="w-4 h-4 shrink-0" />}
              </button>

              {/* Presets Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {WEATHER_PRESETS.map((preset) => {
                  const isSelected =
                    weatherData.mode === preset.id ||
                    (weatherData.isAuto && weatherData.condition === preset.id);

                  return (
                    <button
                      key={preset.id}
                      onClick={() => onSetMode(preset.id)}
                      className={`p-2.5 sm:p-3 rounded-xl border text-left transition-all flex items-start justify-between gap-2 cursor-pointer ${
                        weatherData.mode === preset.id
                          ? 'bg-rose-50 border-rose-400 text-rose-950 ring-1 ring-rose-400/40 shadow-xs'
                          : 'bg-white hover:bg-rose-50/40 border-stone-200 text-stone-800'
                      }`}
                    >
                      <div className="flex items-start gap-2.5 min-w-0">
                        <span className="text-xl shrink-0 mt-0.5">{preset.icon}</span>
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-rose-950 flex items-center gap-1 truncate">
                            {preset.name}
                          </div>
                          <p className="text-[11px] text-stone-500 line-clamp-2 mt-0.5 leading-snug">
                            {preset.description}
                          </p>
                        </div>
                      </div>
                      {weatherData.mode === preset.id && (
                        <Check className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Atmosphere Intensity Controls */}
            <div className="mt-5 pt-4 border-t border-pink-100">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-900/70">
                  <Sliders className="w-3.5 h-3.5" />
                  Effect Intensity
                </div>
                <span className="text-xs font-semibold text-rose-800 capitalize">
                  {weatherData.intensity}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-1.5 p-1 rounded-xl bg-stone-100/90 border border-stone-200/80">
                {(['subtle', 'gentle', 'vibrant', 'off'] as AtmosphereIntensity[]).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => onSetIntensity(lvl)}
                    className={`py-1.5 text-xs font-medium rounded-lg transition-all capitalize cursor-pointer ${
                      weatherData.intensity === lvl
                        ? 'bg-white text-rose-900 font-semibold shadow-2xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Rain Audio Option (visible when rain is active) */}
            {weatherData.condition === 'rain' && weatherData.intensity !== 'off' && (
              <div className="mt-4 p-3 rounded-xl bg-sky-50/80 border border-sky-200/80 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {weatherData.ambientRainAudio ? (
                    <Volume2 className="w-4 h-4 text-sky-600 animate-pulse" />
                  ) : (
                    <VolumeX className="w-4 h-4 text-sky-400" />
                  )}
                  <div>
                    <div className="text-xs font-semibold text-sky-950">
                      Soft Raindrop Whisper
                    </div>
                    <div className="text-[11px] text-sky-700">
                      Gentle procedural rain white noise
                    </div>
                  </div>
                </div>

                <button
                  onClick={onToggleRainAudio}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    weatherData.ambientRainAudio
                      ? 'bg-sky-600 text-white shadow-2xs'
                      : 'bg-white text-sky-700 border border-sky-300 hover:bg-sky-100'
                  }`}
                >
                  {weatherData.ambientRainAudio ? 'Sound On' : 'Muted'}
                </button>
              </div>
            )}

            {/* Footer */}
            <div className="mt-5 flex justify-end">
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-full bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white text-xs sm:text-sm font-semibold shadow-sm transition-all cursor-pointer"
              >
                Apply & Enjoy
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
