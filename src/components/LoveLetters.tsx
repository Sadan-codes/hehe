import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { LoveNote } from '../types';
import { sound } from '../utils/audio';
import { Mail, Heart, Sparkles, X, Clock } from 'lucide-react';

interface LoveLettersProps {
  notes: LoveNote[];
  partnerName: string;
  yourName: string;
  onAddNote?: (newNote: LoveNote) => void;
  onDeleteNote?: (id: string) => void;
}

export const LoveLetters: React.FC<LoveLettersProps> = ({
  notes,
  partnerName,
  yourName,
}) => {
  const [selectedNote, setSelectedNote] = useState<LoveNote | null>(null);
  const [isUnfolded, setIsUnfolded] = useState<boolean>(false);

  const handleOpenNote = (note: LoveNote) => {
    sound.playChime('open');
    setSelectedNote(note);
    setIsUnfolded(false);
    // Allow small seal breaking animation, then unfold
    setTimeout(() => {
      setIsUnfolded(true);
    }, 280);
  };

  const handleCloseNote = () => {
    setIsUnfolded(false);
    setTimeout(() => {
      setSelectedNote(null);
    }, 200);
  };

  return (
    <section id="love-notes-section" className="relative">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-100/90 text-pink-700 text-xs font-semibold mb-2">
            <Mail className="w-3.5 h-3.5" />
            <span>Sealed With Kisses</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-rose-950 tracking-tight">
            Interactive Love Notes
          </h2>
          <p className="text-sm text-rose-700/80 mt-1 max-w-md">
            Click on any envelope to unseal it and unfold a personalized letter written just for {partnerName}.
          </p>
        </div>
      </div>

      {/* Grid of Interactive Envelopes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {notes.map((note) => (
          <motion.div
            key={note.id}
            whileHover={{ y: -4, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleOpenNote(note)}
            className="group cursor-pointer relative bg-white/90 rounded-2xl p-5 border border-pink-100 shadow-[0_4px_20px_rgba(255,182,193,0.18)] hover:shadow-[0_8px_30px_rgba(255,182,193,0.35)] transition-all flex flex-col justify-between overflow-hidden"
          >
            {/* Top envelope flap simulation */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-pink-300 via-rose-400 to-pink-300 opacity-80" />

            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-2xl filter drop-shadow-xs">{note.sticker}</span>
                <span className="text-[11px] font-medium tracking-wide uppercase px-2.5 py-0.5 rounded-full bg-pink-50 text-pink-700 border border-pink-100">
                  {note.category === 'open-when' ? 'Open When...' : 'Sweet Note'}
                </span>
              </div>

              <h3 className="font-semibold text-rose-900 text-base group-hover:text-rose-600 transition-colors line-clamp-1">
                {note.title}
              </h3>
              <p className="text-xs text-rose-700/70 mt-1.5 line-clamp-2 italic">
                "{note.preview}"
              </p>
            </div>

            {/* Envelope bottom preview */}
            <div className="mt-4 pt-3 border-t border-pink-100 flex items-center justify-between text-xs text-rose-500 font-medium">
              <span className="flex items-center gap-1 text-[11px] text-rose-400">
                <Clock className="w-3 h-3" />
                {note.date || 'Forever'}
              </span>
              <span className="inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform text-rose-600">
                Tap to read
                <Heart className="w-3 h-3 fill-rose-400" />
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* MODAL: Active Letter Reading (Interactive Unfolding Envelope) */}
      <AnimatePresence>
        {selectedNote && (
          <div
            id="letter-modal-backdrop"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/45 backdrop-blur-sm"
            onClick={handleCloseNote}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 24, stiffness: 280 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-xl bg-[#FFFDF9] rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#F4E3D7] overflow-hidden"
              style={{
                backgroundImage: `radial-gradient(#F7E7E0 1px, transparent 1px)`,
                backgroundSize: '24px 24px',
              }}
            >
              {/* Close Button */}
              <button
                onClick={handleCloseNote}
                className="absolute top-5 right-5 p-2 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors z-20 cursor-pointer"
                title="Fold up letter"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Envelope Decorative Stamp Header */}
              <div className="flex items-center justify-between mb-4 border-b border-rose-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-rose-500/15 flex items-center justify-center text-xl shadow-inner">
                    {selectedNote.sticker}
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-rose-500 uppercase tracking-wider block">
                      Love Letter to {partnerName}
                    </span>
                    <span className="text-xs text-rose-400">
                      {selectedNote.date || 'Written with all my heart'}
                    </span>
                  </div>
                </div>

                {/* Romantic faux postage stamp */}
                <div className="hidden sm:flex flex-col items-center justify-center w-14 h-16 border-2 border-dashed border-rose-300 rounded bg-rose-50/60 p-1 text-center rotate-3">
                  <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
                  <span className="text-[9px] font-bold text-rose-800 uppercase mt-0.5">Air Mail</span>
                </div>
              </div>

              {/* Letter Title */}
              <h3 className="text-xl sm:text-2xl font-bold text-rose-950 mb-3 tracking-tight">
                {selectedNote.title}
              </h3>

              {/* Letter Content formatted like warm handwritten letter */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: isUnfolded ? 1 : 0, y: isUnfolded ? 0 : 10 }}
                transition={{ duration: 0.4 }}
                className="prose prose-pink max-h-[55vh] overflow-y-auto pr-2 text-rose-900/90 text-base sm:text-lg leading-relaxed whitespace-pre-line font-handwriting"
                style={{ fontFamily: "'Caveat', cursive, sans-serif", fontSize: '1.28rem', lineHeight: '1.6' }}
              >
                {selectedNote.content}
              </motion.div>

              {/* Signature footer */}
              <div className="mt-6 pt-4 border-t border-rose-100/80 flex items-center justify-between text-xs text-rose-600">
                <div className="flex items-center gap-1.5 font-medium">
                  <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                  <span>Forever yours, {yourName}</span>
                </div>
                <button
                  onClick={() => {
                    sound.playChime('sparkle');
                    confetti({ particleCount: 35, spread: 65, origin: { y: 0.5 } });
                  }}
                  className="px-3 py-1.5 rounded-full bg-rose-100/70 hover:bg-rose-200/80 text-rose-700 text-xs font-medium transition-colors inline-flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                  Send Kisses
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
};
