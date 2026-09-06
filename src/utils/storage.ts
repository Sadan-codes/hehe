import { CoupleProfile, LoveNote, LoveReason, SpecialLoveNote } from '../types';

export const DEFAULT_PROFILE: CoupleProfile = {
  partnerName: 'AISHHH',
  yourName: 'AISHHPAGLUU',
  anniversaryDate: '2025-01-01',
  nickname: 'AISHHH',
  specialSongTitle: 'Melodious Romance'
};

export const DEFAULT_SPECIAL_NOTE: SpecialLoveNote = {
  title: "To My Dearest AISHHH",
  body: `From the very moment we met on 1 January 2025, my whole world shifted into colors I never knew existed.\n\nEvery smile you give me lights up even my darkest days, and every second in your arms feels like coming home. You are my best friend, my safe place, and the most precious person I could ever dream of.\n\nI promise to love you endlessly, through every quiet morning and every starry night. Happy every day with you, my darling AISHHH.`,
  signature: "With all my heart, forever yours, AISHHPAGLUU",
  date: "1 January 2025"
};

export const DEFAULT_LOVE_NOTES: LoveNote[] = [
  {
    id: 'note-1',
    category: 'open-when',
    title: 'Open when you miss me',
    preview: 'Whenever distance feels too far...',
    content: `My sweetest AISHHH,\n\nWhenever you miss me, please close your eyes and place your hand over your heart. Feel that rhythm? That's me, holding you tight from wherever I am.\n\nYou are woven into every thought I have, every song I listen to, and every peaceful moment of my day. If you need me right this second, send me a single heart emoji and I will be there for you immediately.\n\nI love you to the moon and all the way back, AISHHH.`,
    envelopeColor: 'from-rose-400 to-pink-500',
    sticker: '💌',
    date: 'Forever & Always'
  },
  {
    id: 'note-2',
    category: 'open-when',
    title: 'Open when you had a hard day',
    preview: 'Take a soft breath, my darling AISHHH...',
    content: `My sweet AISHHH,\n\nTake a slow, deep breath and let your shoulders drop. Today may have been overwhelming or unkind, but please remember that bad days do not define your incredible worth.\n\nYou handled everything with so much grace, even when it felt heavy. Now it's time to rest. Wrap yourself in the comfiest blanket, let go of the pressure, and remember that AISHHPAGLUU is always in your corner, believing in you unconditionally.\n\nI'm so proud of you, today and every day, my AISHHH.`,
    envelopeColor: 'from-amber-300 to-rose-400',
    sticker: '🧸',
    date: 'For Tough Moments'
  },
  {
    id: 'note-3',
    category: 'open-when',
    title: 'Open when you need a reminder of how gorgeous you are',
    preview: 'Have you seen yourself through my eyes?',
    content: `Dearest AISHHH,\n\nIf you could only borrow my eyes for thirty seconds, you would never doubt your beauty again. \n\nI love your sleepy morning smile, the effortless way you tie your hair up, the cute little expressions you make when you are focused on something, and the pure warmth in your eyes when you laugh. You don't just look breathtaking—your kind soul makes you the most captivating person in the universe.\n\nYou're my dream girl, yesterday, today, and always, AISHHH.`,
    envelopeColor: 'from-purple-400 to-pink-500',
    sticker: '✨',
    date: 'A Gentle Truth'
  },
  {
    id: 'note-4',
    category: 'open-when',
    title: 'Open when you can’t fall asleep',
    preview: 'Let the night hold you softly...',
    content: `My sleepy AISHHH,\n\nIf your mind is racing and sleep feels far away, let this note be a warm lullaby.\n\nYou don't have to solve tomorrow's puzzles right now. The stars are shining softly outside, the world is quiet, and you are safe. Close your eyes and picture us cuddled up together, warm and peaceful, listening to the quiet night.\n\nDream sweet dreams, my love. AISHHPAGLUU will see you in the morning.`,
    envelopeColor: 'from-indigo-400 to-pink-400',
    sticker: '🌙',
    date: 'Midnight Thoughts'
  },
  {
    id: 'note-5',
    category: 'open-when',
    title: 'Open for an instant smile',
    preview: 'A quick reminder of something true...',
    content: `Hey beautiful AISHHH!\n\nJust dropping by to remind you that out of 8 billion people on this planet, meeting you is the best thing that ever happened to me.\n\nAlso, your laugh is literally my favorite sound in the world, your hugs are the ultimate recharge station, and you are stuck with AISHHPAGLUU forever! No refunds, no exchanges! 🥰`,
    envelopeColor: 'from-pink-400 to-rose-400',
    sticker: '💖',
    date: 'Pure Happiness'
  }
];

export const DEFAULT_REASONS: LoveReason[] = [
  { id: '1', text: 'The adorable way your eyes crinkle when you truly laugh from your heart.', emoji: '✨' },
  { id: '2', text: 'How you steal my hoodies and somehow look a million times better in them.', emoji: '🧥' },
  { id: '3', text: 'Your random bursts of singing and cute little dancing around the room.', emoji: '🎵' },
  { id: '4', text: 'The comforting warmth whenever your hand slips into mine.', emoji: '🤝' },
  { id: '5', text: 'How deeply you care about others and your gentle, compassionate heart.', emoji: '🌸' },
  { id: '6', text: 'Your cute pout when things don’t go exactly the way you planned.', emoji: '🥺' },
  { id: '7', text: 'The way you remember tiny details I mentioned weeks ago.', emoji: '💭' },
  { id: '8', text: 'How safe, calm, and completely at home I feel whenever I am with you.', emoji: '🏡' },
  { id: '9', text: 'Your contagious enthusiasm when you talk about things you love.', emoji: '🌟' },
  { id: '10', text: 'The soft way you murmur when you are half-asleep.', emoji: '🌙' },
  { id: '11', text: 'How we can sit in complete silence and it still feels like the best date.', emoji: '☕' },
  { id: '12', text: 'Your incredible smile that instantly brightens even my darkest days.', emoji: '☀️' },
  { id: '13', text: 'How you encourage me to be the best version of myself without ever judging me.', emoji: '🚀' },
  { id: '14', text: 'The sweet little good morning and goodnight texts that start and end my days.', emoji: '📱' },
  { id: '15', text: 'The cute face you make right before you try to act serious.', emoji: '🤭' },
  { id: '16', text: 'Because you are my best friend and the love of my life, all in one.', emoji: '💍' },
  { id: '17', text: 'The way you scold me lovingly when I don’t drink enough water or sleep on time.', emoji: '💧' },
  { id: '18', text: 'How everything tastes better and is more fun when I share it with you.', emoji: '🍰' },
  { id: '19', text: 'The unconditional kindness you show to animals and people around you.', emoji: '🐾' },
  { id: '20', text: 'Simply because loving you is the easiest and most natural thing in the world.', emoji: '❤️' }
];

export const DEFAULT_COUPONS: import('../types').LoveCoupon[] = [
  {
    id: 'c1',
    title: 'Late Night Ice Cream & Drive',
    description: 'Valid for a spontaneous late night trip for your favorite ice cream, windows rolled down, and your favorite songs on repeat.',
    iconName: 'IceCream',
    color: 'from-amber-400 to-rose-400',
    isRedeemed: false,
  },
  {
    id: 'c2',
    title: 'Full Pamper & Relaxing Massage',
    description: 'A 30-minute stress-relieving shoulder and foot massage with warm lavender oils, gentle music, and zero interruptions.',
    iconName: 'Sparkles',
    color: 'from-pink-400 to-purple-400',
    isRedeemed: false,
  },
  {
    id: 'c3',
    title: 'Movie Night Dictator',
    description: 'You pick the movie, you choose all the snacks, and I promise not to complain once—even if it is a 3-hour drama!',
    iconName: 'Film',
    color: 'from-rose-400 to-pink-500',
    isRedeemed: false,
  },
  {
    id: 'c4',
    title: 'Breakfast in Bed Deluxe',
    description: 'Wake up whenever you want. Fresh warm pancakes, fruit slices, and your favorite warm drink delivered to your bedside with love.',
    iconName: 'Coffee',
    color: 'from-amber-300 to-orange-400',
    isRedeemed: false,
  },
  {
    id: 'c5',
    title: 'Win Any Argument Pass',
    description: 'Play this card during any debate, and you immediately win 100%. I will concede and admit you were right all along!',
    iconName: 'ShieldCheck',
    color: 'from-emerald-400 to-teal-500',
    isRedeemed: false,
  },
  {
    id: 'c6',
    title: 'Golden Wildcard Wish',
    description: 'One unconditional wish granted by me. Big or small, romantic or silly—whatever your heart desires!',
    iconName: 'Gift',
    color: 'from-amber-400 to-yellow-500',
    isRedeemed: false,
  }
];

export const DEFAULT_MEMORIES: import('../types').MemoryMoment[] = [
  {
    id: 'm1',
    title: 'The Day Our World Changed',
    date: '1 January 2025',
    location: 'Where it all started',
    caption: 'The unforgettable moment our paths crossed and my whole world started making sense.',
    imageUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=800&auto=format&fit=crop',
    rotation: -2,
    likes: 24,
    backNote: 'I remember thinking to myself that day: I need to know everything about this incredible person.',
    sticker: '✨',
  },
  {
    id: 'm2',
    title: 'Our Cozy Warm Coffee Date',
    date: 'A chilly afternoon',
    location: 'Our favorite cozy corner',
    caption: 'Hours flew by like minutes. We laughed so much our cheeks hurt.',
    imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800&auto=format&fit=crop',
    rotation: 3,
    likes: 42,
    backNote: 'You took a sip, looked up at me with that gentle smile, and my heart did a somersault.',
    sticker: '☕',
  },
  {
    id: 'm3',
    title: 'Walking Hand-in-Hand',
    date: 'Golden hour sunset',
    location: 'Under the pink evening sky',
    caption: 'My hand feels like it was custom-sculpted specifically to fit into yours.',
    imageUrl: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=800&auto=format&fit=crop',
    rotation: -3,
    likes: 38,
    backNote: 'I never want to let go. Every step next to you is my favorite walk.',
    sticker: '💖',
  },
  {
    id: 'm4',
    title: 'Under A Million Stars',
    date: 'Midnight stargazing',
    location: 'Wrapped in blankets',
    caption: 'The whole sky was glowing, but I was busy looking at the most beautiful star in front of me.',
    imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop',
    rotation: 1,
    likes: 56,
    backNote: 'We wished upon shooting stars, and I silently thanked the universe that you were mine.',
    sticker: '🌙',
  }
];

export function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

export function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // quota exceeded or disabled
  }
}
