import type { AnxietyAssessment, GroundingSession } from '@/types';

const STORAGE_KEYS = {
  assessments: 'ruang-pulih:assessments',
  sessions: 'ruang-pulih:sessions',
} as const;

function readCollection<T>(key: string): T[] {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

function writeCollection<T>(key: string, value: T[]) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function getAssessments() {
  return readCollection<AnxietyAssessment>(STORAGE_KEYS.assessments);
}

export function saveAssessment(
  assessment: Omit<AnxietyAssessment, 'id' | 'timestamp'> &
    Partial<Pick<AnxietyAssessment, 'id' | 'timestamp'>>,
) {
  const nextAssessment: AnxietyAssessment = {
    id: assessment.id ?? createId('assessment'),
    timestamp: assessment.timestamp ?? new Date().toISOString(),
    score: assessment.score,
    scaleType: assessment.scaleType,
    context: assessment.context,
    sessionId: assessment.sessionId,
  };

  const assessments = getAssessments();
  writeCollection(STORAGE_KEYS.assessments, [nextAssessment, ...assessments]);
  return nextAssessment;
}

export function getSessions() {
  return readCollection<GroundingSession>(STORAGE_KEYS.sessions);
}

export function saveSession(session: GroundingSession) {
  const sessions = getSessions().filter((item) => item.id !== session.id);
  writeCollection(STORAGE_KEYS.sessions, [session, ...sessions]);
  return session;
}

export function getRecentSessions(limit = 5) {
  return getSessions()
    .sort((a, b) => b.startedAt.localeCompare(a.startedAt))
    .slice(0, limit);
}

export function getPracticeSummary() {
  const sessions = getSessions();
  const completedSessions = sessions.filter((session) => session.completed);
  const reductions = completedSessions
    .map((session) => {
      if (typeof session.anxietyPre !== 'number' || typeof session.anxietyPost !== 'number') {
        return null;
      }

      return session.anxietyPre - session.anxietyPost;
    })
    .filter((value): value is number => value !== null);

  const averageReduction =
    reductions.length > 0
      ? reductions.reduce((total, value) => total + value, 0) / reductions.length
      : 0;

  return {
    totalSessions: sessions.length,
    completedSessions: completedSessions.length,
    latestSession: getRecentSessions(1)[0],
    averageReduction,
  };
}

export function clearLocalPracticeData() {
  window.localStorage.removeItem(STORAGE_KEYS.assessments);
  window.localStorage.removeItem(STORAGE_KEYS.sessions);
}

