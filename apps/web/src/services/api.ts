import type { AnxietyAssessment, GroundingSession } from '@/types';

type ApiResponse<T> = {
  data: T;
  persistence: 'memory' | 'mongodb';
};

type SessionSummary = {
  totalSessions: number;
  completedSessions: number;
  averageReduction: number;
};

const remoteSyncEnabled = import.meta.env.VITE_ENABLE_REMOTE_SYNC === 'true';

async function postJson<T, R = unknown>(path: string, payload: T): Promise<R | null> {
  if (!remoteSyncEnabled) return null;

  try {
    const response = await fetch(`/api${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) return null;
    return (await response.json()) as R;
  } catch {
    return null;
  }
}

async function getJson<R = unknown>(path: string): Promise<R | null> {
  if (!remoteSyncEnabled) return null;

  try {
    const response = await fetch(`/api${path}`);
    if (!response.ok) return null;
    return (await response.json()) as R;
  } catch {
    return null;
  }
}

export const api = {
  /**
   * Save an anxiety assessment to the backend.
   * Falls back to memory storage if MongoDB is unavailable.
   */
  saveAssessment: (assessment: AnxietyAssessment) =>
    postJson<AnxietyAssessment, ApiResponse<AnxietyAssessment>>('/assessments', assessment),

  /** List recent assessments */
  listAssessments: (limit = 20) =>
    getJson<ApiResponse<AnxietyAssessment[]>>(`/assessments?limit=${limit}`),

  /**
   * Save a completed session to the backend.
   * Falls back to memory storage if MongoDB is unavailable.
   */
  saveSession: (session: GroundingSession) =>
    postJson<GroundingSession, ApiResponse<GroundingSession>>('/sessions', session),

  /** List recent sessions */
  listSessions: (limit = 20) =>
    getJson<ApiResponse<GroundingSession[]>>(`/sessions?limit=${limit}`),

  /** Get aggregated practice summary */
  getSummary: () => getJson<ApiResponse<SessionSummary>>('/sessions/summary'),

  /** Submit user feedback (public, no auth needed) */
  submitFeedback: (payload: {
    rating: number;
    category: string;
    message?: string;
    sourcePage?: string;
  }) => postJson<typeof payload, ApiResponse<unknown>>('/feedback', payload),

  /** List all feedback (requires admin key) */
  listFeedback: (key: string, limit = 100, category?: string) => {
    const params = new URLSearchParams({ key, limit: String(limit) });
    if (category) params.set('category', category);
    return getJson<{ data: unknown[]; total: number }>(`/feedback?${params}`);
  },

  /** Get feedback stats (requires admin key) */
  getFeedbackStats: (key: string) =>
    getJson<{ data: { total: number; averageRating: number; byCategory: Record<string, number> } }>(
      `/feedback/stats?key=${encodeURIComponent(key)}`,
    ),
};
