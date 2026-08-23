export type SessionPayload = {
  id?: string;
  techniqueId?: string;
  techniqueName?: string;
  techniqueCategory?: 'sensorik' | 'afirmasi' | 'pernapasan' | 'gerakan';
  startedAt?: string;
  completedAt?: string;
  durationSeconds?: number;
  completed?: boolean;
  anxietyPre?: number;
  anxietyPost?: number;
  stepResponses?: {
    stepId: number;
    prompt?: string;
    response?: string;
    senseType?: string;
  }[];
};

export function normalizeSession(payload: SessionPayload) {
  return {
    clientId: payload.id,
    techniqueId: payload.techniqueId,
    techniqueName: payload.techniqueName,
    techniqueCategory: payload.techniqueCategory,
    startedAt: payload.startedAt ? new Date(payload.startedAt) : new Date(),
    completedAt: payload.completedAt ? new Date(payload.completedAt) : undefined,
    durationSeconds: payload.durationSeconds ?? 0,
    completed: payload.completed ?? false,
    anxietyPre: payload.anxietyPre,
    anxietyPost: payload.anxietyPost,
    stepResponses: payload.stepResponses ?? [],
  };
}

export function isValidSession(payload: SessionPayload) {
  return (
    typeof payload.techniqueId === 'string' &&
    payload.techniqueId.length > 0 &&
    payload.techniqueCategory !== undefined &&
    typeof payload.startedAt === 'string'
  );
}
