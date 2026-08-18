class CartPage {
  constructor(page) {
    this.page = page;
    this.cartItems = page.locator('.cart_item');
    this.cartItemNames = page.locator('.inventory_item_name');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
  }

  async getCartItemNames() {
    return  this.cartItemNames.allTextContents();
  }

  async goToCheckout() {
    await this.checkoutButton.click();
  }

  async isItemInCart(itemName) {
    const names = await this.getCartItemNames();
    return names.includes(itemName);
  }
}

module.exports = { CartPage };