import { type Page, type Locator } from "@playwright/test";

export class DetailPage {
  readonly page: Page;
  readonly species: Locator;
  readonly originCountry: Locator;
  readonly collectedAt: Locator;
  readonly statusBadge: Locator;
  readonly backButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.species = page.getByTestId("detail-species");
    this.originCountry = page.getByTestId("detail-origin-country");
    this.collectedAt = page.getByTestId("detail-collected-at");
    this.statusBadge = page.getByTestId("sample-status");
    this.backButton = page.getByTestId("back-button");
  }

  async goBack(): Promise<void> {
    await this.backButton.click();
  }
}
