import { test, expect } from "@playwright/test";
import { createSample } from "../fixtures/api";
import { ResultsPage } from "../pages/ResultsPage";
import { DetailPage } from "../pages/DetailPage";

const runPrefix = `e2e_${crypto.randomUUID().replace(/-/g, "").slice(0, 8)}_`;

async function navigateToDetail(
  page: import("@playwright/test").Page,
  species: string
): Promise<void> {
  await page.goto("/");
  await page.reload();

  const resultsPage = new ResultsPage(page);
  await resultsPage.table.waitFor({ state: "visible", timeout: 10000 });
  await resultsPage.clickViewBySpecies(species);
  await page.getByTestId("back-button").waitFor({ state: "visible", timeout: 10000 });
}

test.describe("SampleDetail (detail view)", () => {
  test("all fields are rendered in the detail view", async ({ page }) => {
    const species = `${runPrefix}Flax`;
    const country = "Canada";
    await createSample({ species, origin_country: country });

    await navigateToDetail(page, species);

    const detailPage = new DetailPage(page);
    await expect(detailPage.species).toBeVisible();
    await expect(detailPage.species).toContainText(species);
    await expect(detailPage.originCountry).toBeVisible();
    await expect(detailPage.originCountry).toContainText(country);
  });

  test("collected_at is shown when present and not displayed as dash", async ({
    page,
  }) => {
    const species = `${runPrefix}Oat`;
    await createSample({
      species,
      origin_country: "Scotland",
      collected_at: "2025-03-01T08:00:00",
    });

    await navigateToDetail(page, species);

    const detailPage = new DetailPage(page);
    await expect(detailPage.collectedAt).toBeVisible();
    await expect(detailPage.collectedAt).not.toHaveText("—");
  });

  test("collected_at shows dash when null", async ({ page }) => {
    const species = `${runPrefix}Rye`;
    await createSample({ species, origin_country: "Germany" });

    await navigateToDetail(page, species);

    const detailPage = new DetailPage(page);
    await expect(detailPage.collectedAt).toBeVisible();
    await expect(detailPage.collectedAt).toHaveText("—");
  });

  test("back button returns to the list view", async ({ page }) => {
    const species = `${runPrefix}Millet`;
    await createSample({ species, origin_country: "India" });

    await navigateToDetail(page, species);

    const detailPage = new DetailPage(page);
    await detailPage.goBack();

    await expect(page.getByTestId("samples-table")).toBeVisible({
      timeout: 10000,
    });
  });

  test("detail view shows correct data for a valid sample", async ({
    page,
  }) => {
    const species = `${runPrefix}Quinoa`;
    const country = "Peru";
    await createSample({ species, origin_country: country });

    await navigateToDetail(page, species);

    const detailPage = new DetailPage(page);
    await expect(detailPage.species).toContainText(species);
    await expect(detailPage.originCountry).toContainText(country);
    await expect(detailPage.statusBadge).toBeVisible();
    await expect(detailPage.backButton).toBeVisible();
  });
});
