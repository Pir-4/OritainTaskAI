import { test, expect } from "@playwright/test";
import { createSample, randomSampleData } from "../fixtures/api";
import { ResultsPage } from "../pages/ResultsPage";
import { DetailPage } from "../pages/DetailPage";

const runPrefix = `e2e_${crypto.randomUUID().replace(/-/g, "").slice(0, 8)}_`;

async function navigateToDetail(
  page: import("@playwright/test").Page,
  productName: string
): Promise<void> {
  await page.goto("/");
  await page.reload();

  const resultsPage = new ResultsPage(page);
  await resultsPage.table.waitFor({ state: "visible", timeout: 10000 });
  await resultsPage.clickViewByProductName(productName);
  await page.getByTestId("back-button").waitFor({ state: "visible", timeout: 10000 });
}

test.describe("SampleDetail (detail view)", () => {
  test("all fields are rendered in the detail view", async ({ page }) => {
    const productName = `${runPrefix}Flax`;
    const claimedOrigin = "Canada";
    await createSample({
      product_name: productName,
      claimed_origin: claimedOrigin,
      sample_data: randomSampleData(),
    });

    await navigateToDetail(page, productName);

    const detailPage = new DetailPage(page);
    await expect(detailPage.productName).toBeVisible();
    await expect(detailPage.productName).toContainText(productName);
    await expect(detailPage.claimedOrigin).toBeVisible();
    await expect(detailPage.claimedOrigin).toContainText(claimedOrigin);
    await expect(detailPage.isotopeO18).toBeVisible();
    await expect(detailPage.isotopeC13).toBeVisible();
    await expect(detailPage.traceSr).toBeVisible();
  });

  test("sample data values are displayed correctly", async ({ page }) => {
    const productName = `${runPrefix}Oat`;
    const sampleData = {
      isotope_ratio_o18: -2.85,
      isotope_ratio_c13: -25.1,
      trace_element_sr: 0.7091,
    };
    await createSample({
      product_name: productName,
      claimed_origin: "Scotland",
      sample_data: sampleData,
    });

    await navigateToDetail(page, productName);

    const detailPage = new DetailPage(page);
    await expect(detailPage.isotopeO18).toContainText(
      String(sampleData.isotope_ratio_o18)
    );
    await expect(detailPage.isotopeC13).toContainText(
      String(sampleData.isotope_ratio_c13)
    );
    await expect(detailPage.traceSr).toContainText(
      String(sampleData.trace_element_sr)
    );
  });

  test("back button returns to the list view", async ({ page }) => {
    const productName = `${runPrefix}Millet`;
    await createSample({
      product_name: productName,
      claimed_origin: "India",
      sample_data: randomSampleData(),
    });

    await navigateToDetail(page, productName);

    const detailPage = new DetailPage(page);
    await detailPage.goBack();

    await expect(page.getByTestId("samples-table")).toBeVisible({
      timeout: 10000,
    });
  });

  test("detail view shows correct data for a valid sample", async ({
    page,
  }) => {
    const productName = `${runPrefix}Quinoa`;
    const claimedOrigin = "Peru";
    await createSample({
      product_name: productName,
      claimed_origin: claimedOrigin,
      sample_data: randomSampleData(),
    });

    await navigateToDetail(page, productName);

    const detailPage = new DetailPage(page);
    await expect(detailPage.productName).toContainText(productName);
    await expect(detailPage.claimedOrigin).toContainText(claimedOrigin);
    await expect(detailPage.statusBadge).toBeVisible();
    await expect(detailPage.backButton).toBeVisible();
  });
});
