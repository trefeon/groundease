import type { SessionPayload } from '../config/validation/session';

export type SessionSummary = {
  totalSessions: number;
  completedSessions: number;
  averageReduction: number;
};

export function summarizeSessions(sessions: SessionPayload[]): SessionSummary {
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
    averageReduction,
  };
}
