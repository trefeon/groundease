import type { Affirmation } from '@/types';

// ============================================
// Kumpulan Afirmasi Positif
// Dikurasi untuk konteks terapeutik
// ============================================

export const affirmations: Affirmation[] = [
  // --- Kecemasan ---
  {
    id: 'aff-1',
    text: 'Aku aman di sini, di saat ini.',
    category: 'kecemasan',
  },
  {
    id: 'aff-2',
    text: 'Perasaan ini akan berlalu. Aku sudah pernah melewatinya sebelumnya.',
    category: 'kecemasan',
  },
  {
    id: 'aff-3',
    text: 'Aku memilih untuk melepaskan apa yang tidak bisa aku kendalikan.',
    category: 'kecemasan',
  },
  {
    id: 'aff-4',
    text: 'Kecemasan ini bukan siapa diriku. Ini hanya perasaan yang sedang lewat.',
    category: 'kecemasan',
  },
  {
    id: 'aff-5',
    text: 'Aku memberi izin pada diriku untuk tenang.',
    category: 'kecemasan',
  },

  // --- Stres ---
  {
    id: 'aff-6',
    text: 'Aku tidak harus menyelesaikan segalanya hari ini.',
    category: 'stres',
  },
  {
    id: 'aff-7',
    text: 'Aku layak untuk beristirahat.',
    category: 'stres',
  },
  {
    id: 'aff-8',
    text: 'Satu langkah kecil tetap sebuah kemajuan.',
    category: 'stres',
  },
  {
    id: 'aff-9',
    text: 'Aku mengizinkan diriku untuk melambat.',
    category: 'stres',
  },
  {
    id: 'aff-10',
    text: 'Aku cukup, bahkan di hari-hari yang terasa berat.',
    category: 'stres',
  },

  // --- Self-Worth ---
  {
    id: 'aff-11',
    text: 'Aku berharga, terlepas dari pencapaianku.',
    category: 'self-worth',
  },
  {
    id: 'aff-12',
    text: 'Aku pantas menerima kebaikan dan kasih sayang.',
    category: 'self-worth',
  },
  {
    id: 'aff-13',
    text: 'Aku bangga dengan siapa diriku hari ini.',
    category: 'self-worth',
  },
  {
    id: 'aff-14',
    text: 'Aku tidak perlu sempurna untuk menjadi luar biasa.',
    category: 'self-worth',
  },
  {
    id: 'aff-15',
    text: 'Aku memaafkan diriku untuk kesalahan yang sudah lewat.',
    category: 'self-worth',
  },

  // --- Akademik ---
  {
    id: 'aff-16',
    text: 'Aku mampu menghadapi tantangan akademik ini.',
    category: 'akademik',
  },
  {
    id: 'aff-17',
    text: 'Nilaiku tidak menentukan nilai diriku sebagai manusia.',
    category: 'akademik',
  },
  {
    id: 'aff-18',
    text: 'Aku belajar dan bertumbuh setiap hari, meskipun perlahan.',
    category: 'akademik',
  },
  {
    id: 'aff-19',
    text: 'Aku membandingkan diriku hanya dengan versiku kemarin.',
    category: 'akademik',
  },
  {
    id: 'aff-20',
    text: 'Tekanan ini bersifat sementara. Kemampuanku bersifat permanen.',
    category: 'akademik',
  },

  // --- Umum ---
  {
    id: 'aff-21',
    text: 'Aku hadir di sini dan saat ini. Itu sudah cukup.',
    category: 'umum',
  },
  {
    id: 'aff-22',
    text: 'Aku memilih kedamaian daripada kekhawatiran.',
    category: 'umum',
  },
  {
    id: 'aff-23',
    text: 'Setiap tarikan napas membawa ketenangan baru.',
    category: 'umum',
  },
  {
    id: 'aff-24',
    text: 'Aku kuat, bahkan saat aku merasa rapuh.',
    category: 'umum',
  },
  {
    id: 'aff-25',
    text: 'Hari ini aku memilih untuk menjadi baik pada diriku sendiri.',
    category: 'umum',
  },
];

/** Get affirmations by category */
export function getAffirmationsByCategory(category: string): Affirmation[] {
  return affirmations.filter((a) => a.category === category);
}

/** Get a random affirmation */
export function getRandomAffirmation(): Affirmation {
  return affirmations[Math.floor(Math.random() * affirmations.length)];
}

/** Get a random affirmation by category */
export function getRandomAffirmationByCategory(category: string): Affirmation {
  const filtered = getAffirmationsByCategory(category);
  return filtered[Math.floor(Math.random() * filtered.length)];
}

