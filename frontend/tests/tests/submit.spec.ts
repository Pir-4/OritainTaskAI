import { test, expect } from "@playwright/test";
import { SubmitPage } from "../pages/SubmitPage";

const runPrefix = `e2e_${crypto.randomUUID().replace(/-/g, "").slice(0, 8)}_`;

test.describe("SubmitForm", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("nav-submit").click();
  });

  test("happy path — fill species + country and submit navigates to detail view", async ({
    page,
  }) => {
    const submitPage = new SubmitPage(page);
    const species = `${runPrefix}Wheat`;
    const country = "New Zealand";

    await submitPage.fillAndSubmit(species, country);

    await expect(page.getByTestId("back-button")).toBeVisible({
      timeout: 10000,
    });
  });

  test("submit with collected_at — detail shows a date value, not dash", async ({
    page,
  }) => {
    const submitPage = new SubmitPage(page);
    const species = `${runPrefix}Barley`;
    const country = "Australia";
    const collectedAt = "2025-06-15T10:30";

    await submitPage.fillAndSubmit(species, country, collectedAt);

    await expect(page.getByTestId("back-button")).toBeVisible({
      timeout: 10000,
    });

    const collectedAtEl = page.getByTestId("detail-collected-at");
    await expect(collectedAtEl).toBeVisible();
    await expect(collectedAtEl).not.toHaveText("—");
  });

  test("empty species — form does not navigate away (browser required validation)", async ({
    page,
  }) => {
    const submitPage = new SubmitPage(page);

    await submitPage.originCountryInput.fill("Canada");
    await submitPage.submitButton.click();

    // Browser required validation prevents submission — submit button stays visible
    await expect(submitPage.submitButton).toBeVisible();
  });

  test("empty origin_country — form does not navigate away (browser required validation)", async ({
    page,
  }) => {
    const submitPage = new SubmitPage(page);

    await submitPage.speciesInput.fill(`${runPrefix}Cotton`);
    await submitPage.submitButton.click();

    // Browser required validation prevents submission — submit button stays visible
    await expect(submitPage.submitButton).toBeVisible();
  });
});
