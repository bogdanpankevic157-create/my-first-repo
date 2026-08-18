const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { InventoryPage } = require('../pages/InventoryPage');
const { CartPage } = require('../pages/CartPage');
const { CheckoutStepOnePage } = require('../pages/CheckoutStepOnePage');
const { CheckoutStepTwoPage } = require('../pages/CheckoutStepTwoPage');
const { CheckoutCompletePage } = require('../pages/CheckoutCompletePage');

test.describe('E2E: Полный цикл покупки', () => {

  test('Пользователь должен успешно купить самый дорогой товар', async ({ page }) => {
    
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutStepOne = new CheckoutStepOnePage(page);
    const checkoutStepTwo = new CheckoutStepTwoPage(page);
    const checkoutComplete = new CheckoutCompletePage(page);

    
    await loginPage.open();
    await loginPage.login('standard_user', 'secret_sauce');

    await expect(inventoryPage.title).toHaveText('Products');

    const mostExpensiveItem = await inventoryPage.getMostExpensiveItemName();
    await inventoryPage.addItemToCart(mostExpensiveItem);
    await inventoryPage.openCart();

    expect(await cartPage.isItemInCart(mostExpensiveItem)).toBe(true);
    await cartPage.goToCheckout();

    await checkoutStepOne.fillUserInfo('Test', 'User', '12345');
    await checkoutStepOne.continueCheckout();

    await checkoutStepTwo.finishCheckout();

    const message = await checkoutComplete.getCompletionMessage();
    expect(message).toBe('Thank you for your order!');
  });

});