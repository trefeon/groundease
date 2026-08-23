import type { Request, Response } from 'express';
import { hasDatabaseConnection } from '../services/database';
import AnxietyAssessment from '../types/AnxietyAssessment.model';
import { type AssessmentPayload, isValidAssessment, normalizeAssessment } from '../config/validation/assessment';

const memoryAssessments: AssessmentPayload[] = [];

export async function createAssessment(req: Request, res: Response) {
  const payload = req.body as AssessmentPayload;

  if (!isValidAssessment(payload)) {
    return res.status(400).json({
      message: 'Payload assessment tidak valid. score 0-10 dan context wajib diisi.',
    });
  }

  if (!hasDatabaseConnection()) {
    memoryAssessments.unshift(payload);
    return res.status(201).json({ data: payload, persistence: 'memory' });
  }

  const assessment = await AnxietyAssessment.create(normalizeAssessment(payload));
  return res.status(201).json({ data: assessment, persistence: 'mongodb' });
}

export async function listAssessments(req: Request, res: Response) {
  const limit = Math.min(Number(req.query.limit) || 20, 100);

  if (!hasDatabaseConnection()) {
    return res.json({
      data: memoryAssessments.slice(0, limit),
      persistence: 'memory',
    });
  }

  const assessments = await AnxietyAssessment.find().sort({ timestamp: -1 }).limit(limit);

  return res.json({ data: assessments, persistence: 'mongodb' });
}

