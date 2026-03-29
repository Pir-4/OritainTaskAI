import { type Page, type Locator } from "@playwright/test";

export class DetailPage {
  readonly page: Page;
  readonly productName: Locator;
  readonly claimedOrigin: Locator;
  readonly isotopeO18: Locator;
  readonly isotopeC13: Locator;
  readonly traceSr: Locator;
  readonly statusBadge: Locator;
  readonly backButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productName = page.getByTestId("detail-product-name");
    this.claimedOrigin = page.getByTestId("detail-claimed-origin");
    this.isotopeO18 = page.getByTestId("detail-isotope-o18");
    this.isotopeC13 = page.getByTestId("detail-isotope-c13");
    this.traceSr = page.getByTestId("detail-trace-sr");
    this.statusBadge = page.getByTestId("sample-status");
    this.backButton = page.getByTestId("back-button");
  }

  async goBack(): Promise<void> {
    await this.backButton.click();
  }
}
