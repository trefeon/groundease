const VALID_CATEGORIES = [
  'kegunaan',
  'tampilan',
  'teknik',
  'saran',
  'bug',
  'lainnya',
] as const;

export type FeedbackCategory = (typeof VALID_CATEGORIES)[number];

export type FeedbackPayload = {
  rating?: number;
  category?: string;
  message?: string;
  sourcePage?: string;
};

export function isValidFeedback(payload: FeedbackPayload): boolean {
  if (typeof payload.rating !== 'number' || payload.rating < 1 || payload.rating > 5) {
    return false;
  }
  if (
    typeof payload.category !== 'string' ||
    !VALID_CATEGORIES.includes(payload.category as FeedbackCategory)
  ) {
    return false;
  }
  if (payload.message !== undefined && typeof payload.message !== 'string') {
    return false;
  }
  return true;
}

export function normalizeFeedback(payload: FeedbackPayload, userAgent: string) {
  return {
    rating: payload.rating,
    category: payload.category,
    message: (payload.message ?? '').slice(0, 2000),
    sourcePage: payload.sourcePage ?? 'unknown',
    userAgent,
  };
}
