
import { meta } from 'reporting-labs';
import { test, expect } from '../src/fixtures/pagefixtures';


test.beforeEach(async ({ loginPage }) => {
    await loginPage.goToLoginPage();
    await loginPage.doLogin(process.env.APP_USERNAME!, process.env.PASSWORD!);
})

test('home page title test', async ({ homePage }) => {
    meta({ priority: 'P2', severity: 'minor', owner: 'Shraddha_hp', story: 'US101', epic: 'ep101', feature: 'F101', });
    let homePageTitle = await homePage.getHomePageTitle();
    console.log(`Home Page Title: ${homePageTitle}`);
    expect(homePageTitle).toBe('My Account');
})

test('logout link exist test', async ({ homePage }) => {
    meta({ priority: 'P2', severity: 'minor', owner: 'Shraddha_hp', story: 'US102', epic: 'ep101', feature: 'F101', });
    expect(await homePage.isLogoutLinkExist()).toBeTruthy();
})

test('home page headers exist test', async ({ homePage }) => {
    meta({ priority: 'P2', severity: 'minor', owner: 'Shraddha_hp', story: 'US103', epic: 'ep101', feature: 'F101', });
    let allHeaders = await homePage.getHomePageHeaders();
    console.log('home page headers: ', allHeaders);
    console.log(`Home page headers: ${allHeaders}`);
    expect.soft(allHeaders).toHaveLength(4);
    expect.soft(allHeaders).toEqual([
        'My Account',
        'My Orders',
        'My Affiliate Account',
        'Newsletter'
    ]);
})


//common features test:
test('App logo exists on Login Page', async ({ basePage }) => {
    meta({ priority: 'P2', severity: 'minor', owner: 'Shraddha_hp', story: 'US104', epic: 'ep101', feature: 'F101', });
    expect(await basePage.isLogoVisible()).toBeTruthy();
})

test('Search Box exists on Login Page', async ({ basePage }) => {
    meta({ priority: 'P2', severity: 'minor', owner: 'Shraddha_hp', story: 'US105', epic: 'ep101', feature: 'F101', });
    expect(await basePage.isSearchBoxVisible()).toBeTruthy();
})

test('Cart exists on Login Page', async ({ basePage }) => {
    meta({ priority: 'P2', severity: 'minor', owner: 'Shraddha_hp', story: 'US106', epic: 'ep101', feature: 'F101', });
    expect(await basePage.isCartButtonVisible()).toBeTruthy();
})

test('Footers exists on Login Page', async ({ basePage }) => {
    meta({ priority: 'P2', severity: 'minor', owner: 'Shraddha_hp', story: 'US107', epic: 'ep101', feature: 'F101', });
    expect(await basePage.getPageFooterscount()).toBe(16);
});