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
    await loginPage.open();
    await loginPage.login('standard_user', 'secret_sauce');

    
    const inventoryPage = new InventoryPage(page);
    await expect(inventoryPage.title).toHaveText('Products');

    
    const mostExpensiveItem = await inventoryPage.getMostExpensiveItemName();
    await inventoryPage.addItemToCart(mostExpensiveItem);

    
    await inventoryPage.openCart();

    
    const cartPage = new CartPage(page);
    expect(await cartPage.isItemInCart(mostExpensiveItem)).toBe(true);

    
    await cartPage.goToCheckout();

    
    const checkoutStepOne = new CheckoutStepOnePage(page);
    await checkoutStepOne.fillUserInfo('Test', 'User', '12345');
    await checkoutStepOne.continueCheckout();

    
    const checkoutStepTwo = new CheckoutStepTwoPage(page);
    await checkoutStepTwo.finishCheckout();

    
    const checkoutComplete = new CheckoutCompletePage(page);
    const message = await checkoutComplete.getCompletionMessage();
    expect(message).toBe('Thank you for your order!');
  });

});