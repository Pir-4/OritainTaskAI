import { type Page, type Locator, expect } from "@playwright/test";

export class ResultsPage {
  readonly page: Page;
  readonly table: Locator;
  readonly rows: Locator;

  constructor(page: Page) {
    this.page = page;
    this.table = page.getByTestId("samples-table");
    this.rows = page.getByTestId("sample-row");
  }

  async waitForRows(minCount: number): Promise<void> {
    await expect(this.rows).toHaveCount(minCount, { timeout: 10000 });
  }

  async clickViewBySpecies(species: string): Promise<void> {
    const row = this.page
      .getByTestId("sample-row")
      .filter({ hasText: species });
    await row.getByRole("button", { name: "View" }).click();
  }
}
