import { type Page, type Locator } from "@playwright/test";
import type { SampleData } from "../fixtures/api";

export class SubmitPage {
  readonly page: Page;
  readonly productNameInput: Locator;
  readonly claimedOriginInput: Locator;
  readonly isotopeO18Input: Locator;
  readonly isotopeC13Input: Locator;
  readonly traceSrInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productNameInput = page.getByTestId("input-product-name");
    this.claimedOriginInput = page.getByTestId("input-claimed-origin");
    this.isotopeO18Input = page.getByTestId("input-isotope-o18");
    this.isotopeC13Input = page.getByTestId("input-isotope-c13");
    this.traceSrInput = page.getByTestId("input-trace-sr");
    this.submitButton = page.getByTestId("submit-button");
    this.errorMessage = page.getByRole("alert");
  }

  async fillAndSubmit(
    productName: string,
    claimedOrigin: string,
    sampleData?: SampleData
  ): Promise<void> {
    if (productName) {
      await this.productNameInput.fill(productName);
    }
    if (claimedOrigin) {
      await this.claimedOriginInput.fill(claimedOrigin);
    }
    const sd = sampleData ?? {
      isotope_ratio_o18: -2.85,
      isotope_ratio_c13: -25.1,
      trace_element_sr: 0.7091,
    };
    await this.isotopeO18Input.fill(String(sd.isotope_ratio_o18));
    await this.isotopeC13Input.fill(String(sd.isotope_ratio_c13));
    await this.traceSrInput.fill(String(sd.trace_element_sr));
    await this.submitButton.click();
  }
}
