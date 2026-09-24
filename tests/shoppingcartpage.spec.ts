import { meta } from 'reporting-labs';
import { test, expect } from '../src/fixtures/pagefixtures';

test.beforeEach(async ({ loginPage }) => { //page is inbuilt fixture
    await loginPage.goToLoginPage();
    await loginPage.doLogin(process.env.APP_USERNAME!, process.env.PASSWORD!);
});

test('verify cart page header', async ({ homePage, searchResultsPage, productInfoPage, shoppingCartPage }) => {
    meta({ priority: 'P2', severity: 'minor', owner: 'Shraddha_sc', story: 'US601', epic: 'ep201', feature: 'F20' });

    await homePage.doSearch('macbook');
    await searchResultsPage.selectProduct('MacBook Pro');
    await productInfoPage.addProductToCart(2);
    await productInfoPage.goToShoppingCartPage();
    expect(await shoppingCartPage.getShoppingCartPageHeader()).toContain('Shopping Cart');
})


test('Verify added product is displayed in the shopping cart', async ({ homePage, searchResultsPage, productInfoPage, shoppingCartPage }) => {
    meta({ priority: 'P2', severity: 'minor', owner: 'Shraddha_sc', story: 'US602', epic: 'ep201', feature: 'F20' });
    await homePage.doSearch('macbook');
    await searchResultsPage.selectProduct('MacBook Pro');
    await productInfoPage.addProductToCart(2);
    await productInfoPage.goToShoppingCartPage();
    expect.soft(await shoppingCartPage.isCartTableVisible()).toBeTruthy();
    expect.soft(await shoppingCartPage.getProductInCart('MacBook Pro')).toBeVisible();
})

test('Verify quantity of the added product is displayed correctly in the shopping cart', async ({ homePage, searchResultsPage, productInfoPage, shoppingCartPage, page }) => {
    meta({ priority: 'P2', severity: 'minor', owner: 'Shraddha_sc', story: 'US603', epic: 'ep201', feature: 'F20' });
    await homePage.doSearch('macbook');
    await searchResultsPage.selectProduct('MacBook Pro');
    await productInfoPage.addProductToCart(2);
    await productInfoPage.goToShoppingCartPage();
    expect.soft(await shoppingCartPage.isCartTableVisible()).toBeTruthy();
    expect.soft(await shoppingCartPage.getProductQuantity()).toBe("2");
    await page.pause();
})


//common features test:
test('App logo exists on Login Page', async ({ basePage }) => {
    meta({ priority: 'P2', severity: 'minor', owner: 'Shraddha_sc', story: 'US604', epic: 'ep201', feature: 'F20' });
    expect(await basePage.isLogoVisible()).toBeTruthy();
})

test('Search Box exists on Login Page', async ({ basePage }) => {
    meta({ priority: 'P2', severity: 'minor', owner: 'Shraddha_sc', story: 'US605', epic: 'ep201', feature: 'F20' });
    expect(await basePage.isSearchBoxVisible()).toBeTruthy();
})

test('Cart exists on Login Page', async ({ basePage }) => {
    meta({ priority: 'P2', severity: 'minor', owner: 'Shraddha_sc', story: 'US606', epic: 'ep201', feature: 'F20' });
    expect(await basePage.isCartButtonVisible()).toBeTruthy();
})

test('Footers exists on Login Page', async ({ basePage }) => {
    meta({ priority: 'P2', severity: 'minor', owner: 'Shraddha_sc', story: 'US607', epic: 'ep201', feature: 'F20' });
    expect(await basePage.getPageFooterscount()).toBe(16);
});