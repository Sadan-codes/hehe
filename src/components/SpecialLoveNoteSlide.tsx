import React from 'react';
import { SpecialLoveNote } from '../types';
import { Heart, ArrowRight, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';

interface SpecialLoveNoteSlideProps {
  note: SpecialLoveNote;
  partnerName: string;
  yourName: string;
  onUpdateNote?: (updated: SpecialLoveNote) => void;
  onNext: () => void;
}

export const SpecialLoveNoteSlide: React.FC<SpecialLoveNoteSlideProps> = ({
  note,
  partnerName,
  yourName: _yourName,
  onNext,
}) => {
  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center justify-center py-6 px-4">
      {/* Eyebrow badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-100/90 border border-rose-200 text-rose-700 text-xs sm:text-sm font-semibold mb-4 shadow-xs">
        <Sparkles className="w-4 h-4 text-rose-500" />
        <span>A Special Letter Written Just For You</span>
      </div>

      <h2
        className="text-4xl sm:text-6xl font-bold text-rose-950 tracking-tight mb-2 text-center"
        style={{ fontFamily: "'Dancing Script', cursive" }}
      >
        A Note From My Heart
      </h2>

      <p className="text-xs sm:text-sm text-rose-800/70 mb-6 text-center max-w-md">
        Every word here was penned with all the love and admiration I hold for you.
      </p>

      {/* Parchment Love Letter Card */}
      <div className="relative w-full bg-[#FFFDF9] rounded-3xl p-6 sm:p-10 border border-amber-200/90 shadow-xl overflow-hidden mb-8">
        {/* Decorative corner ribbons & vintage paper texture borders */}
        <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-rose-300/60 rounded-tl-3xl pointer-events-none m-3" />
        <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-rose-300/60 rounded-br-3xl pointer-events-none m-3" />

        {/* Wax seal watermark */}
        <div className="absolute top-6 right-6 w-12 h-12 rounded-full bg-rose-500/10 border border-rose-300/40 flex items-center justify-center text-rose-400 rotate-12 pointer-events-none">
          <Heart className="w-6 h-6 fill-rose-400" />
        </div>

        {/* Letter Content */}
        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          {/* Letter Title */}
          <div className="border-b border-amber-200/80 pb-4">
            <h3
              className="text-2xl sm:text-4xl font-bold text-rose-900 tracking-wide"
              style={{ fontFamily: "'Caveat', cursive" }}
            >
              {note.title}
            </h3>
            <span className="text-xs text-rose-800/60 font-medium">
              Meeting Date: {note.date || '1 January 2025'}
            </span>
          </div>

          {/* Body */}
          <div
            className="text-lg sm:text-2xl text-[#4A323B] leading-relaxed whitespace-pre-line tracking-wide font-normal"
            style={{ fontFamily: "'Caveat', cursive" }}
          >
            {note.body}
          </div>

          {/* Signature */}
          <div className="pt-6 border-t border-amber-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p
                className="text-xl sm:text-2xl font-bold text-rose-900"
                style={{ fontFamily: "'Dancing Script', cursive" }}
              >
                {note.signature}
              </p>
              <p className="text-xs text-rose-700/60 font-sans mt-0.5">
                For {partnerName}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation to Next Slide */}
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
