# User flows — Ruang Pulih

## 1. Entry points

| Entry Point         | Route/Trigger           | Auth Required | Landing Screen            |
| :------------------ | :---------------------- | :------------ | :------------------------ |
| Direct URL / Root   | `/`                     | No            | Home Page                 |
| Crisis / Quick Help | `/sos`                  | No            | SOS Page                  |
| Browse Techniques   | `/library`              | No            | Library Page              |
| Session Link        | `/session/:techniqueId` | No            | Session Page (Prep phase) |
| Progress Check      | `/progress`             | No            | Progress Page             |
| User Preferences    | `/settings`             | No            | Settings Page             |
| Feedback Page       | `/feedback`             | No            | Feedback Page             |
| Admin Feedback      | `/admin/feedback`       | Admin key     | Admin Review Page         |

## 2. Authentication flow

> [!NOTE]
> Ruang Pulih currently operates as a **local-first, public-access utility**. There is no server-side authentication layer or account management implemented in the current version.

| Flow           | Status | Description                                                                  |
| :------------- | :----- | :--------------------------------------------------------------------------- |
| New User       | Active | Lands on Home/Library; data starts persisting to `localStorage` immediately. |
| Returning User | Active | Data is retrieved from `localStorage` on load.                               |
| Password Reset | N/A    | Not implemented (no accounts).                                               |
| OAuth          | N/A    | Not implemented.                                                             |

## 3. Core user journey (Happy Path)

The primary flow for a user to complete a grounding session:

1. **[Home Page]** — User arrives and sees "Start Session" or "Emergency Help".
2. **[Navigate to Library]** — User clicks "Start Session" and lands on the Library Page.
3. **[Select Technique]** — User browses grounding techniques (e.g., 5-4-3-2-1) and clicks "Mulai" (Start).
4. **[Session Page: Prepare]** — User sees technique overview and estimated time. Clicks "Mulai Sesi".
5. **[Session Page: Pre-Assessment]** — User rates current anxiety level on a scale. Clicks "Lanjutkan".
6. **[Session Page: Practice]** — User follows guided steps (animations + instructions). Clicks "Next" through all steps.
7. **[Session Page: Post-Assessment]** — User rates anxiety level again after completion. Clicks "Selesai".
8. **[Session Complete Page]** — System saves session to `localStorage`. User sees success message, stats (e.g., "-20% anxiety"), and a quote.
9. **[Return]** — User clicks "Kembali ke Beranda" or "Lihat Progress".

## 4. Feature flows

### A. Library & Search

- **Happy Path**: User enters text in search bar -> Results filter in real-time -> User selects a technique.
- **Edge Case**: No results found -> "Tidak ada teknik yang ditemukan" empty state renders.

### B. Progress Tracking

- **Current State**: Reads real session data persisted in `localStorage` via `getSessions()` (`src/services/storage.ts`) + `buildProgressViewModel()` (`src/logic/progress.ts`).
- **Logic**: Renders count-up stats, streaks, and anxiety reduction; tapping a session opens a BottomSheetDrawer with the session detail.

### C. SOS / Emergency Help

- **Happy Path**: User clicks SOS -> Lands on a simplified, high-contrast page with immediate grounding instructions (Affirmation + Quick 4-7-8 Breathing).

### D. Feedback & Admin Review

- **User Path**: Feedback CTA on Session Complete / Settings -> `/feedback` -> `FeedbackForm` with category chips (kegunaan, tampilan, teknik, saran, bug, lainnya) -> POST `/api/feedback` -> confirmation shown.
- **Admin Path**: `/admin/feedback` -> enter admin key -> stats + feedback list -> CSV export.

## 5. Exit points

| Exit Point         | Trigger                    | Result                           |
| :----------------- | :------------------------- | :------------------------------- |
| Session Completion | Click "Kembali ke Beranda" | Redirects to `/`.                |
| Browser Close      | User closes tab            | Data remains in `localStorage`.  |
| Manual Reset       | (Future feature)           | Not currently implemented in UI. |

## 6. Screen inventory

| Screen Name          | Route                   | Auth      | Main Action         | Next Screens                    |
| :------------------- | :---------------------- | :-------- | :------------------ | :------------------------------ |
| **Home**             | `/`                     | No        | Start Session / SOS | Library, SOS                    |
| **Library**          | `/library`              | No        | Select Technique    | Session, Progress, Settings     |
| **SOS**              | `/sos`                  | No        | Immediate Grounding | Home                            |
| **Session**          | `/session/:techniqueId` | No        | Perform Steps       | Session Complete, Home (Cancel) |
| **Session Complete** | `/session-complete`     | No        | View Results        | Home, Progress                  |
| **Progress**         | `/progress`             | No        | View History        | Library, Settings               |
| **Settings**         | `/settings`             | No        | Toggle Preferences  | Library, Progress               |
| **Feedback**         | `/feedback`             | No        | Submit Feedback     | Home, Settings                  |
| **Admin Feedback**   | `/admin/feedback`       | Admin key | Review + Export CSV | None                            |

---

_Last updated: 2026-08-06_
