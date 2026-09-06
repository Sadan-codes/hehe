import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { sound, TrackInfo } from '../utils/audio';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Disc3,
  Sparkles,
  CloudRain,
  Flame,
  Waves,
  VolumeOff,
  Music2,
  Heart,
  X,
  ExternalLink,
} from 'lucide-react';

export const MusicBoxPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(sound.getIsPlaying());
  const [currentTrack, setCurrentTrack] = useState<TrackInfo>(sound.getCurrentTrack());
  const [volume, setVolume] = useState(sound.getVolume());
  const [isExpanded, setIsExpanded] = useState(false);
  const [ambient, setAmbient] = useState<'none' | 'rain' | 'fireplace' | 'waves'>('none');

  useEffect(() => {
    // Keep in sync with audio engine events (e.g. autoplay triggers)
    const unsubscribe = sound.subscribe((playing, track) => {
      setIsPlaying(playing);
      setCurrentTrack(track);
    });
    return unsubscribe;
  }, []);

  const togglePlay = () => {
    sound.toggleMusicBox();
  };

  const handleNextTrack = () => {
    sound.nextTrack();
  };

  const handlePrevTrack = () => {
    sound.prevTrack();
  };

  const handleSelectTrack = (trackId: string) => {
    sound.selectTrack(trackId);
    if (!isPlaying) {
      sound.startMusicBox();
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    sound.setVolume(val);
  };

  const handleAmbientToggle = (type: 'none' | 'rain' | 'fireplace' | 'waves') => {
    const next = ambient === type ? 'none' : type;
    setAmbient(next);
    sound.setAmbientSound(next);
  };

  return (
    <div className="fixed bottom-20 sm:bottom-5 right-2 sm:right-5 z-40">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.94 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="mb-2.5 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 sm:p-4 shadow-[0_12px_40px_rgba(255,105,180,0.3)] border border-pink-200/90 w-80 max-w-[calc(100vw-1.5rem)] max-h-[75vh] overflow-y-auto text-rose-950"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-2.5 border-b border-pink-100">
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center text-rose-500">
                  <Music2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-rose-900 leading-tight">Romantic Serenade</h4>
                  <p className="text-[10px] text-rose-400 font-medium">Recommended Music</p>
                </div>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="w-8 h-8 min-h-[36px] min-w-[36px] rounded-full hover:bg-pink-100 active:bg-pink-200 text-rose-400 hover:text-rose-700 flex items-center justify-center transition-colors cursor-pointer touch-manipulation"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Currently Playing Card */}
            <div className="mt-3 p-3 rounded-2xl bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50/50 border border-pink-100/90 shadow-2xs">
              <div className="flex items-center justify-between gap-2.5">
                <div className="flex items-center gap-2.5 min-w-0 pr-1">
                  <div
                    className={`w-10 h-10 rounded-full bg-gradient-to-tr from-rose-500 to-pink-500 text-white flex items-center justify-center shrink-0 shadow-sm ${
                      isPlaying ? 'animate-spin' : ''
                    }`}
                    style={{ animationDuration: '6s' }}
                  >
                    <Disc3 className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-200/70 text-rose-800 font-bold uppercase tracking-wider">
                        {currentTrack.badge}
                      </span>
                      {currentTrack.movie && (
                        <span className="text-[10px] text-rose-500 font-medium truncate">
                          • {currentTrack.movie}
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-bold text-rose-950 truncate mt-0.5">{currentTrack.title}</p>
                    <p className="text-[11px] text-rose-600 truncate">{currentTrack.artist}</p>
                  </div>
                </div>

                {/* Equalizer Waveform Animation */}
                {isPlaying && (
                  <div className="flex items-end gap-0.5 h-4 shrink-0 px-1">
                    <span className="w-1 bg-rose-400 rounded-full animate-pulse h-4" style={{ animationDuration: '0.6s' }} />
                    <span className="w-1 bg-rose-500 rounded-full animate-pulse h-2" style={{ animationDuration: '0.4s' }} />
                    <span className="w-1 bg-pink-400 rounded-full animate-pulse h-3.5" style={{ animationDuration: '0.8s' }} />
                    <span className="w-1 bg-rose-600 rounded-full animate-pulse h-2.5" style={{ animationDuration: '0.5s' }} />
                  </div>
                )}
              </div>

              {/* Iconic Hit Lyric Highlight Banner */}
              {currentTrack.lyricsSnippet && (
                <div className="mt-2.5 p-2 rounded-xl bg-white/80 border border-rose-200/60 shadow-2xs">
                  <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-rose-500 mb-1">
                    <Sparkles className="w-3 h-3 text-rose-500" />
                    <span>Hit Lyrics</span>
                  </div>
                  <p
                    className="text-xs sm:text-sm font-medium text-rose-900 leading-relaxed italic"
                    style={{ fontFamily: "'Dancing Script', cursive, sans-serif", fontSize: '1.05rem' }}
                  >
                    "{currentTrack.lyricsSnippet}"
                  </p>
                </div>
              )}
            </div>

            {/* Playback Controls */}
            <div className="flex items-center justify-center gap-4 my-3">
              <button
                onClick={handlePrevTrack}
                className="w-11 h-11 min-h-[44px] min-w-[44px] rounded-full bg-pink-100/70 hover:bg-pink-200 active:bg-pink-300 text-rose-700 flex items-center justify-center transition-all cursor-pointer active:scale-95 touch-manipulation"
                title="Previous track"
              >
                <SkipBack className="w-4.5 h-4.5" />
              </button>

              <button
                onClick={togglePlay}
                className="w-12 h-12 min-h-[48px] min-w-[48px] rounded-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 active:from-rose-700 active:to-pink-700 text-white flex items-center justify-center shadow-md active:scale-95 transition-transform cursor-pointer touch-manipulation"
                title={isPlaying ? 'Pause music' : 'Play recommended music'}
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </button>

              <button
                onClick={handleNextTrack}
                className="w-11 h-11 min-h-[44px] min-w-[44px] rounded-full bg-pink-100/70 hover:bg-pink-200 active:bg-pink-300 text-rose-700 flex items-center justify-center transition-all cursor-pointer active:scale-95 touch-manipulation"
                title="Next track"
              >
                <SkipForward className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Direct Studio Track Link on YouTube */}
            {currentTrack.youtubeSearchUrl && (
              <div className="flex justify-center mb-2.5">
                <a
                  href={currentTrack.youtubeSearchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors shadow-2xs cursor-pointer active:scale-95"
                  title="Open original Bollywood studio track on YouTube"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-rose-500" />
                  <span>Listen Studio Version on YouTube</span>
                </a>
              </div>
            )}

            {/* Full Lyrics & Meaning Collapsible Card */}
            {currentTrack.fullLyrics && currentTrack.fullLyrics.length > 0 && (
              <div className="mb-2.5 p-2.5 rounded-xl bg-pink-50/50 border border-pink-100/80">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider flex items-center gap-1">
                    <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> Full Song Lyrics
                  </span>
                  <span className="text-[10px] text-rose-400 font-medium">Romantic Hindi Hits</span>
                </div>

                <div className="space-y-1 text-xs text-rose-950 font-normal leading-relaxed max-h-28 overflow-y-auto pr-1 custom-scrollbar">
                  {currentTrack.fullLyrics.map((line, idx) => (
                    <p key={idx} className="hover:text-rose-600 transition-colors">
                      {line}
                    </p>
                  ))}
                </div>

                {currentTrack.translation && (
                  <div className="mt-2 pt-1.5 border-t border-pink-200/50 text-[11px] text-rose-700/80 italic">
                    <span className="font-semibold text-rose-800 not-italic">Meaning: </span>
                    {currentTrack.translation}
                  </div>
                )}
              </div>
            )}

            {/* Recommended Playlist Drawer */}
            <div className="mt-2 pt-2 border-t border-pink-100">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-rose-400" /> Recommended Songs
                </span>
                <span className="text-[10px] text-rose-400 font-medium">Autoplays for you</span>
              </div>

              <div className="max-h-36 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                {sound.tracks.map((track) => {
                  const isCurrent = track.id === currentTrack.id;
                  return (
                    <button
                      key={track.id}
                      onClick={() => handleSelectTrack(track.id)}
                      className={`w-full min-h-[44px] text-left p-2.5 rounded-xl text-xs flex items-center justify-between transition-all cursor-pointer touch-manipulation ${
                        isCurrent
                          ? 'bg-rose-500 text-white font-medium shadow-xs'
                          : 'hover:bg-pink-50 active:bg-pink-100 text-rose-900'
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold truncate">{track.title}</span>
                        </div>
                        <span className={`text-[10px] truncate block ${isCurrent ? 'text-pink-100' : 'text-rose-500'}`}>
                          {track.artist}
                        </span>
                      </div>

                      <div className="shrink-0 flex items-center gap-1.5">
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${
                            isCurrent
                              ? 'bg-white/20 text-white'
                              : 'bg-rose-100 text-rose-700'
                          }`}
                        >
                          {track.badge}
                        </span>
                        {isCurrent && isPlaying && (
                          <Heart className="w-3 h-3 fill-white text-white animate-pulse shrink-0" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Ambient Sound Layer */}
            <div className="mt-3 pt-2 border-t border-pink-100">
              <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block mb-1.5">
                Ambient Soundscape
              </span>
              <div className="grid grid-cols-4 gap-1.5">
                <button
                  onClick={() => handleAmbientToggle('rain')}
                  className={`min-h-[44px] flex flex-col items-center justify-center py-2 px-1 rounded-xl text-[10px] font-medium transition-all cursor-pointer touch-manipulation ${
                    ambient === 'rain'
                      ? 'bg-blue-100 text-blue-800 font-bold'
                      : 'hover:bg-pink-50 active:bg-pink-100 text-rose-700'
                  }`}
                  title="Soft Gentle Rain"
                >
                  <CloudRain className="w-3.5 h-3.5 mb-0.5 text-blue-500" />
                  <span>Rain</span>
                </button>

                <button
                  onClick={() => handleAmbientToggle('fireplace')}
                  className={`min-h-[44px] flex flex-col items-center justify-center py-2 px-1 rounded-xl text-[10px] font-medium transition-all cursor-pointer touch-manipulation ${
                    ambient === 'fireplace'
                      ? 'bg-amber-100 text-amber-800 font-bold'
                      : 'hover:bg-pink-50 active:bg-pink-100 text-rose-700'
                  }`}
                  title="Cozy Fireplace"
                >
                  <Flame className="w-3.5 h-3.5 mb-0.5 text-amber-500" />
                  <span>Fire</span>
                </button>

                <button
                  onClick={() => handleAmbientToggle('waves')}
                  className={`min-h-[44px] flex flex-col items-center justify-center py-2 px-1 rounded-xl text-[10px] font-medium transition-all cursor-pointer touch-manipulation ${
                    ambient === 'waves'
                      ? 'bg-teal-100 text-teal-800 font-bold'
                      : 'hover:bg-pink-50 active:bg-pink-100 text-rose-700'
                  }`}
                  title="Ocean Waves"
                >
                  <Waves className="w-3.5 h-3.5 mb-0.5 text-teal-500" />
                  <span>Waves</span>
                </button>

                <button
                  onClick={() => handleAmbientToggle('none')}
                  className={`min-h-[44px] flex flex-col items-center justify-center py-2 px-1 rounded-xl text-[10px] font-medium transition-all cursor-pointer touch-manipulation ${
                    ambient === 'none'
                      ? 'bg-rose-100 text-rose-800 font-bold'
                      : 'hover:bg-pink-50 active:bg-pink-100 text-rose-700'
                  }`}
                  title="Mute Ambient"
                >
                  <VolumeOff className="w-3.5 h-3.5 mb-0.5 text-rose-400" />
                  <span>None</span>
                </button>
              </div>
            </div>

            {/* Volume slider */}
            <div className="flex items-center gap-2 mt-3 pt-2 border-t border-pink-100">
              {volume === 0 ? (
                <VolumeX className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              )}
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={handleVolumeChange}
                className="w-full accent-rose-500 h-1 bg-pink-100 rounded-lg cursor-pointer"
                title={`Volume: ${Math.round(volume * 100)}%`}
              />
              <span className="text-[10px] text-rose-400 w-7 text-right font-medium">
                {Math.round(volume * 100)}%
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Pill Toggle */}
      <button
        id="floating-music-btn"
        onClick={() => setIsExpanded(!isExpanded)}
        className="min-h-[44px] flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white/95 hover:bg-white backdrop-blur-md border border-pink-200/90 text-rose-800 font-medium text-xs sm:text-sm shadow-lg hover:shadow-xl transition-all cursor-pointer group active:scale-95 touch-manipulation select-none"
      >
        <div
          className={`text-rose-500 ${
            isPlaying || ambient !== 'none' ? 'animate-spin' : ''
          }`}
          style={{ animationDuration: '4s' }}
        >
          <Disc3 className="w-4 h-4" />
        </div>

        <div className="flex items-center gap-1.5 text-left">
          {isPlaying ? (
            <div className="flex items-center gap-1.5">
              <span className="font-semibold max-w-[130px] sm:max-w-[160px] truncate text-rose-900">
                {currentTrack.title}
              </span>
              <span className="flex items-end gap-0.5 h-3">
                <span className="w-0.5 bg-rose-500 rounded-full animate-pulse h-3" />
                <span className="w-0.5 bg-rose-400 rounded-full animate-pulse h-1.5" />
                <span className="w-0.5 bg-pink-500 rounded-full animate-pulse h-2.5" />
              </span>
            </div>
          ) : (
            <>
              <span className="hidden xs:inline">Recommended Music</span>
              <span className="xs:hidden">Music</span>
            </>
          )}
        </div>

        <span
          className={`w-2 h-2 rounded-full transition-transform ${
            isPlaying ? 'bg-rose-500 animate-ping' : 'bg-pink-300 group-hover:scale-125'
          }`}
        />
      </button>
    </div>
  );
};
