import type { Request, Response } from 'express';
import { hasDatabaseConnection } from '../services/database';
import GroundingSession from '../types/GroundingSession.model';
import { summarizeSessions } from '../logic/session-summary';
import { type SessionPayload, isValidSession, normalizeSession } from '../config/validation/session';

const memorySessions: SessionPayload[] = [];

export async function createSession(req: Request, res: Response) {
  const payload = req.body as SessionPayload;

  if (!isValidSession(payload)) {
    return res.status(400).json({
      message:
        'Payload session tidak valid. techniqueId, techniqueCategory, dan startedAt wajib diisi.',
    });
  }

  if (!hasDatabaseConnection()) {
    memorySessions.unshift(payload);
    return res.status(201).json({ data: payload, persistence: 'memory' });
  }

  const session = await GroundingSession.create(normalizeSession(payload));
  return res.status(201).json({ data: session, persistence: 'mongodb' });
}

export async function listSessions(req: Request, res: Response) {
  const limit = Math.min(Number(req.query.limit) || 20, 100);

  if (!hasDatabaseConnection()) {
    return res.json({
      data: memorySessions.slice(0, limit),
      persistence: 'memory',
    });
  }

  const sessions = await GroundingSession.find().sort({ startedAt: -1 }).limit(limit);

  return res.json({ data: sessions, persistence: 'mongodb' });
}

export async function getSessionSummary(_req: Request, res: Response) {
  if (!hasDatabaseConnection()) {
    return res.json({
      data: summarizeSessions(memorySessions),
      persistence: 'memory',
    });
  }

  const sessions = (await GroundingSession.find().lean()) as SessionPayload[];
  return res.json({
    data: summarizeSessions(sessions),
    persistence: 'mongodb',
  });
}

