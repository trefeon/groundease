import type { Request, Response } from 'express';
import { hasDatabaseConnection } from '../services/database';
import Feedback from '../types/Feedback.model';
import {
  type FeedbackPayload,
  isValidFeedback,
  normalizeFeedback,
} from '../config/validation/feedback';

const memoryFeedback: ReturnType<typeof normalizeFeedback>[] = [];

const ADMIN_KEY = process.env.FEEDBACK_ADMIN_KEY || 'cekfeedback';

function isAuthorized(req: Request): boolean {
  return req.query.key === ADMIN_KEY;
}

/** POST /api/feedback — publik, tanpa auth */
export async function createFeedback(req: Request, res: Response) {
  const payload = req.body as FeedbackPayload;

  if (!isValidFeedback(payload)) {
    return res.status(400).json({
      message:
        'Feedback tidak valid. Rating (1-5) dan kategori wajib diisi.',
    });
  }

  const userAgent = req.headers['user-agent'] ?? '';
  const normalized = normalizeFeedback(payload, userAgent);

  if (!hasDatabaseConnection()) {
    memoryFeedback.unshift(normalized);
    return res.status(201).json({ data: normalized, persistence: 'memory' });
  }

  const feedback = await Feedback.create(normalized);
  return res.status(201).json({ data: feedback, persistence: 'mongodb' });
}

/** GET /api/feedback — butuh ?key=SECRET */
export async function listFeedback(req: Request, res: Response) {
  if (!isAuthorized(req)) {
    return res.status(401).json({ message: 'Kunci admin tidak valid.' });
  }

  const limit = Math.min(Number(req.query.limit) || 100, 500);
  const category = req.query.category as string | undefined;

  if (!hasDatabaseConnection()) {
    let data = memoryFeedback;
    if (category) {
      data = data.filter((f) => f.category === category);
    }
    return res.json({
      data: data.slice(0, limit),
      total: data.length,
      persistence: 'memory',
    });
  }

  const filter = category ? { category } : {};
  const [data, total] = await Promise.all([
    Feedback.find(filter).sort({ createdAt: -1 }).limit(limit).lean(),
    Feedback.countDocuments(filter),
  ]);

  return res.json({ data, total, persistence: 'mongodb' });
}

/** GET /api/feedback/stats — butuh ?key=SECRET */
export async function getFeedbackStats(req: Request, res: Response) {
  if (!isAuthorized(req)) {
    return res.status(401).json({ message: 'Kunci admin tidak valid.' });
  }

  if (!hasDatabaseConnection()) {
    const stats = computeStats(memoryFeedback);
    return res.json({ data: stats, persistence: 'memory' });
  }

  const allFeedback = (await Feedback.find().lean()) as Array<{
    rating: number;
    category: string;
    createdAt: Date;
  }>;
  const stats = computeStats(allFeedback);
  return res.json({ data: stats, persistence: 'mongodb' });
}

function computeStats(
  items: Array<{ rating?: number; category?: string }>,
) {
  const total = items.length;
  if (total === 0) {
    return { total: 0, averageRating: 0, byCategory: {} };
  }

  const sumRating = items.reduce((sum, f) => sum + (f.rating ?? 0), 0);
  const byCategory: Record<string, number> = {};
  for (const f of items) {
    const cat = f.category ?? 'lainnya';
    byCategory[cat] = (byCategory[cat] ?? 0) + 1;
  }

  return {
    total,
    averageRating: Math.round((sumRating / total) * 10) / 10,
    byCategory,
  };
}
