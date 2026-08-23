import type { Page } from "@playwright/test";

/** Minimal valid rows for GET /api/feedback (admin list). */
export const FEEDBACK_ITEMS = [
  {
    _id: "fb-1",
    rating: 5,
    category: "bug",
    message: "Halaman SOS muncul cepat.",
    sourcePage: "sos-page",
    userAgent: "playwright-test",
    createdAt: "2026-08-20T09:15:00.000Z",
  },
  {
    _id: "fb-2",
    rating: 4,
    category: "saran",
    message: "Tambahkan mode gelap otomatis.",
    sourcePage: "settings-page",
    userAgent: "playwright-test",
    createdAt: "2026-08-21T14:30:00.000Z",
  },
];

/** Shape expected by AdminFeedbackPage (`statsData.data`). */
export const FEEDBACK_STATS = {
  total: 2,
  averageRating: 4.5,
  byCategory: { bug: 1, saran: 1 },
};

type PostCapture = (body: Record<string, unknown>) => void;

/**
 * Mocks every network call under /api so pages render without the backend.
 * Register before page.goto.
 */
export async function mockApi(page: Page, onFeedbackPost?: PostCapture) {
  await page.route("**/api/**", async (route) => {
    const req = route.request();
    const { pathname } = new URL(req.url());

    // POST /api/feedback — FeedbackForm submit
    if (req.method() === "POST" && pathname.endsWith("/api/feedback")) {
      onFeedbackPost?.(req.postDataJSON() ?? {});
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: { acknowledged: true, insertedId: "fb-e2e" },
          persistence: "memory",
        }),
      });
      return;
    }

    // GET /api/feedback/stats?key=... — admin login probe + dashboard stats
    if (pathname.endsWith("/api/feedback/stats")) {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ data: FEEDBACK_STATS, persistence: "memory" }),
      });
      return;
    }

    // GET /api/feedback?key=...&limit=...[&category=...] — admin list
    if (pathname.endsWith("/api/feedback")) {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: FEEDBACK_ITEMS,
          total: FEEDBACK_ITEMS.length,
        }),
      });
      return;
    }

    // Unknown endpoint: harmless empty JSON array.
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([]),
    });
  });
}
