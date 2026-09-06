// Real Romantic Audio Engine with Authentic Hindi Bollywood Melody Sequencer & UI Sound Effects

export interface TrackInfo {
  id: string;
  title: string;
  movie?: string;
  artist: string;
  badge: string;
  audioUrl?: string;
  youtubeSearchUrl: string;
  duration?: string;
  lyricsSnippet: string;
  fullLyrics: string[];
  translation?: string;
}

interface MelodyStep {
  t: number; // time in beats
  notes: string[]; // melody note names, e.g. ['D4']
  dur: number; // duration in beats
  bass?: string; // bass root note, e.g. 'D3'
  vel?: number; // velocity 0.1 to 1.0
}

interface MelodyScore {
  bpm: number;
  totalBeats: number;
  steps: MelodyStep[];
}

// Complete Musical Note Frequencies (Hz)
const NOTE_FREQS: Record<string, number> = {
  // Octave 2
  E2: 82.41,
  F2: 87.31,
  'F#2': 92.50,
  G2: 98.00,
  'G#2': 103.83,
  A2: 110.00,
  'A#2': 116.54,
  B2: 123.47,
  // Octave 3
  C3: 130.81,
  'C#3': 138.59,
  D3: 146.83,
  'D#3': 155.56,
  E3: 164.81,
  F3: 174.61,
  'F#3': 184.99,
  G3: 196.00,
  'G#3': 207.65,
  A3: 220.00,
  'A#3': 233.08,
  B3: 246.94,
  // Octave 4
  C4: 261.63,
  'C#4': 277.18,
  D4: 293.66,
  'D#4': 311.13,
  E4: 329.63,
  F4: 349.23,
  'F#4': 369.99,
  G4: 392.00,
  'G#4': 415.30,
  A4: 440.00,
  'A#4': 466.16,
  B4: 493.88,
  // Octave 5
  C5: 523.25,
  'C#5': 554.37,
  D5: 587.33,
  'D#5': 622.25,
  E5: 659.25,
  F5: 698.46,
  'F#5': 739.99,
  G5: 783.99,
  'G#5': 830.61,
  A5: 880.00,
  'A#5': 932.33,
  B5: 987.77,
  // Octave 6
  C6: 1046.50,
  D6: 1174.66,
  E6: 1318.51,
};

// 1. Kesariya (Brahmāstra) - Arijit Singh
// Iconic chorus melody: "Kesariya tera ishq hai piya, rang jaaun jo main haath lagaun..."
const KESARIYA_SCORE: MelodyScore = {
  bpm: 96,
  totalBeats: 32,
  steps: [
    // "Mujhko itna bataaye koi..." / "Kesariya..."
    { t: 0, notes: ['D4'], dur: 0.5, bass: 'D3' },
    { t: 0.5, notes: ['E4'], dur: 0.5 },
    { t: 1.0, notes: ['F#4'], dur: 0.75 },
    { t: 1.75, notes: ['A4'], dur: 0.75 },
    { t: 2.5, notes: ['B4'], dur: 1.5, bass: 'B2' },

    // "...tera ishq hai piya..."
    { t: 4.0, notes: ['A4'], dur: 0.5, bass: 'G2' },
    { t: 4.5, notes: ['F#4'], dur: 0.5 },
    { t: 5.0, notes: ['E4'], dur: 0.5 },
    { t: 5.5, notes: ['D4'], dur: 0.75, bass: 'A2' },
    { t: 6.25, notes: ['E4'], dur: 1.5 },

    // "...rang jaaun jo main haath lagaun..."
    { t: 8.0, notes: ['D4'], dur: 0.5, bass: 'D3' },
    { t: 8.5, notes: ['E4'], dur: 0.5 },
    { t: 9.0, notes: ['F#4'], dur: 0.5 },
    { t: 9.5, notes: ['A4'], dur: 0.5 },
    { t: 10.0, notes: ['B4'], dur: 1.25, bass: 'B2' },
    { t: 11.25, notes: ['A4'], dur: 0.5 },
    { t: 11.75, notes: ['F#4'], dur: 0.5, bass: 'G2' },
    { t: 12.25, notes: ['E4'], dur: 0.5 },
    { t: 12.75, notes: ['D4'], dur: 0.75, bass: 'A2' },
    { t: 13.5, notes: ['E4'], dur: 2.0 },

    // "Din beete saara teri fikr mein..."
    { t: 16.0, notes: ['F#4'], dur: 0.5, bass: 'D3' },
    { t: 16.5, notes: ['G4'], dur: 0.5 },
    { t: 17.0, notes: ['A4'], dur: 0.75 },
    { t: 17.75, notes: ['A4'], dur: 0.5, bass: 'F#2' },
    { t: 18.25, notes: ['B4'], dur: 0.5 },
    { t: 18.75, notes: ['A4'], dur: 0.5 },
    { t: 19.25, notes: ['G4'], dur: 0.5, bass: 'G2' },
    { t: 19.75, notes: ['F#4'], dur: 1.25 },

    // "Rain saari teri khair manaun..."
    { t: 21.5, notes: ['E4'], dur: 0.5, bass: 'A2' },
    { t: 22.0, notes: ['F#4'], dur: 0.5 },
    { t: 22.5, notes: ['G4'], dur: 0.75 },
    { t: 23.25, notes: ['F#4'], dur: 0.5 },
    { t: 23.75, notes: ['E4'], dur: 0.5, bass: 'D3' },
    { t: 24.25, notes: ['D4'], dur: 2.5 },

    // Romantic acoustic arpeggio outro
    { t: 27.5, notes: ['F#4', 'A4'], dur: 0.75, bass: 'A2' },
    { t: 28.5, notes: ['E4', 'G4'], dur: 0.75 },
    { t: 29.5, notes: ['D4', 'F#4'], dur: 1.5, bass: 'D3' },
  ],
};

// 2. Tum Hi Ho (Aashiqui 2) - Arijit Singh
// Iconic Aashiqui 2 Piano Intro & Chorus: "Kyunki tum hi ho, ab tum hi ho, zindagi ab tum hi ho..."
const TUM_HI_HO_SCORE: MelodyScore = {
  bpm: 82,
  totalBeats: 32,
  steps: [
    // Iconic Piano arpeggio intro
    { t: 0, notes: ['C#4', 'G#4'], dur: 0.5, bass: 'C#3' },
    { t: 0.5, notes: ['E4'], dur: 0.5 },
    { t: 1.0, notes: ['G#4'], dur: 0.5 },
    { t: 1.5, notes: ['C#5'], dur: 0.75 },

    { t: 2.0, notes: ['D4', 'A4'], dur: 0.5, bass: 'D3' },
    { t: 2.5, notes: ['F#4'], dur: 0.5 },
    { t: 3.0, notes: ['A4'], dur: 0.5 },
    { t: 3.5, notes: ['D5'], dur: 0.75 },

    // "Hum tere bin ab reh nahi sakte..."
    { t: 4.0, notes: ['C#4'], dur: 0.5, bass: 'F#2' },
    { t: 4.5, notes: ['D4'], dur: 0.5 },
    { t: 5.0, notes: ['E4'], dur: 0.75 },
    { t: 5.75, notes: ['E4'], dur: 0.5 },
    { t: 6.25, notes: ['E4'], dur: 0.5, bass: 'D3' },
    { t: 6.75, notes: ['D4'], dur: 0.5 },
    { t: 7.25, notes: ['C#4'], dur: 0.5 },
    { t: 7.75, notes: ['B3'], dur: 0.5, bass: 'E2' },
    { t: 8.25, notes: ['C#4'], dur: 1.5 },

    // "Kyunki tum hi ho..."
    { t: 10.5, notes: ['C#4'], dur: 0.5, bass: 'F#2' },
    { t: 11.0, notes: ['E4'], dur: 0.5 },
    { t: 11.5, notes: ['G#4'], dur: 1.25, bass: 'C#3' },
    { t: 12.75, notes: ['F#4'], dur: 0.5 },
    { t: 13.25, notes: ['E4'], dur: 1.25 },

    // "Ab tum hi ho..."
    { t: 14.75, notes: ['D4'], dur: 0.5, bass: 'D3' },
    { t: 15.25, notes: ['F#4'], dur: 0.5 },
    { t: 15.75, notes: ['A4'], dur: 1.25, bass: 'E2' },
    { t: 17.0, notes: ['G#4'], dur: 0.5 },
    { t: 17.5, notes: ['F#4'], dur: 0.5 },
    { t: 18.0, notes: ['E4'], dur: 1.0 },

    // "Zindagi ab tum hi ho..."
    { t: 19.5, notes: ['C#4'], dur: 0.5, bass: 'F#2' },
    { t: 20.0, notes: ['E4'], dur: 0.5 },
    { t: 20.5, notes: ['G#4'], dur: 1.0, bass: 'C#3' },
    { t: 21.5, notes: ['F#4'], dur: 0.5 },
    { t: 22.0, notes: ['E4'], dur: 0.5 },
    { t: 22.5, notes: ['D4'], dur: 0.5, bass: 'B2' },
    { t: 23.0, notes: ['C#4'], dur: 1.5 },

    // "Meri aashiqui ab tum hi ho..."
    { t: 25.0, notes: ['A3', 'C#4'], dur: 0.5, bass: 'A2' },
    { t: 25.5, notes: ['E4'], dur: 0.5 },
    { t: 26.0, notes: ['D4'], dur: 0.5, bass: 'E2' },
    { t: 26.5, notes: ['B3'], dur: 0.5 },
    { t: 27.0, notes: ['C#4'], dur: 2.5, bass: 'F#2' },
  ],
};

// 3. Raataan Lambiyan (Shershaah) - Jubin Nautiyal & Asees Kaur
// Iconic chorus: "Raatan lambiyan lambiyan re, kate tere sangeyan sangeyan re..."
const RAATAAN_LAMBIYAN_SCORE: MelodyScore = {
  bpm: 90,
  totalBeats: 32,
  steps: [
    // "Kahe main tenu samjhawan..."
    { t: 0, notes: ['F#4'], dur: 0.5, bass: 'D3' },
    { t: 0.5, notes: ['A4'], dur: 0.5 },
    { t: 1.0, notes: ['B4'], dur: 0.75, bass: 'G2' },
    { t: 1.75, notes: ['A4'], dur: 0.5 },
    { t: 2.25, notes: ['F#4'], dur: 0.5, bass: 'A2' },
    { t: 2.75, notes: ['E4'], dur: 0.5 },
    { t: 3.25, notes: ['D4'], dur: 0.75, bass: 'D3' },
    { t: 4.0, notes: ['E4'], dur: 1.5 },

    // "Raatan lambiyan lambiyan re..."
    { t: 6.0, notes: ['D4'], dur: 0.5, bass: 'D3' },
    { t: 6.5, notes: ['F#4'], dur: 0.5 },
    { t: 7.0, notes: ['A4'], dur: 0.5 },
    { t: 7.5, notes: ['B4'], dur: 1.0, bass: 'B2' },
    { t: 8.5, notes: ['B4'], dur: 0.5 },
    { t: 9.0, notes: ['A4'], dur: 0.5, bass: 'G2' },
    { t: 9.5, notes: ['F#4'], dur: 0.75 },
    { t: 10.25, notes: ['E4'], dur: 0.5, bass: 'A2' },
    { t: 10.75, notes: ['F#4'], dur: 1.5 },

    // "Kate tere sangeyan sangeyan re..."
    { t: 13.0, notes: ['D4'], dur: 0.5, bass: 'D3' },
    { t: 13.5, notes: ['F#4'], dur: 0.5 },
    { t: 14.0, notes: ['A4'], dur: 0.5 },
    { t: 14.5, notes: ['B4'], dur: 1.0, bass: 'B2' },
    { t: 15.5, notes: ['B4'], dur: 0.5 },
    { t: 16.0, notes: ['A4'], dur: 0.5, bass: 'G2' },
    { t: 16.5, notes: ['F#4'], dur: 0.75 },
    { t: 17.25, notes: ['E4'], dur: 0.5, bass: 'A2' },
    { t: 17.75, notes: ['D4'], dur: 2.0, bass: 'D3' },

    // "Cham cham chamkange taare saare..."
    { t: 21.0, notes: ['A4'], dur: 0.5, bass: 'A2' },
    { t: 21.5, notes: ['B4'], dur: 0.5 },
    { t: 22.0, notes: ['D5'], dur: 0.75, bass: 'D3' },
    { t: 22.75, notes: ['B4'], dur: 0.5 },
    { t: 23.25, notes: ['A4'], dur: 0.5, bass: 'G2' },
    { t: 23.75, notes: ['F#4'], dur: 0.5 },
    { t: 24.25, notes: ['E4'], dur: 0.5, bass: 'A2' },
    { t: 24.75, notes: ['F#4'], dur: 1.5 },

    // "Baith ke vekhange doyen janne..."
    { t: 26.5, notes: ['F#4'], dur: 0.5, bass: 'D3' },
    { t: 27.0, notes: ['A4'], dur: 0.5 },
    { t: 27.5, notes: ['B4'], dur: 0.75, bass: 'G2' },
    { t: 28.25, notes: ['A4'], dur: 0.5 },
    { t: 28.75, notes: ['F#4'], dur: 0.5, bass: 'A2' },
    { t: 29.25, notes: ['E4'], dur: 0.5 },
    { t: 29.75, notes: ['D4'], dur: 2.0, bass: 'D3' },
  ],
};

// 4. Apna Bana Le (Bhediya) - Arijit Singh
// Chorus: "Tu mera koi na hoke bhi kuch laage... Apna bana le piya, apna bana le piya..."
const APNA_BANA_LE_SCORE: MelodyScore = {
  bpm: 92,
  totalBeats: 32,
  steps: [
    // "Tu mera koi na hoke bhi kuch laage..."
    { t: 0, notes: ['E4'], dur: 0.5, bass: 'E3' },
    { t: 0.5, notes: ['G4'], dur: 0.5 },
    { t: 1.0, notes: ['A4'], dur: 0.75, bass: 'C3' },
    { t: 1.75, notes: ['B4'], dur: 0.75 },
    { t: 2.5, notes: ['A4'], dur: 0.5, bass: 'G2' },
    { t: 3.0, notes: ['G4'], dur: 0.5 },
    { t: 3.5, notes: ['E4'], dur: 0.5 },
    { t: 4.0, notes: ['D4'], dur: 0.5, bass: 'D3' },
    { t: 4.5, notes: ['E4'], dur: 0.5 },
    { t: 5.0, notes: ['G4'], dur: 0.5 },
    { t: 5.5, notes: ['A4'], dur: 1.5 },

    // "Apna bana le piya..."
    { t: 8.0, notes: ['G4'], dur: 0.5, bass: 'G2' },
    { t: 8.5, notes: ['A4'], dur: 0.5 },
    { t: 9.0, notes: ['B4'], dur: 0.75, bass: 'B2' },
    { t: 9.75, notes: ['D5'], dur: 1.0 },
    { t: 10.75, notes: ['B4'], dur: 0.75, bass: 'C3' },
    { t: 11.5, notes: ['A4'], dur: 0.5 },
    { t: 12.0, notes: ['G4'], dur: 1.5, bass: 'D3' },

    // "Apna bana le piya..." (Second soaring line)
    { t: 14.5, notes: ['G4'], dur: 0.5, bass: 'G2' },
    { t: 15.0, notes: ['A4'], dur: 0.5 },
    { t: 15.5, notes: ['B4'], dur: 0.75, bass: 'B2' },
    { t: 16.25, notes: ['D5'], dur: 1.0 },
    { t: 17.25, notes: ['E5'], dur: 0.5, bass: 'C3' },
    { t: 17.75, notes: ['D5'], dur: 0.75 },
    { t: 18.5, notes: ['B4'], dur: 0.75, bass: 'D3' },
    { t: 19.25, notes: ['A4'], dur: 0.5 },
    { t: 19.75, notes: ['G4'], dur: 1.5 },

    // "Dil ke nagar mein shehar tu basa le piya..."
    { t: 22.0, notes: ['B4'], dur: 0.5, bass: 'E3' },
    { t: 22.5, notes: ['A4'], dur: 0.5 },
    { t: 23.0, notes: ['G4'], dur: 0.5, bass: 'C3' },
    { t: 23.5, notes: ['E4'], dur: 0.5 },
    { t: 24.0, notes: ['G4'], dur: 0.5, bass: 'G2' },
    { t: 24.5, notes: ['A4'], dur: 0.5 },
    { t: 25.0, notes: ['B4'], dur: 0.75, bass: 'D3' },
    { t: 25.75, notes: ['A4'], dur: 0.5 },
    { t: 26.25, notes: ['G4'], dur: 0.5 },
    { t: 26.75, notes: ['E4'], dur: 2.5, bass: 'E3' },
  ],
};

// 5. Pehla Nasha (Jo Jeeta Wohi Sikandar) - Udit Narayan & Sadhana Sargam
// Opening Arpeggio & Melody: "Pehla nasha, pehla khumaar, naya pyaar hai naya intezaar..."
const PEHLA_NASHA_SCORE: MelodyScore = {
  bpm: 82,
  totalBeats: 32,
  steps: [
    // Famous Piano Arpeggio Opening
    { t: 0, notes: ['C4'], dur: 0.5, bass: 'C3' },
    { t: 0.5, notes: ['E4'], dur: 0.5 },
    { t: 1.0, notes: ['G4'], dur: 0.5 },
    { t: 1.5, notes: ['B4'], dur: 0.5 },

    { t: 2.0, notes: ['F4'], dur: 0.5, bass: 'F2' },
    { t: 2.5, notes: ['A4'], dur: 0.5 },
    { t: 3.0, notes: ['C5'], dur: 0.5 },
    { t: 3.5, notes: ['E5'], dur: 0.5 },

    // "Chaahe tum kuch na kaho..."
    { t: 4.0, notes: ['E4'], dur: 0.5, bass: 'C3' },
    { t: 4.5, notes: ['G4'], dur: 0.5 },
    { t: 5.0, notes: ['C5'], dur: 0.75 },
    { t: 5.75, notes: ['B4'], dur: 0.5, bass: 'G2' },
    { t: 6.25, notes: ['A4'], dur: 0.5 },
    { t: 6.75, notes: ['G4'], dur: 0.5 },
    { t: 7.25, notes: ['E4'], dur: 1.0 },

    // "Maine sun liya..."
    { t: 8.5, notes: ['F4'], dur: 0.5, bass: 'F2' },
    { t: 9.0, notes: ['A4'], dur: 0.5 },
    { t: 9.5, notes: ['D5'], dur: 0.75, bass: 'G2' },
    { t: 10.25, notes: ['C5'], dur: 1.5 },

    // "Pehla nasha, pehla khumaar..."
    { t: 12.0, notes: ['C4'], dur: 0.5, bass: 'C3' },
    { t: 12.5, notes: ['E4'], dur: 0.5 },
    { t: 13.0, notes: ['G4'], dur: 0.5 },
    { t: 13.5, notes: ['C5'], dur: 0.75, bass: 'A2' },
    { t: 14.25, notes: ['B4'], dur: 0.5 },
    { t: 14.75, notes: ['A4'], dur: 0.5, bass: 'G2' },
    { t: 15.25, notes: ['G4'], dur: 0.5 },
    { t: 15.75, notes: ['E4'], dur: 0.5 },
    { t: 16.25, notes: ['F4'], dur: 0.5, bass: 'F2' },
    { t: 16.75, notes: ['G4'], dur: 1.25 },

    // "Naya pyaar hai, naya intezaar..."
    { t: 18.5, notes: ['D4'], dur: 0.5, bass: 'D3' },
    { t: 19.0, notes: ['F4'], dur: 0.5 },
    { t: 19.5, notes: ['A4'], dur: 0.5 },
    { t: 20.0, notes: ['D5'], dur: 0.75, bass: 'G2' },
    { t: 20.75, notes: ['C5'], dur: 0.5 },
    { t: 21.25, notes: ['B4'], dur: 0.5 },
    { t: 21.75, notes: ['A4'], dur: 0.5 },
    { t: 22.25, notes: ['F4'], dur: 0.5 },
    { t: 22.75, notes: ['G4'], dur: 0.5, bass: 'C3' },
    { t: 23.25, notes: ['C4'], dur: 2.5 },
  ],
};

// 6. Tere Hawaale (Laal Singh Chaddha) - Arijit Singh & Shilpa Rao
// Chorus: "Yeh saara jahan tere hawaale, yeh jaan aur imaan tere hawaale..."
const TERE_HAWAALE_SCORE: MelodyScore = {
  bpm: 84,
  totalBeats: 32,
  steps: [
    // "Yeh saara jahan tere hawaale..."
    { t: 0, notes: ['E4'], dur: 0.5, bass: 'E3' },
    { t: 0.5, notes: ['G#4'], dur: 0.5 },
    { t: 1.0, notes: ['B4'], dur: 0.75, bass: 'A2' },
    { t: 1.75, notes: ['B4'], dur: 0.5 },
    { t: 2.25, notes: ['A4'], dur: 0.5, bass: 'B2' },
    { t: 2.75, notes: ['G#4'], dur: 0.5 },
    { t: 3.25, notes: ['F#4'], dur: 0.5 },
    { t: 3.75, notes: ['E4'], dur: 0.5, bass: 'E3' },
    { t: 4.25, notes: ['F#4'], dur: 0.5 },
    { t: 4.75, notes: ['G#4'], dur: 1.5 },

    // "Yeh jaan aur imaan tere hawaale..."
    { t: 7.0, notes: ['E4'], dur: 0.5, bass: 'E3' },
    { t: 7.5, notes: ['G#4'], dur: 0.5 },
    { t: 8.0, notes: ['B4'], dur: 0.75, bass: 'A2' },
    { t: 8.75, notes: ['B4'], dur: 0.5 },
    { t: 9.25, notes: ['C#5'], dur: 0.75, bass: 'C#3' },
    { t: 10.0, notes: ['B4'], dur: 0.5 },
    { t: 10.5, notes: ['A4'], dur: 0.5, bass: 'B2' },
    { t: 11.0, notes: ['G#4'], dur: 0.5 },
    { t: 11.5, notes: ['F#4'], dur: 0.5 },
    { t: 12.0, notes: ['E4'], dur: 2.0, bass: 'E3' },

    // "Tu chaahe toh rakh le..."
    { t: 15.0, notes: ['G#4'], dur: 0.5, bass: 'G#2' },
    { t: 15.5, notes: ['B4'], dur: 0.5 },
    { t: 16.0, notes: ['C#5'], dur: 0.75, bass: 'C#3' },
    { t: 16.75, notes: ['D#5'], dur: 0.75 },
    { t: 17.5, notes: ['C#5'], dur: 0.5, bass: 'B2' },
    { t: 18.0, notes: ['B4'], dur: 1.25 },

    // "Tu chaahe toh tod de..."
    { t: 20.0, notes: ['A4'], dur: 0.5, bass: 'A2' },
    { t: 20.5, notes: ['C#5'], dur: 0.5 },
    { t: 21.0, notes: ['B4'], dur: 0.5, bass: 'B2' },
    { t: 21.5, notes: ['A4'], dur: 0.5 },
    { t: 22.0, notes: ['G#4'], dur: 0.5, bass: 'E3' },
    { t: 22.5, notes: ['F#4'], dur: 0.5 },
    { t: 23.0, notes: ['E4'], dur: 2.5 },
  ],
};

const MELODY_SCORES: Record<string, MelodyScore> = {
  kesariya: KESARIYA_SCORE,
  'tum-hi-ho': TUM_HI_HO_SCORE,
  'raataan-lambiyan': RAATAAN_LAMBIYAN_SCORE,
  'apna-bana-le': APNA_BANA_LE_SCORE,
  'pehla-nasha': PEHLA_NASHA_SCORE,
  'tere-hawaale': TERE_HAWAALE_SCORE,
};

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private currentTrackIndex: number = 0;
  private isPlayingMusic: boolean = false;
  private volumeNode: GainNode | null = null;
  private currentVolume: number = 0.5;

  // Active audio node tracker for clean pause / song changes
  private sequenceTimer: number | null = null;

  // Ambient sound source
  private ambientSource: AudioBufferSourceNode | null = null;
  private ambientGain: GainNode | null = null;
  private currentAmbient: 'none' | 'rain' | 'fireplace' | 'waves' = 'none';

  private stateListeners: Set<(isPlaying: boolean, track: TrackInfo) => void> = new Set();
  private hasUserInteracted: boolean = false;

  // Curated Bollywood Romantic Hits
  public readonly tracks: TrackInfo[] = [
    {
      id: 'kesariya',
      title: 'Kesariya',
      movie: 'Brahmāstra',
      artist: 'Arijit Singh & Pritam',
      badge: 'All-Time Hit 🧡',
      youtubeSearchUrl: 'https://www.youtube.com/results?search_query=Kesariya+Brahmastra+Arijit+Singh+Full+Song',
      duration: '4:28',
      lyricsSnippet: 'Kesariya tera ishq hai piya, rang jaaun jo main haath lagaun...',
      fullLyrics: [
        'Mujhko itna bataaye koi, kaise tujhse dil na lagaaye koi',
        'Rabba ne tujhko banaane mein, kar di hai husn ki khaali tijoriyan',
        'Kaajal ki syaahi se likhi, hai tune jaane kitno ki love storiyan',
        'Kesariya tera ishq hai piya, rang jaaun jo main haath lagaun',
        'Din beete saara teri fikr mein, rain saari teri khair manaun',
        'Patjhad ke mausam mein bhi rangeen bahaar lagti hai, tu saath jo hoti hai',
      ],
      translation: 'Your love is saffron-colored my beloved, wherever I touch you, I am dyed in your hue...',
    },
    {
      id: 'tum-hi-ho',
      title: 'Tum Hi Ho',
      movie: 'Aashiqui 2',
      artist: 'Arijit Singh & Mithoon',
      badge: 'Romantic Anthem 🌹',
      youtubeSearchUrl: 'https://www.youtube.com/results?search_query=Tum+Hi+Ho+Aashiqui+2+Arijit+Singh+Full+Song',
      duration: '4:22',
      lyricsSnippet: 'Kyunki tum hi ho, ab tum hi ho, zindagi ab tum hi ho...',
      fullLyrics: [
        'Hum tere bin ab reh nahi sakte, tere bina kya wajood mera',
        'Tujhse juda agar ho jaayenge, toh khud se hi ho jaayenge juda',
        'Kyunki tum hi ho, ab tum hi ho, zindagi ab tum hi ho',
        'Chain bhi, mera dard bhi, meri aashiqui ab tum hi ho',
        'Tera mera rishta hai kaisa, ik pal door gawaara nahi',
        'Tere liye har roz hai jeete, tujhko diya mera waqt sabhi',
      ],
      translation: 'Because you alone are my life now, my peace, my pain, and my entire love...',
    },
    {
      id: 'raataan-lambiyan',
      title: 'Raataan Lambiyan',
      movie: 'Shershaah',
      artist: 'Jubin Nautiyal & Asees Kaur',
      badge: 'Moonlight Romance 🌙',
      youtubeSearchUrl: 'https://www.youtube.com/results?search_query=Raataan+Lambiyan+Shershaah+Full+Song',
      duration: '3:50',
      lyricsSnippet: 'Raatan lambiyan lambiyan re, kate tere sangeyan sangeyan re...',
      fullLyrics: [
        'Kahe main tenu samjhawan, kithe door na jawan',
        'Kivein din langhde ne tere bina, main kisse nu vi na dassan',
        'Raatan lambiyan lambiyan re, kate tere sangeyan sangeyan re',
        'Cham cham chamkange taare saare, baith ke vekhange doyen janne',
        'Aaja ve aaja mahiya, tere bina dil nahi lagda',
      ],
      translation: 'The long sweet nights pass only when I am close to you beneath the stars...',
    },
    {
      id: 'apna-bana-le',
      title: 'Apna Bana Le',
      movie: 'Bhediya',
      artist: 'Arijit Singh & Sachin-Jigar',
      badge: 'Pure Devotion 💖',
      youtubeSearchUrl: 'https://www.youtube.com/results?search_query=Apna+Bana+Le+Bhediya+Arijit+Singh+Full+Song',
      duration: '4:21',
      lyricsSnippet: 'Apna bana le piya, dil ke nagar mein shehar tu basa le piya...',
      fullLyrics: [
        'Tu mera koi na hoke bhi kuch laage',
        'Kiya re jo bhi tune, kaise kiya re',
        'Jiya ko mere baandh aise liya re',
        'Apna bana le piya, apna bana le piya',
        'Dil ke nagar mein shehar tu basa le piya',
        'Chhoo le magar pyaar se, bas tera intezaar hai',
      ],
      translation: 'Even though you came as a stranger, you feel like my whole world. Make me yours, my love...',
    },
    {
      id: 'pehla-nasha',
      title: 'Pehla Nasha',
      movie: 'Jo Jeeta Wohi Sikandar',
      artist: 'Udit Narayan & Sadhana Sargam',
      badge: 'First Love Magic ✨',
      youtubeSearchUrl: 'https://www.youtube.com/results?search_query=Pehla+Nasha+Jo+Jeeta+Wohi+Sikandar+Original+Song',
      duration: '4:51',
      lyricsSnippet: 'Pehla nasha, pehla khumaar, naya pyaar hai naya intezaar...',
      fullLyrics: [
        'Chaahe tum kuch na kaho, maine sun liya',
        'Ke saathi pyaar ka, mujhe chun liya',
        'Pehla nasha, pehla khumaar, naya pyaar hai naya intezaar',
        'Kar loon main kya apna haal, ae dil-e-beqaraar, mere dil-e-beqaraar',
        'Udta hi phiroon in hawaaon mein kahin, ya main jhool jaaoon in ghataaon mein kahin',
      ],
      translation: 'First intoxicated feelings of romance, fresh new love and sweet longing...',
    },
    {
      id: 'tere-hawaale',
      title: 'Tere Hawaale',
      movie: 'Laal Singh Chaddha',
      artist: 'Arijit Singh & Shilpa Rao',
      badge: 'Soul Connection 🕊️',
      youtubeSearchUrl: 'https://www.youtube.com/results?search_query=Tere+Hawaale+Laal+Singh+Chaddha+Arijit+Singh+Full+Song',
      duration: '5:46',
      lyricsSnippet: 'Yeh saara jahan tere hawaale, yeh jaan aur imaan tere hawaale...',
      fullLyrics: [
        'Lagan lagi tumse man ki lagan',
        'Dheeme dheeme jalte hain bujhte hain lamhe',
        'Yeh saara jahan tere hawaale, yeh jaan aur imaan tere hawaale',
        'Tu chaahe toh rakh le, tu chaahe toh tod de',
        'Meri har saans pe naam tera hi hai likha',
      ],
      translation: 'I surrender this entire world, my soul, and my very breath into your gentle hands...',
    },
  ];

  constructor() {
    this.setupAutoplayListener();
  }

  private initCtx() {
    if (typeof window === 'undefined') return;
    if (!this.ctx) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
      this.volumeNode = this.ctx.createGain();
      this.volumeNode.gain.value = this.currentVolume;
      this.volumeNode.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  // Automatic user gesture listener: begins playback on first user touch
  private setupAutoplayListener() {
    if (typeof window === 'undefined') return;

    const startAutoplay = () => {
      if (!this.hasUserInteracted) {
        this.hasUserInteracted = true;
        this.initCtx();
        if (!this.isPlayingMusic) {
          this.startMusicBox();
        }
      }
      cleanup();
    };

    const cleanup = () => {
      window.removeEventListener('pointerdown', startAutoplay);
      window.removeEventListener('keydown', startAutoplay);
      window.removeEventListener('touchstart', startAutoplay);
      window.removeEventListener('click', startAutoplay);
    };

    window.addEventListener('pointerdown', startAutoplay, { once: true, passive: true });
    window.addEventListener('keydown', startAutoplay, { once: true, passive: true });
    window.addEventListener('touchstart', startAutoplay, { once: true, passive: true });
    window.addEventListener('click', startAutoplay, { once: true, passive: true });
  }

  // Synthesize a romantic music box / acoustic celesta note
  private scheduleMelodyNote(noteName: string, startTime: number, durationSec: number, vel: number) {
    if (!this.ctx || !this.volumeNode) return;
    const freq = NOTE_FREQS[noteName];
    if (!freq) return;

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const noteGain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    // Warm music box acoustic filter
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2500, startTime);
    filter.Q.setValueAtTime(1.1, startTime);

    // Osc1: Fundamental pure sine
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, startTime);

    // Osc2: Soft harmonic triangle with micro-chorus
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq, startTime);
    osc2.detune.setValueAtTime(3.5, startTime);

    // Dynamic ADSR envelope
    noteGain.gain.setValueAtTime(0.0001, startTime);
    const peakVol = 0.22 * vel;
    noteGain.gain.exponentialRampToValueAtTime(peakVol, startTime + 0.008);
    const releaseTime = startTime + Math.max(0.45, durationSec * 1.6);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, releaseTime);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(noteGain);
    noteGain.connect(this.volumeNode);

    osc1.start(startTime);
    osc2.start(startTime);
    osc1.stop(releaseTime);
    osc2.stop(releaseTime);
  }

  // Synthesize a warm acoustic bass note
  private scheduleBassNote(noteName: string, startTime: number, durationSec: number, vel: number) {
    if (!this.ctx || !this.volumeNode) return;
    const freq = NOTE_FREQS[noteName];
    if (!freq) return;

    const osc = this.ctx.createOscillator();
    const bassGain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(360, startTime);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);

    bassGain.gain.setValueAtTime(0.0001, startTime);
    const peakVol = 0.18 * vel;
    bassGain.gain.exponentialRampToValueAtTime(peakVol, startTime + 0.015);
    const releaseTime = startTime + Math.max(0.7, durationSec * 1.8);
    bassGain.gain.exponentialRampToValueAtTime(0.0001, releaseTime);

    osc.connect(filter);
    filter.connect(bassGain);
    bassGain.connect(this.volumeNode);

    osc.start(startTime);
    osc.stop(releaseTime);
  }

  // Core Sequencer: schedules the current song's notes using native AudioContext timeline
  private runSequencer() {
    if (!this.isPlayingMusic) return;
    this.initCtx();
    if (!this.ctx || !this.volumeNode) return;

    const currentTrack = this.tracks[this.currentTrackIndex];
    const score = MELODY_SCORES[currentTrack.id] || KESARIYA_SCORE;
    const secondsPerBeat = 60 / score.bpm;

    const startTime = this.ctx.currentTime + 0.08;
    const totalDurationSec = score.totalBeats * secondsPerBeat;

    // Schedule every note in this loop using high-precision Web Audio clock
    for (const step of score.steps) {
      const noteTime = startTime + step.t * secondsPerBeat;
      const durSec = step.dur * secondsPerBeat;
      const vel = step.vel ?? 0.85;

      for (const note of step.notes) {
        this.scheduleMelodyNote(note, noteTime, durSec, vel);
      }
      if (step.bass) {
        this.scheduleBassNote(step.bass, noteTime, durSec * 1.5, vel * 0.9);
      }
    }

    // Schedule next loop when this loop finishes
    this.sequenceTimer = window.setTimeout(() => {
      if (this.isPlayingMusic) {
        this.runSequencer();
      }
    }, totalDurationSec * 1000);
  }

  // Stop active scheduling timers
  private stopActiveSequencer() {
    if (this.sequenceTimer !== null) {
      window.clearTimeout(this.sequenceTimer);
      this.sequenceTimer = null;
    }
  }

  // Notify UI subscribers
  private notifyListeners() {
    const currentTrack = this.tracks[this.currentTrackIndex];
    this.stateListeners.forEach((listener) => {
      try {
        listener(this.isPlayingMusic, currentTrack);
      } catch {}
    });
  }

  subscribe(listener: (isPlaying: boolean, track: TrackInfo) => void) {
    this.stateListeners.add(listener);
    listener(this.isPlayingMusic, this.tracks[this.currentTrackIndex]);
    return () => {
      this.stateListeners.delete(listener);
    };
  }

  // Start Bollywood Music Box Playback
  startMusicBox() {
    this.initCtx();
    this.stopActiveSequencer();
    this.isPlayingMusic = true;
    this.runSequencer();
    this.notifyListeners();
  }

  // Stop Bollywood Music Box Playback
  stopMusicBox() {
    this.stopActiveSequencer();
    this.isPlayingMusic = false;
    this.notifyListeners();
  }

  toggleMusicBox(onStateChange?: (isPlaying: boolean, trackTitle: string) => void) {
    if (this.isPlayingMusic) {
      this.stopMusicBox();
      if (onStateChange) onStateChange(false, this.tracks[this.currentTrackIndex].title);
    } else {
      this.startMusicBox();
      if (onStateChange) onStateChange(true, this.tracks[this.currentTrackIndex].title);
    }
  }

  selectTrack(indexOrId: number | string) {
    let targetIndex = 0;
    if (typeof indexOrId === 'number') {
      targetIndex = (indexOrId + this.tracks.length) % this.tracks.length;
    } else {
      const idx = this.tracks.findIndex((t) => t.id === indexOrId);
      if (idx !== -1) targetIndex = idx;
    }

    this.currentTrackIndex = targetIndex;
    this.stopActiveSequencer();

    if (this.isPlayingMusic) {
      this.runSequencer();
    }
    this.notifyListeners();
    return this.tracks[this.currentTrackIndex];
  }

  nextTrack() {
    const nextIdx = (this.currentTrackIndex + 1) % this.tracks.length;
    this.selectTrack(nextIdx);
    if (!this.isPlayingMusic) {
      this.startMusicBox();
    }
    return this.tracks[this.currentTrackIndex].title;
  }

  prevTrack() {
    const prevIdx = (this.currentTrackIndex - 1 + this.tracks.length) % this.tracks.length;
    this.selectTrack(prevIdx);
    if (!this.isPlayingMusic) {
      this.startMusicBox();
    }
    return this.tracks[this.currentTrackIndex].title;
  }

  getCurrentTrack() {
    return this.tracks[this.currentTrackIndex];
  }

  getCurrentTrackTitle() {
    return this.tracks[this.currentTrackIndex].title;
  }

  getIsPlaying() {
    return this.isPlayingMusic;
  }

  setVolume(vol: number) {
    this.currentVolume = Math.max(0, Math.min(1, vol));
    if (this.ctx && this.volumeNode) {
      this.volumeNode.gain.setValueAtTime(this.currentVolume, this.ctx.currentTime);
    }
  }

  getVolume() {
    return this.currentVolume;
  }

  // Clean note synthesizer used for UI sound effects (bells, sparkles, chimes)
  playNote(
    freq: number,
    duration: number = 0.8,
    volumeMultiplier: number = 1.0,
    timbre: 'piano' | 'musicbox' | 'acoustic' = 'musicbox'
  ) {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx || !this.volumeNode) return;

      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();

      if (timbre === 'musicbox') {
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(freq, now);
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(freq * 2, now);

        noteGain.gain.setValueAtTime(0.0001, now);
        noteGain.gain.exponentialRampToValueAtTime(0.18 * volumeMultiplier, now + 0.01);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      } else {
        osc1.type = 'triangle';
        osc1.frequency.setValueAtTime(freq, now);
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(freq * 1.5, now);

        noteGain.gain.setValueAtTime(0.0001, now);
        noteGain.gain.exponentialRampToValueAtTime(0.16 * volumeMultiplier, now + 0.015);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      }

      osc1.connect(noteGain);
      osc2.connect(noteGain);
      noteGain.connect(this.volumeNode);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + duration);
      osc2.stop(now + duration);
    } catch {}
  }

  // Standard bell sound for UI feedback
  playBell(freq: number, duration: number = 1.0, volume: number = 0.15) {
    this.playNote(freq, duration, volume / 0.15, 'musicbox');
  }

  // Heartbeat sound
  playHeartbeat() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx || !this.volumeNode) return;

      const now = this.ctx.currentTime;
      const playThump = (timeOffset: number, freq: number, dur: number) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + timeOffset);
        osc.frequency.exponentialRampToValueAtTime(35, now + timeOffset + dur);

        gain.gain.setValueAtTime(0.001, now + timeOffset);
        gain.gain.exponentialRampToValueAtTime(0.35, now + timeOffset + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + timeOffset + dur);

        osc.connect(gain);
        gain.connect(this.volumeNode!);
        osc.start(now + timeOffset);
        osc.stop(now + timeOffset + dur);
      };

      playThump(0, 95, 0.12);
      playThump(0.14, 85, 0.15);
    } catch {}
  }

  // Cute chimes for opening letters or buttons
  playChime(type: 'sparkle' | 'open' | 'pop' = 'sparkle') {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      if (type === 'sparkle') {
        const notes = [659.25, 783.99, 1046.50, 1318.51];
        notes.forEach((freq, idx) => {
          setTimeout(() => this.playNote(freq, 0.6, 0.8, 'musicbox'), idx * 75);
        });
      } else if (type === 'open') {
        const notes = [523.25, 659.25, 783.99, 1046.5];
        notes.forEach((freq, idx) => {
          setTimeout(() => this.playNote(freq, 0.8, 0.8, 'musicbox'), idx * 90);
        });
      } else if (type === 'pop') {
        this.playNote(880, 0.15, 0.5, 'musicbox');
      }
    } catch {}
  }

  // Realistic kiss sound effect
  playKissSound() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx || !this.volumeNode) return;
      const now = this.ctx.currentTime;

      // Soft lip-smack pitch glide
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(550, now);
      osc.frequency.exponentialRampToValueAtTime(1350, now + 0.035);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.11);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.32, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.13);

      osc.connect(gain);
      gain.connect(this.volumeNode);
      osc.start(now);
      osc.stop(now + 0.13);

      // Sweet romantic sparkle chime trailing the kiss
      setTimeout(() => {
        this.playNote(1046.5, 0.3, 0.45, 'musicbox');
      }, 40);
    } catch {}
  }

  playKiss() {
    this.playKissSound();
  }

  // Romantic ambient soundscapes (Rain, Fireplace, Ocean Waves)
  setAmbientSound(type: 'none' | 'rain' | 'fireplace' | 'waves') {
    this.initCtx();
    if (!this.ctx) return;

    if (this.ambientSource) {
      try {
        this.ambientSource.stop();
        this.ambientSource.disconnect();
      } catch {}
      this.ambientSource = null;
    }

    this.currentAmbient = type;
    if (type === 'none') return;

    try {
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);

      if (type === 'rain') {
        let b0 = 0, b1 = 0, b2 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.153852;
          data[i] = (b0 + b1 + b2) * 0.08;
        }
      } else if (type === 'fireplace') {
        for (let i = 0; i < bufferSize; i++) {
          const rumble = (Math.random() * 2 - 1) * 0.04;
          const crackle = Math.random() < 0.003 ? (Math.random() * 2 - 1) * 0.45 : 0;
          data[i] = rumble + crackle;
        }
      } else if (type === 'waves') {
        for (let i = 0; i < bufferSize; i++) {
          const t = i / bufferSize;
          const swell = Math.sin(t * Math.PI * 2) * 0.5 + 0.5;
          const noise = (Math.random() * 2 - 1) * 0.05;
          data[i] = noise * swell;
        }
      }

      const source = this.ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = type === 'rain' ? 800 : type === 'fireplace' ? 600 : 500;

      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.value = 0.2;

      source.connect(filter);
      filter.connect(this.ambientGain);
      this.ambientGain.connect(this.ctx.destination);

      source.start();
      this.ambientSource = source;
    } catch {}
  }

  getCurrentAmbient() {
    return this.currentAmbient;
  }
}

export const sound = new SoundEngine();
