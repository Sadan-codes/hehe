import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MemoryMoment } from '../types';
import { sound } from '../utils/audio';
import {
  Camera,
  Heart,
  Calendar,
  MapPin,
  Sparkles,
  X,
  RotateCw,
  Maximize2,
} from 'lucide-react';

interface MemoryWallSlideProps {
  memories: MemoryMoment[];
  partnerName: string;
  onAddMemory?: (memory: Omit<MemoryMoment, 'id'>) => void;
  onLikeMemory: (id: string) => void;
  onNext?: () => void;
}

export const MemoryWallSlide: React.FC<MemoryWallSlideProps> = ({
  memories,
  partnerName,
  onLikeMemory,
  onNext,
}) => {
  const [flippedCardId, setFlippedCardId] = useState<string | null>(null);
  const [lightboxMemory, setLightboxMemory] = useState<MemoryMoment | null>(null);

  const toggleFlip = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playChime('pop');
    setFlippedCardId((prev) => (prev === id ? null : id));
  };

  const handleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playChime('pop');
    onLikeMemory(id);
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Header */}
      <div className="text-center max-w-xl mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-pink-100 text-rose-700 text-xs font-semibold mb-2">
          <Camera className="w-3.5 h-3.5" />
          <span>Our Memory Scrapbook</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-rose-950">
          Moments Frozen in Love
        </h2>
        <p className="text-xs sm:text-sm text-rose-800/75 mt-1">
          Every photo holds a secret heartbeat. Click the flip button on any Polaroid to read what I wrote on the back!
        </p>
      </div>

      {/* Polaroid Gallery */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-5xl px-2">
        {memories.map((mem) => {
          const isFlipped = flippedCardId === mem.id;
          return (
            <div
              key={mem.id}
              className="relative perspective-1000 group cursor-pointer"
              style={{
                transform: `rotate(${mem.rotation || 0}deg)`,
              }}
              onClick={() => setLightboxMemory(mem)}
            >
              {/* Washi tape decoration */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-14 h-5 bg-rose-200/80 backdrop-blur-xs border-y border-white/50 shadow-xs z-10 rotate-[-2deg] pointer-events-none" />

              {/* Card Container with 3D Flip */}
              <motion.div
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                className="relative w-full aspect-[3/4.2] rounded-xl bg-white p-3 pb-5 shadow-md hover:shadow-xl border border-pink-100/80 transition-shadow duration-300 preserve-3d"
              >
                {/* FRONT FACE */}
                <div
                  className={`absolute inset-0 p-3 pb-5 flex flex-col justify-between backface-hidden ${
                    isFlipped ? 'pointer-events-none' : ''
                  }`}
                >
                  {/* Photo area */}
                  <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-rose-50 border border-pink-100 shadow-inner group">
                    <img
                      src={mem.imageUrl}
                      alt={mem.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Cute sticker badge */}
                    {mem.sticker && (
                      <div className="absolute top-2 right-2 text-xl drop-shadow-md">
                        {mem.sticker}
                      </div>
                    )}
                    {/* Expand button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setLightboxMemory(mem);
                      }}
                      className="absolute bottom-2 right-2 p-1.5 rounded-full bg-black/40 text-white hover:bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Enlarge Photo"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Caption & Details */}
                  <div className="mt-3 px-1">
                    <h3 className="font-serif font-bold text-rose-950 text-sm truncate">
                      {mem.title}
                    </h3>
                    <div className="flex items-center gap-2 text-[10px] text-rose-500 mt-0.5">
                      <span className="inline-flex items-center gap-0.5">
                        <Calendar className="w-2.5 h-2.5" />
                        {mem.date}
                      </span>
                      {mem.location && (
                        <span className="inline-flex items-center gap-0.5 truncate">
                          <MapPin className="w-2.5 h-2.5" />
                          {mem.location}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-rose-900/80 mt-1 line-clamp-2 italic font-serif">
                      "{mem.caption}"
                    </p>
                  </div>

                  {/* Action Bar */}
                  <div className="mt-2 pt-2 border-t border-pink-100 flex items-center justify-between">
                    <button
                      onClick={(e) => handleLike(mem.id, e)}
                      className="flex items-center gap-1 text-xs text-rose-500 hover:text-rose-700 font-semibold cursor-pointer"
                    >
                      <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                      <span>{mem.likes || 0}</span>
                    </button>

                    <button
                      onClick={(e) => toggleFlip(mem.id, e)}
                      className="flex items-center gap-1 text-[11px] text-rose-600 hover:text-rose-800 font-medium px-2 py-0.5 rounded-full bg-pink-50 hover:bg-pink-100 cursor-pointer"
                    >
                      <RotateCw className="w-3 h-3" />
                      <span>Read Back</span>
                    </button>
                  </div>
                </div>

                {/* BACK FACE (Handwritten Secret Note) */}
                <div
                  className="absolute inset-0 p-5 rounded-xl bg-amber-50/90 border border-amber-200 flex flex-col justify-between backface-hidden rotate-y-180 shadow-inner"
                  style={{
                    backgroundImage:
                      'radial-gradient(#e5e7eb 1px, transparent 1px)',
                    backgroundSize: '16px 16px',
                  }}
                >
                  <div>
                    <div className="flex items-center justify-between border-b border-amber-200/80 pb-2 mb-3">
                      <span className="text-[11px] font-mono text-amber-800/80 uppercase tracking-wider">
                        Secret Note
                      </span>
                      <span className="text-base">{mem.sticker || '💌'}</span>
                    </div>

                    <p className="text-xs sm:text-sm font-serif text-amber-950 leading-relaxed italic whitespace-pre-wrap">
                      {mem.backNote ||
                        'I loved this day more than words could ever describe. Thank you for making every ordinary day feel like magic.'}
                    </p>
                  </div>

                  <div className="border-t border-amber-200/80 pt-2 flex items-center justify-between">
                    <span className="text-[10px] text-amber-800/60 font-serif">
                      Forever with {partnerName}
                    </span>
                    <button
                      onClick={(e) => toggleFlip(mem.id, e)}
                      className="flex items-center gap-1 text-[11px] text-amber-900 font-semibold px-2 py-0.5 rounded-full bg-amber-100 hover:bg-amber-200 cursor-pointer"
                    >
                      <RotateCw className="w-3 h-3" />
                      <span>Back to Photo</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* Next slide button */}
      {onNext && (
        <button
          onClick={onNext}
          className="mt-8 inline-flex items-center gap-2 px-8 py-3 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-semibold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
        >
          <span>Next</span>
          <Sparkles className="w-4 h-4" />
        </button>
      )}

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxMemory && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setLightboxMemory(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-4 sm:p-6 max-w-2xl w-full border border-pink-200 shadow-2xl relative"
            >
              <button
                onClick={() => setLightboxMemory(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-pink-100 hover:bg-pink-200 text-rose-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="rounded-2xl overflow-hidden max-h-[60vh] bg-black/5 flex items-center justify-center">
                <img
                  src={lightboxMemory.imageUrl}
                  alt={lightboxMemory.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain max-h-[55vh]"
                />
              </div>

              <div className="mt-4">
                <h3 className="font-serif font-bold text-xl text-rose-950">
                  {lightboxMemory.title}
                </h3>
                <p className="text-xs text-rose-500 mt-0.5">
                  {lightboxMemory.date} • {lightboxMemory.location}
                </p>
                <p className="text-sm text-rose-900/80 mt-2 font-serif italic">
                  "{lightboxMemory.caption}"
                </p>
                {lightboxMemory.backNote && (
                  <div className="mt-3 p-3 rounded-xl bg-pink-50/80 border border-pink-100 text-xs text-rose-800">
                    <span className="font-bold block mb-1">Secret Back Note:</span>
                    {lightboxMemory.backNote}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
