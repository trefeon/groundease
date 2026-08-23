import { test, expect } from "@playwright/test";
import { mockApi } from "./helpers";

test.describe("Admin feedback dashboard focus", () => {
  test("filter chips are keyboard reachable and show a visible focus ring", async ({
    page,
  }) => {
    await mockApi(page);

    await page.goto("/admin/feedback");

    // Login gate (CardTitle is a styled div, not a heading element).
    await expect(page.getByText("Admin Feedback")).toBeVisible();
    await page.getByLabel("Kunci Admin").fill("kunci-rahasia-e2e");
    await page.getByRole("button", { name: "Masuk" }).click();

    await expect(
      page.getByRole("heading", { level: 1, name: "Dashboard Feedback" }),
    ).toBeVisible();

    const semuaChip = page.getByRole("button", { name: "Semua", exact: true });
    await expect(semuaChip).toBeVisible();

    // Reach the first filter chip with the keyboard only.
    for (let tabs = 0; tabs < 10; tabs++) {
      const focused = await semuaChip.evaluate(
        (el) => el === document.activeElement,
      );
      if (focused) break;
      await page.keyboard.press("Tab");
    }
    await expect(semuaChip).toBeFocused();

    // Keyboard focus must surface the focus-visible ring
    // (Tailwind ring utilities compose into box-shadow).
    const shadow = await semuaChip.evaluate(
      (el) => getComputedStyle(el).boxShadow,
    );
    expect(shadow).not.toBe("none");

    // Activating a chip filters and reflects toggle state.
    const bugChip = page.getByRole("button", { name: /Bug/ });
    await bugChip.click();
    await expect(bugChip).toHaveAttribute("aria-pressed", "true");
    await expect(semuaChip).toHaveAttribute("aria-pressed", "false");
  });
});
