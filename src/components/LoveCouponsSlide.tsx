import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LoveCoupon } from '../types';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Ticket,
  CheckCircle2,
  Lock,
  Gift,
  Film,
  Coffee,
  IceCream,
  ShieldCheck,
  Heart,
  Calendar,
} from 'lucide-react';

interface LoveCouponsSlideProps {
  coupons: LoveCoupon[];
  partnerName: string;
  onRedeemCoupon: (id: string) => void;
  onAddCoupon?: (coupon: Omit<LoveCoupon, 'id' | 'isRedeemed'>) => void;
  onNext?: () => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  IceCream,
  Sparkles,
  Film,
  Coffee,
  ShieldCheck,
  Gift,
  Heart,
};

export const LoveCouponsSlide: React.FC<LoveCouponsSlideProps> = ({
  coupons,
  partnerName,
  onRedeemCoupon,
  onNext,
}) => {
  const [filter, setFilter] = useState<'all' | 'available' | 'redeemed'>('all');

  const filteredCoupons = coupons.filter((c) => {
    if (filter === 'available') return !c.isRedeemed;
    if (filter === 'redeemed') return c.isRedeemed;
    return true;
  });

  const handleRedeem = (c: LoveCoupon) => {
    if (c.isRedeemed) return;
    sound.playChime('sparkle');
    confetti({
      particleCount: 75,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#fda4af', '#f43f5e', '#fb7185', '#fbbf24'],
    });
    onRedeemCoupon(c.id);
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Header Banner */}
      <div className="text-center max-w-xl mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-pink-100 text-rose-700 text-xs font-semibold mb-2">
          <Ticket className="w-3.5 h-3.5" />
          <span>Redeemable Date Night Passes</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-rose-950">
          Exclusive Passes for {partnerName}
        </h2>
        <p className="text-xs sm:text-sm text-rose-800/75 mt-1">
          No expiration dates. Simply tap to redeem anytime you want pampering, an adventure, or an instant win!
        </p>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'bg-white/80 text-rose-800 hover:bg-pink-50'
            }`}
          >
            All Passes ({coupons.length})
          </button>
          <button
            onClick={() => setFilter('available')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
              filter === 'available'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'bg-white/80 text-rose-800 hover:bg-pink-50'
            }`}
          >
            Ready to Redeem ({coupons.filter((c) => !c.isRedeemed).length})
          </button>
          <button
            onClick={() => setFilter('redeemed')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
              filter === 'redeemed'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'bg-white/80 text-rose-800 hover:bg-pink-50'
            }`}
          >
            Redeemed ({coupons.filter((c) => c.isRedeemed).length})
          </button>
        </div>
      </div>

      {/* Coupon Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-4xl">
        {filteredCoupons.map((coupon) => {
          const IconComp = ICON_MAP[coupon.iconName] || Gift;
          return (
            <motion.div
              key={coupon.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              whileHover={{ y: -3 }}
              className={`relative rounded-2xl p-5 border shadow-sm transition-all overflow-hidden flex flex-col justify-between ${
                coupon.isRedeemed
                  ? 'bg-rose-50/60 border-rose-200/80 opacity-75'
                  : 'bg-white/95 border-pink-200 shadow-rose-100 hover:shadow-md'
              }`}
            >
              {/* Decorative side ticket notches */}
              <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#fdf2f4] border border-pink-200/60" />
              <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#fdf2f4] border border-pink-200/60" />

              <div>
                {/* Icon & Status */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${coupon.color} flex items-center justify-center text-white shadow-sm`}
                  >
                    <IconComp className="w-5 h-5" />
                  </div>
                  {coupon.isRedeemed ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/90 px-2.5 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Redeemed
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600 bg-pink-100/70 px-2.5 py-0.5 rounded-full">
                      <Sparkles className="w-3 h-3" />
                      Available
                    </span>
                  )}
                </div>

                <h3 className="font-serif font-bold text-rose-950 text-base mb-1">
                  {coupon.title}
                </h3>
                <p className="text-xs text-rose-900/75 leading-relaxed">
                  {coupon.description}
                </p>
              </div>

              {/* Bottom Action Area */}
              <div className="mt-5 pt-3 border-t border-dashed border-pink-200 flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider text-rose-400 font-bold">
                  {coupon.isRedeemed
                    ? `Claimed on ${coupon.redeemedDate || 'Special Day'}`
                    : 'VIP Pass • 100% Guaranteed'}
                </span>

                {coupon.isRedeemed ? (
                  <div className="rotate-[-6deg] border-2 border-emerald-600 text-emerald-700 text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-widest bg-white shadow-sm">
                    REDEEMED
                  </div>
                ) : (
                  <button
                    onClick={() => handleRedeem(coupon)}
                    className="px-4 py-1.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-semibold text-xs shadow-sm transition-transform active:scale-95 cursor-pointer flex items-center gap-1.5"
                  >
                    <Gift className="w-3.5 h-3.5" />
                    <span>Redeem Now</span>
                  </button>
                )}
              </div>
            </motion.div>
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
    </div>
  );
};
