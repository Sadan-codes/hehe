import React, { useState } from 'react';
import { SpecialLoveNote } from '../types';
import { Heart, ArrowRight, Sparkles, Edit3, X, Check } from 'lucide-react';
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
  yourName,
  onUpdateNote,
  onNext,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(note.title);
  const [editBody, setEditBody] = useState(note.body);
  const [editSignature, setEditSignature] = useState(note.signature);
  const [editDate, setEditDate] = useState(note.date || '1 January 2025');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateNote) {
      onUpdateNote({
        title: editTitle.trim() || `To My Dearest ${partnerName}`,
        body: editBody.trim(),
        signature: editSignature.trim() || `Forever yours, ${yourName}`,
        date: editDate.trim() || '1 January 2025',
      });
    }
    sound.playChime('sparkle');
    setIsEditing(false);
  };

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

        {/* Wax seal & Edit Button */}
        <div className="absolute top-5 right-5 flex items-center gap-2 z-20">
          {onUpdateNote && (
            <button
              onClick={() => {
                setEditTitle(note.title);
                setEditBody(note.body);
                setEditSignature(note.signature);
                setEditDate(note.date || '1 January 2025');
                setIsEditing(true);
              }}
              className="px-3 py-1.5 rounded-full bg-amber-100/80 hover:bg-amber-200 active:bg-amber-300 text-amber-900 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs border border-amber-300/60 cursor-pointer"
              title="Customize or edit this love letter"
            >
              <Edit3 className="w-3.5 h-3.5 text-amber-700" />
              <span>Edit Letter</span>
            </button>
          )}

          <div className="w-10 h-10 rounded-full bg-rose-500/10 border border-rose-300/40 hidden sm:flex items-center justify-center text-rose-400 rotate-12 pointer-events-none">
            <Heart className="w-5 h-5 fill-rose-400" />
          </div>
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

      {/* Edit Letter Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-pink-200 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsEditing(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-pink-100 text-rose-700 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 text-rose-500 mb-2">
              <Heart className="w-5 h-5 fill-rose-500" />
              <span className="text-xs font-bold uppercase tracking-wider">Customize Love Letter</span>
            </div>

            <h3 className="font-serif font-bold text-2xl text-rose-950 mb-1">
              Edit Your Heartfelt Note
            </h3>
            <p className="text-xs text-rose-800/75 mb-4">
              Write your own personalized words for {partnerName}. Changes save instantly to your browser!
            </p>

            <form onSubmit={handleSave} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-semibold text-rose-900 mb-1">
                  Letter Heading
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-pink-200 text-sm focus:outline-rose-400 bg-pink-50/30"
                  placeholder="e.g. To My Dearest Aishhh"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-rose-900 mb-1">
                  Meeting / Anniversary Date
                </label>
                <input
                  type="text"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-pink-200 text-sm focus:outline-rose-400 bg-pink-50/30"
                  placeholder="e.g. 1 January 2025"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-rose-900 mb-1">
                  Letter Body Message
                </label>
                <textarea
                  rows={6}
                  required
                  value={editBody}
                  onChange={(e) => setEditBody(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-pink-200 text-sm focus:outline-rose-400 bg-pink-50/30 leading-relaxed font-sans"
                  placeholder="Write your beautiful message here..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-rose-900 mb-1">
                  Signature
                </label>
                <input
                  type="text"
                  required
                  value={editSignature}
                  onChange={(e) => setEditSignature(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-pink-200 text-sm focus:outline-rose-400 bg-pink-50/30"
                  placeholder={`e.g. Forever yours, ${yourName}`}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-rose-800 hover:bg-pink-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-rose-500 hover:bg-rose-600 text-white shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  Save Letter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
