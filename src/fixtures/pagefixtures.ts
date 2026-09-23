/**fixture: repository of page objects
 * here we will maintain all the page objects - LP, HP, CP, PP
 * alias of test is used as basetest
 */


import { test as baseTest } from '@playwright/test';
import { BasePage } from '../pages/BasePage';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage';
import { RegistrationPage } from '../pages/RegistrationPage';
import { SearchResultsPage } from '../pages/SearchResultsPage';
import { ProductInfoPage } from '../pages/ProductInfoPage';
import { ShoppingCartPage } from '../pages/ShoppingCartPage';

type pageFixtures = {
    basePage: BasePage,
    loginPage: LoginPage,
    homePage: HomePage,
    registrationPage: RegistrationPage,
    searchResultsPage: SearchResultsPage,
    productInfoPage: ProductInfoPage,
    shoppingCartPage: ShoppingCartPage
};

//extend the playwright test: using baseTest.extend: Inheritance
/**
 * baseTest means craeted my own test as bas test at line 7. so that I can use all the features of test using extend keyword
 * + I can define my own features also
 */
export let test = baseTest.extend<pageFixtures>({

    basePage: async ({ page }, use) => {
        let basePage = new BasePage(page);
        await use(basePage);
    },

    loginPage: async ({ page }, use) => {
        let loginPage = new LoginPage(page);
        await use(loginPage);
    },

    homePage: async ({ page }, use) => {
        let homePage = new HomePage(page);
        await use(homePage);
    },

    registrationPage: async ({ page }, use) => {
        let registrationPage = new RegistrationPage(page);
        await use(registrationPage);
    },

    searchResultsPage: async ({ page }, use) => {
        let searchResultsPage = new SearchResultsPage(page);
        await use(searchResultsPage);
    },

    productInfoPage: async ({ page }, use) => {
        let productInfoPage = new ProductInfoPage(page);
        await use(productInfoPage);
    },
    shoppingCartPage: async ({ page }, use) => {
        let shoppingCartPage = new ShoppingCartPage(page);
        await use(shoppingCartPage);
    }
});

export { expect } from '@playwright/test'

/**
 * Q - why should't I import expect in test?
 * in test - we have page, browser, browserContext, apiContext - these are PW inbuilt features - coming from PW test runner
 * and I have overridden this test as baseTest and created another features/ created custom fixtures
 * so now i am getting inbuilt fixtures and my custom fixtures - using extends keyword
 * 
 * now I am exporting expect also - when I write test case, i need expect also but export is inside inbuilt fixture.
 * I want to export expect also from my custom fixture
 * expect method is now coming from custom fixtures - coming from the common module/container
 * because now for my aplication I am using my custom fixture container.
 * 
 * why we need this?
 * to get rid of creating page objects everytime in every class.
 * 
 * why I am writing export expect here?
 * if we don't write export expect here then in every test class I will have to import expect from @playwright/test
 * one more line of import i will have to write everytime in every test file.
 * 
 */

