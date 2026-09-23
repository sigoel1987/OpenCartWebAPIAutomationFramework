
import { test, expect } from '@playwright/test';
import { LoginPage } from "../src/pages/LoginPage";
import { HomePage } from "../src/pages/HomePage";

let loginPage: LoginPage; //creating object of LoginPage class
let homePage: HomePage;

test.beforeEach(async ({ page }) => { //page is inbuilt fixture
    loginPage = new LoginPage(page);
    await loginPage.goToLoginPage();
    homePage = new HomePage(page);
})

test.skip('login page title test', async () => {
    let pageTitle = await loginPage.getLoginPageTitle();
    console.log('Login page title: ', pageTitle);
    expect(pageTitle).toBe('Account Login');//actual data should not be hardcoded
    //expected data can be hardcoded; it is fine to maintain expected data directly in test

})

test.skip('forgot pwd link exist test', async () => {
    expect(await loginPage.isForgottenPwdLinkExist()).toBeTruthy();
})

test.skip('user is able to login to app', async () => {
    await loginPage.doLogin('pwapril@pw.com', 'pw123');
    // writing soft assertions here - if test fails on line 30 then it will continue
    expect.soft(await homePage.isLogoutLinkExist()).toBeTruthy();
    expect.soft(await homePage.getHomePageTitle()).toBe("My Account");
})

test.skip("new customer header exist test", async () => {
    expect(await loginPage.isNewCustomerHeaderExist()).toBeTruthy();
})

test.skip("returning customer header exist test", async () => {
    expect(await loginPage.isReturningCustomerHeaderDisplayed()).toBeTruthy();
})

// Invalid email + valid password test

test.skip("Invalid email + valid password test", async () => {
    await loginPage.doLogin("pwapril123@pw.com", 'pw123');
    expect(await loginPage.isInvalidLoginErrorDisplayed()).toBeTruthy();
})

// go to login page>> write test cases
// header --returning customer is coming or not
// header New customer is coming or not
// verify important links on login page - forgotton password, My account
// create few more test cases
// 