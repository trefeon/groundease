import type { GroundingCategory, GroundingSession, GroundingStep, GroundingTechnique } from '@/types';

export type SessionPhase = 'prepare' | 'pre' | 'practice' | 'post';

export function clampScore(value: string | null) {
  if (value === null || value.trim() === '') return null;
  const score = Number(value);
  if (!Number.isFinite(score)) return null;
  return Math.min(10, Math.max(0, Math.round(score)));
}

export function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export function getScoreLabel(score: number) {
  if (score <= 2) return 'tenang';
  if (score <= 4) return 'sedikit cemas';
  if (score <= 6) return 'cemas sedang';
  if (score <= 8) return 'cukup cemas';
  return 'sangat cemas';
}

type BuildCompletedSessionInput = {
  sessionId: string;
  technique: GroundingTechnique;
  startedAt: string;
  completedAt: string;
  preScore: number;
  postScore: number;
  responses: Record<number | string, string>;
  steps: GroundingStep[];
};

export function buildCompletedSession({
  sessionId,
  technique,
  startedAt,
  completedAt,
  preScore,
  postScore,
  responses,
  steps,
}: BuildCompletedSessionInput): GroundingSession {
  const durationSeconds = Math.max(
    1,
    Math.round((new Date(completedAt).getTime() - new Date(startedAt).getTime()) / 1000),
  );

  return {
    id: sessionId,
    techniqueId: technique.id,
    techniqueName: technique.name,
    techniqueCategory: technique.category as GroundingCategory,
    startedAt,
    completedAt,
    durationSeconds,
    completed: true,
    anxietyPre: preScore,
    anxietyPost: postScore,
    stepResponses: steps.map((step) => ({
      stepId: step.id,
      prompt: step.prompt,
      response: responses[step.id]?.trim() || undefined,
      senseType: step.senseType,
    })),
  };
}
