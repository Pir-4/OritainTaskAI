import { type Page, type Locator } from "@playwright/test";

export class SubmitPage {
  readonly page: Page;
  readonly speciesInput: Locator;
  readonly originCountryInput: Locator;
  readonly collectedAtInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.speciesInput = page.getByTestId("input-species");
    this.originCountryInput = page.getByTestId("input-origin-country");
    this.collectedAtInput = page.getByTestId("input-collected-at");
    this.submitButton = page.getByTestId("submit-button");
    this.errorMessage = page.getByRole("alert");
  }

  async fillAndSubmit(
    species: string,
    country: string,
    collectedAt?: string
  ): Promise<void> {
    if (species) {
      await this.speciesInput.fill(species);
    }
    if (country) {
      await this.originCountryInput.fill(country);
    }
    if (collectedAt) {
      await this.collectedAtInput.fill(collectedAt);
    }
    await this.submitButton.click();
  }
}
