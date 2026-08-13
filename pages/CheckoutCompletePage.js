class CheckoutCompletePage {
  constructor(page) {
    this.page = page;
    this.completionHeader = page.locator('.complete-header');
    this.backHomeButton = page.locator('[data-test="back-to-products"]');
  }

  async getCompletionMessage() {
    return await this.completionHeader.textContent();
  }
}

module.exports = { CheckoutCompletePage };