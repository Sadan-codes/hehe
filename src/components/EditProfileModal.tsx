import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CoupleProfile } from '../types';
import { sound } from '../utils/audio';
import { Heart, User, Calendar, X, Sparkles } from 'lucide-react';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: CoupleProfile;
  onSave: (updated: CoupleProfile) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSave,
}) => {
  const [partnerName, setPartnerName] = useState(profile.partnerName);
  const [yourName, setYourName] = useState(profile.yourName);
  const [anniversaryDate, setAnniversaryDate] = useState(profile.anniversaryDate);
  const [nickname, setNickname] = useState(profile.nickname);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...profile,
      partnerName: partnerName.trim() || 'My Love',
      yourName: yourName.trim() || 'Forever Yours',
      anniversaryDate: anniversaryDate || '2025-01-01',
      nickname: nickname.trim() || 'Sweetheart',
    });
    sound.playChime('sparkle');
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-pink-200 shadow-2xl relative"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-pink-100 text-rose-700 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 text-rose-500 mb-2">
            <Heart className="w-5 h-5 fill-rose-500" />
            <span className="text-xs font-bold uppercase tracking-wider">Couple Settings</span>
          </div>

          <h3 className="font-serif font-bold text-2xl text-rose-950 mb-1">
            Personalize Our Story
          </h3>
          <p className="text-xs text-rose-800/75 mb-5">
            Update your names and anniversary date to instantly customize every love note, countdown, and letter.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold text-rose-900 mb-1">
                Her Name / Nickname
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={partnerName}
                  onChange={(e) => setPartnerName(e.target.value)}
                  placeholder="e.g. Aishhh"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-pink-200 text-sm focus:outline-rose-400 bg-pink-50/30"
                />
                <User className="w-4 h-4 text-rose-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-rose-900 mb-1">
                Your Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={yourName}
                  onChange={(e) => setYourName(e.target.value)}
                  placeholder="e.g. Sadan"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-pink-200 text-sm focus:outline-rose-400 bg-pink-50/30"
                />
                <User className="w-4 h-4 text-rose-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-rose-900 mb-1">
                Anniversary / Meeting Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  required
                  value={anniversaryDate}
                  onChange={(e) => setAnniversaryDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-pink-200 text-sm focus:outline-rose-400 bg-pink-50/30"
                />
                <Calendar className="w-4 h-4 text-rose-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-rose-900 mb-1">
                Sweet Nickname for Her
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="e.g. Babygirl, Honey, Sunshine"
                className="w-full px-3 py-2.5 rounded-xl border border-pink-200 text-sm focus:outline-rose-400 bg-pink-50/30"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-rose-800 hover:bg-pink-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white text-xs font-semibold shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Save Couple Profile</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
