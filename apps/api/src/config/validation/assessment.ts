export type AssessmentPayload = {
  id?: string;
  timestamp?: string;
  score?: number;
  scaleType?: 'SUD' | 'GAD-2';
  context?: 'pre' | 'post' | 'standalone';
  sessionId?: string;
};

export function normalizeAssessment(payload: AssessmentPayload) {
  return {
    clientId: payload.id,
    timestamp: payload.timestamp ? new Date(payload.timestamp) : new Date(),
    score: payload.score,
    scaleType: payload.scaleType ?? 'SUD',
    context: payload.context,
    sessionId: payload.sessionId,
  };
}

export function isValidAssessment(payload: AssessmentPayload) {
  return (
    typeof payload.score === 'number' &&
    payload.score >= 0 &&
    payload.score <= 10 &&
    payload.context !== undefined
  );
}
