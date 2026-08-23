import { test, expect } from "@playwright/test";
import { mockApi } from "./helpers";

test.describe("Somatic body scan accessibility", () => {
  test("region buttons expose aria-pressed selection state", async ({
    page,
  }) => {
    await mockApi(page);

    // SomaticBodyScan mounts on the Library page.
    await page.goto("/library");

    const jaw = page.getByRole("button", { name: "Rahang & Wajah" });
    await expect(jaw).toBeVisible();
    // The first region starts selected.
    await expect(jaw).toHaveAttribute("aria-pressed", "true");

    // Select a different region.
    const shoulders = page.getByRole("button", { name: "Bahu & Leher" });
    await shoulders.click();

    // The clicked region becomes pressed; others stay/re-become unpressed.
    await expect(shoulders).toHaveAttribute("aria-pressed", "true");
    await expect(jaw).toHaveAttribute("aria-pressed", "false");
    await expect(
      page.getByRole("button", { name: "Tangan & Kaki" }),
    ).toHaveAttribute("aria-pressed", "false");

    // Detail panel follows the selection.
    await expect(
      page.getByRole("heading", { name: "Bahu & Leher" }),
    ).toBeVisible();
  });
});
