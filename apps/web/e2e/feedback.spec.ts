import { test, expect } from "@playwright/test";
import { mockApi } from "./helpers";

test.describe("Feedback form", () => {
  test("label association, toggle state, and successful submission", async ({
    page,
  }) => {
    let postedBody: Record<string, unknown> | undefined;
    await mockApi(page, (body) => {
      postedBody = body;
    });

    await page.goto("/feedback");

    // The textarea is reachable through its <label htmlFor> association.
    const message = page.getByLabel("Pesan (opsional)");
    await expect(message).toBeVisible();

    // Star rating: pick 4 stars; the selected-value hint appears.
    const fourStars = page.getByRole("button", { name: "4 bintang — Bagus" });
    await fourStars.click();
    await expect(page.getByText("Bagus", { exact: true })).toBeVisible();
    // NOTE: star buttons expose no aria-pressed/state attribute (source gap,
    // reported) — selection is only observable via the value-hint text.

    // Category buttons expose aria-pressed.
    const bugChip = page.getByRole("button", { name: "Bug", exact: true });
    await bugChip.click();
    await expect(bugChip).toHaveAttribute("aria-pressed", "true");
    await expect(
      page.getByRole("button", { name: "Kegunaan", exact: true }),
    ).toHaveAttribute("aria-pressed", "false");

    await message.fill("Navigasi terasa mulai.");

    // Submit is gated on rating + category being chosen.
    const submit = page.getByRole("button", { name: "Kirim Masukan" });
    await expect(submit).toBeEnabled();
    await submit.click();

    // Success branch of FeedbackForm replaces the form.
    await expect(page.getByText("Masukan berhasil dikirim")).toBeVisible();

    // The POST payload matches what the user picked.
    expect(postedBody).toEqual({
      rating: 4,
      category: "bug",
      message: "Navigasi terasa mulai.",
      sourcePage: "feedback-page",
    });
  });
});
