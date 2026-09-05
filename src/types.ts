export interface LoveNote {
  id: string;
  category: 'open-when' | 'daily' | 'special';
  title: string;
  preview: string;
  content: string;
  envelopeColor: string;
  sticker: string;
  date?: string;
  isCustom?: boolean;
}

export interface LoveReason {
  id: string;
  text: string;
  emoji: string;
  category?: 'sweet' | 'funny' | 'deep' | 'cute';
}

export interface MemoryMoment {
  id: string;
  title: string;
  date: string;
  location?: string;
  caption: string;
  imageUrl: string;
  rotation?: number;
  likes?: number;
  backNote?: string;
  sticker?: string;
}

export interface LoveCoupon {
  id: string;
  title: string;
  description: string;
  iconName: string;
  color: string;
  isRedeemed: boolean;
  redeemedDate?: string;
}

export interface CoupleProfile {
  partnerName: string;
  yourName: string;
  anniversaryDate: string; // YYYY-MM-DD
  nickname: string;
  specialSongTitle: string;
}

export interface SpecialLoveNote {
  title: string;
  body: string;
  signature: string;
  date: string;
}
