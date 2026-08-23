import { test, expect } from "@playwright/test";
import { mockApi } from "./helpers";

test.describe("Ruang Pulih smoke", () => {
  test("home page renders its hero", async ({ page }) => {
    await mockApi(page);
    await page.goto("/");

    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "Kembali ke momen sekarang, satu langkah kecil.",
      }),
    ).toBeVisible();
    await expect(page.getByText("Grounding itu apa?")).toBeVisible();
  });

  test("primary navigation reaches Library, Progress, and SOS", async ({
    page,
  }) => {
    await mockApi(page);
    await page.goto("/");

    // Sidebar: Teknik -> /library
    await page.getByRole("link", { name: "Teknik" }).click();
    await expect(page).toHaveURL(/\/library$/);
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "Pilih latihan yang paling mudah dimulai.",
      }),
    ).toBeVisible();

    // Sidebar: Progres -> /progress
    await page.getByRole("link", { name: "Progres" }).click();
    await expect(page).toHaveURL(/\/progress$/);
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "Lihat pola latihan dari perangkat ini.",
      }),
    ).toBeVisible();

    // Sidebar SOS card -> /sos
    await page.getByRole("link", { name: "Buka mode SOS" }).click();
    await expect(page).toHaveURL(/\/sos$/);
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "Kamu sedang mencoba kembali hadir.",
      }),
    ).toBeVisible();
  });
});
