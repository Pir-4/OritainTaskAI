import { test, expect } from "@playwright/test";
import { SubmitPage } from "../pages/SubmitPage";

const runPrefix = `e2e_${crypto.randomUUID().replace(/-/g, "").slice(0, 8)}_`;

test.describe("SubmitForm", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("nav-submit").click();
  });

  test("happy path — fill product name + origin and submit navigates to detail view", async ({
    page,
  }) => {
    const submitPage = new SubmitPage(page);
    const productName = `${runPrefix}Manuka Honey`;
    const claimedOrigin = "New Zealand";

    await submitPage.fillAndSubmit(productName, claimedOrigin);

    await expect(page.getByTestId("back-button")).toBeVisible({
      timeout: 10000,
    });
  });

  test("detail shows isotope values after submit", async ({ page }) => {
    const submitPage = new SubmitPage(page);
    const productName = `${runPrefix}Olive Oil`;
    const claimedOrigin = "Italy";

    await submitPage.fillAndSubmit(productName, claimedOrigin, {
      isotope_ratio_o18: -2.85,
      isotope_ratio_c13: -25.1,
      trace_element_sr: 0.7091,
    });

    await expect(page.getByTestId("back-button")).toBeVisible({
      timeout: 10000,
    });

    await expect(page.getByTestId("detail-isotope-o18")).toBeVisible();
    await expect(page.getByTestId("detail-isotope-c13")).toBeVisible();
    await expect(page.getByTestId("detail-trace-sr")).toBeVisible();
  });

  test("empty product name — form does not navigate away (browser required validation)", async ({
    page,
  }) => {
    const submitPage = new SubmitPage(page);

    await submitPage.claimedOriginInput.fill("Canada");
    await submitPage.isotopeO18Input.fill("-2.85");
    await submitPage.isotopeC13Input.fill("-25.1");
    await submitPage.traceSrInput.fill("0.7091");
    await submitPage.submitButton.click();

    // Browser required validation prevents submission — submit button stays visible
    await expect(submitPage.submitButton).toBeVisible();
  });

  test("empty claimed origin — form does not navigate away (browser required validation)", async ({
    page,
  }) => {
    const submitPage = new SubmitPage(page);

    await submitPage.productNameInput.fill(`${runPrefix}Cotton`);
    await submitPage.isotopeO18Input.fill("-2.85");
    await submitPage.isotopeC13Input.fill("-25.1");
    await submitPage.traceSrInput.fill("0.7091");
    await submitPage.submitButton.click();

    // Browser required validation prevents submission — submit button stays visible
    await expect(submitPage.submitButton).toBeVisible();
  });
});
