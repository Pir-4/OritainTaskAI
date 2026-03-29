import { test, expect } from "@playwright/test";
import { createSample } from "../fixtures/api";
import { ResultsPage } from "../pages/ResultsPage";

const runPrefix = `e2e_${crypto.randomUUID().replace(/-/g, "").slice(0, 8)}_`;

test.describe("SampleTable (results / list view)", () => {
  let speciesA: string;
  let speciesB: string;

  test.beforeEach(async ({ page }) => {
    speciesA = `${runPrefix}Soy`;
    speciesB = `${runPrefix}Rice`;

    await createSample({ species: speciesA, origin_country: "Brazil" });
    await createSample({ species: speciesB, origin_country: "Japan" });

    await page.goto("/");
  });

  test("both created samples appear in the table", async ({ page }) => {
    const resultsPage = new ResultsPage(page);

    await resultsPage.table.waitFor({ state: "visible", timeout: 10000 });

    // Reload to ensure data is current after API inserts
    await page.reload();
    await resultsPage.table.waitFor({ state: "visible", timeout: 10000 });

    const rows = resultsPage.rows;
    const count = await rows.count();
    expect(count).toBeGreaterThanOrEqual(2);

    await expect(page.getByText(speciesA)).toBeVisible();
    await expect(page.getByText(speciesB)).toBeVisible();
  });

  test("required column headers are present", async ({ page }) => {
    const resultsPage = new ResultsPage(page);
    await resultsPage.table.waitFor({ state: "visible", timeout: 10000 });

    const table = resultsPage.table;
    await expect(table.getByRole("columnheader", { name: "ID" })).toBeVisible();
    await expect(
      table.getByRole("columnheader", { name: "Species" })
    ).toBeVisible();
    await expect(
      table.getByRole("columnheader", { name: "Origin Country" })
    ).toBeVisible();
    await expect(
      table.getByRole("columnheader", { name: "Status" })
    ).toBeVisible();
    await expect(
      table.getByRole("columnheader", { name: "Created At" })
    ).toBeVisible();
  });

  test("clicking View on a row navigates to the detail view", async ({
    page,
  }) => {
    const resultsPage = new ResultsPage(page);
    await resultsPage.table.waitFor({ state: "visible", timeout: 10000 });

    await page.reload();
    await resultsPage.table.waitFor({ state: "visible", timeout: 10000 });

    await resultsPage.clickViewBySpecies(speciesA);

    await expect(page.getByTestId("back-button")).toBeVisible({
      timeout: 10000,
    });
  });
});
