import type { GroundingSession } from '@/types';

export type ProgressViewModel = {
  totalSessions: number;
  completedSessions: number;
  averageReduction: number;
  bestReduction: number;
  daysActive: number;
  currentStreak: number;
  recentSessions: GroundingSession[];
};

function toDateKey(value: string | Date) {
  const date = typeof value === 'string' ? new Date(value) : value;
  return date.toISOString().slice(0, 10);
}

function getReduction(session: GroundingSession) {
  if (typeof session.anxietyPre !== 'number' || typeof session.anxietyPost !== 'number') {
    return null;
  }

  return session.anxietyPre - session.anxietyPost;
}

function calculateCurrentStreak(dateKeys: string[]) {
  const practicedDays = new Set(dateKeys);
  let streak = 0;
  const cursor = new Date();

  while (practicedDays.has(toDateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  if (streak > 0) return streak;

  cursor.setDate(cursor.getDate() - 1);
  while (practicedDays.has(toDateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

export function buildProgressViewModel(sessions: GroundingSession[]): ProgressViewModel {
  const completed = sessions
    .filter((session) => session.completed)
    .toSorted((a, b) => b.startedAt.localeCompare(a.startedAt));

  const reductions = completed
    .map(getReduction)
    .filter((value): value is number => value !== null);

  const dateKeys = completed.map((session) => toDateKey(session.startedAt));
  const uniqueDays = [...new Set(dateKeys)];

  const averageReduction =
    reductions.length > 0
      ? reductions.reduce((total, value) => total + value, 0) / reductions.length
      : 0;

  return {
    totalSessions: sessions.length,
    completedSessions: completed.length,
    averageReduction,
    bestReduction: reductions.length > 0 ? Math.max(...reductions) : 0,
    daysActive: uniqueDays.length,
    currentStreak: calculateCurrentStreak(uniqueDays),
    recentSessions: completed.slice(0, 5),
  };
}

export function formatSessionDate(value: string) {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
}
