import { test, expect } from '../src/fixtures/pagefixtures';

test.beforeEach(async ({ loginPage }) => { //page is inbuilt fixture
    await loginPage.goToLoginPage();
    await loginPage.doLogin(process.env.APP_USERNAME!, process.env.PASSWORD!);
});


// verify product header
test('verify product header', async ({ homePage, searchResultsPage, productInfoPage }) => {
    homePage.doSearch('macbook');
    searchResultsPage.selectProduct('MacBook Pro');
    expect(await productInfoPage.getProductHeader()).toBe('MacBook Pro');
})

// verify product images count

test('verify product images count', async ({ homePage, searchResultsPage, productInfoPage }) => {
    homePage.doSearch('macbook');
    searchResultsPage.selectProduct('MacBook Pro');
    expect(await productInfoPage.getProductImagesCount()).toBe(4);
})

// verify product information/data
// expect productheader, productimagescount,brand,product code, Rewards Points, Availability

test('verify product information/data', async ({ homePage, searchResultsPage, productInfoPage }) => {
    homePage.doSearch('macbook');
    searchResultsPage.selectProduct('MacBook Pro');

    let actualProductInfoMap = await productInfoPage.getProductInfo();
    // console.log('Actual Product Details: ', actualProductInfoMap);
    console.log(`Actual Product Details: ${actualProductInfoMap}`);

    expect.soft(actualProductInfoMap.get('productHeader')).toBe('MacBook Pro');
    expect.soft(actualProductInfoMap.get('productImagesCount')).toBe(4);

    expect.soft(actualProductInfoMap.get('Brand')).toBe('Apple');
    expect.soft(actualProductInfoMap.get('Product Code')).toBe('Product 18');
    expect.soft(actualProductInfoMap.get('Reward Points')).toBe('800');
    expect.soft(actualProductInfoMap.get('Availability')).toBe('Out Of Stock');

    expect.soft(actualProductInfoMap.get('productPrice')).toBe('$2,000.00');
    expect.soft(actualProductInfoMap.get('exTaxPrice')).toBe('$2,000.00');

    // await page.pause();
})

test('verify product is added to cart', async ({ homePage, searchResultsPage, productInfoPage }) => {
    await homePage.doSearch('macbook');
    await searchResultsPage.selectProduct('MacBook Pro');
    await productInfoPage.addProductToCart(2);
    expect (productInfoPage.getcartAdditionSuccessMsg).toContain('Success: You have added');
})


//common features test:
test('App logo exists on Login Page', async ({ basePage }) => {
    expect(await basePage.isLogoVisible()).toBeTruthy();
})

test('Search Box exists on Login Page', async ({ basePage }) => {
    expect(await basePage.isSearchBoxVisible()).toBeTruthy();
})

test('Cart exists on Login Page', async ({ basePage }) => {
    expect(await basePage.isCartButtonVisible()).toBeTruthy();
})

test('Footers exists on Login Page', async ({ basePage }) => {
    expect(await basePage.getPageFooterscount()).toBe(16);
});



