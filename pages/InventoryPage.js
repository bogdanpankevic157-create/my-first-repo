class InventoryPage {
  constructor(page) {
    this.page = page;
    this.title = page.locator('.title');
    this.cartIcon = page.locator('[data-test="shopping-cart-link"]');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.inventoryItems = page.locator('.inventory_item');
    this.addToCartButtons = page.locator('[data-test^="add-to-cart"]');
  }

  async getPageTitle() {
    return await this.title.textContent();
  }

  async sortBy(option) {
    await this.sortDropdown.selectOption(option);
  }

  async getItemPrices() {
    const prices = await this.page.locator('.inventory_item_price').allTextContents();
    return prices.map(p => parseFloat(p.replace('$', '')));
  }

  async getItemNames() {
    return await this.page.locator('.inventory_item_name').allTextContents();
  }

  async addItemToCart(itemName) {
    const item = this.page.locator(`.inventory_item:has-text("${itemName}")`);
    await item.locator('[data-test^="add-to-cart"]').click();
  }

  async openCart() {
    await this.cartIcon.click();
  }

  async getMostExpensiveItemName() {
    await this.sortBy('hilo'); 
    const names = await this.getItemNames();
    return names[0];
  }
}

module.exports = { InventoryPage };