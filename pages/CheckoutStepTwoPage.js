class CheckoutStepTwoPage {
  constructor(page) {
    this.page = page;
    this.finishButton = page.locator('[data-test="finish"]');
    this.totalLabel = page.locator('.summary_total_label');
  }

  async finishCheckout() {
    await this.finishButton.click();
  }

  async getTotal() {
    return this.totalLabel.textContent();
  }
}

module.exports = { CheckoutStepTwoPage };