// ============================================
// Ruang Pulih — Type Definitions
// ============================================

/** Kategori teknik grounding yang tersedia */
export type GroundingCategory = 'sensorik' | 'afirmasi' | 'pernapasan' | 'gerakan' | 'somatik' | 'kognitif';

/** Sub-tipe teknik sensorik */
export type SensoryType = '5-4-3-2-1' | 'sentuhan' | 'auditori' | 'somatik' | 'defusion';

/** Tingkat kesulitan teknik */
export type DifficultyLevel = 'mudah' | 'sedang' | 'lanjutan';

/** Definisi teknik grounding */
export interface GroundingTechnique {
  id: string;
  name: string;
  category: GroundingCategory;
  sensoryType?: SensoryType;
  description: string;
  scientificBasis: string;
  duration: number; // dalam menit
  difficulty: DifficultyLevel;
  steps?: GroundingStep[];
  iconName: string;
  /** Suara ambient default yang diputar saat tidak ada preferensi global */
  defaultSound?: string;
}

/** Sub-tipe fase pernapasan & sensorik */
export type StepPhase =
  | 'inhale'
  | 'hold'
  | 'exhale'
  | 'rest'
  | 'sensory'
  | 'touch'
  | 'auditory'
  | 'walking'
  | 'somatic'
  | 'defusion';

/** Langkah dalam sesi grounding */
export interface GroundingStep {
  id: number;
  instruction: string;
  duration: number; // dalam detik
  prompt?: string; // prompt untuk input pengguna
  senseType?: '👁️ Lihat' | '✋ Sentuh' | '👂 Dengar' | '👃 Cium' | '👅 Rasa';
  phase?: StepPhase;
  visualMode?: 'breathing' | 'sensory' | 'touch' | 'auditory' | 'walking';
}

/** Catatan jawaban per langkah selama sesi */
export interface GroundingStepResponse {
  stepId: number;
  prompt?: string;
  response?: string;
  senseType?: GroundingStep['senseType'];
}

/** Sesi grounding yang tercatat */
export interface GroundingSession {
  id: string;
  techniqueId: string;
  techniqueName?: string;
  techniqueCategory: GroundingCategory;
  startedAt: string;
  completedAt?: string;
  durationSeconds: number;
  completed: boolean;
  anxietyPre?: number;
  anxietyPost?: number;
  stepResponses?: GroundingStepResponse[];
}

/** Pengukuran kecemasan */
export interface AnxietyAssessment {
  id: string;
  timestamp: string;
  score: number; // 0-10
  scaleType: 'SUD' | 'GAD-2';
  context: 'pre' | 'post' | 'standalone';
  sessionId?: string;
}

/** Log mood harian */
export interface MoodLog {
  id: string;
  timestamp: string;
  moodLevel: number; // 1-10
  anxietyLevel: number; // 1-10
  notes?: string;
}

/** Afirmasi positif */
export interface Affirmation {
  id: string;
  text: string;
  category: AffirmationCategory;
  isFavorite?: boolean;
}

/** Kategori afirmasi */
export type AffirmationCategory = 'kecemasan' | 'stres' | 'self-worth' | 'akademik' | 'umum';

/** Preferensi pengguna */
export interface UserPreferences {
  theme: 'light' | 'dark';
  soundEnabled: boolean;
  volume: number;
  favoriteTechniques: string[];
  favoriteAffirmations: string[];
}
