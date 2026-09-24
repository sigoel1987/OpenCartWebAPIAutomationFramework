import { CsvHelper } from '../src/utils/CsvHelper';
import { ExcelHelper } from '../src/utils/ExcelHelper';
import { JsonHelper } from '../src/utils/JsonHelper';
import { test, expect } from '../src/fixtures/pagefixtures'
import * as allure from "allure-js-commons";
import { meta, log, testData } from 'reporting-labs';

test.beforeEach(async ({ loginPage }) => { //page is inbuilt fixture
    await loginPage.goToLoginPage();
});

test('login page title test', async ({ loginPage }) => {
    meta({ priority: 'P2', severity: 'minor', owner: 'Shraddha_lp', story: 'US201', epic: 'ep201', feature: 'F201', issue: 'bug201' });

    // let pageTitle = await loginPage.getLoginPageTitle();
    let pageTitle = await loginPage.getPageTitle();
    console.log('Login page title: ', pageTitle);

    await log('Login page title: ', pageTitle);

    expect(pageTitle).toBe('Account Login');
    //actual data should not be hardcoded
    //expected data can be hardcoded; it is fine to maintain expected data directly in test

})

test('forgot pwd link exist test', async ({ loginPage }) => {
    meta({ priority: 'P2', severity: 'minor', owner: 'Shraddha_lp', story: 'US202', epic: 'ep201', feature: 'F201', issue: 'bug201' });

    expect(await loginPage.isForgottenPwdLinkExist()).toBeTruthy();
});

test('user is able to login to app with valid credentials', async ({ loginPage, homePage }) => {
    meta({ priority: 'P2', severity: 'minor', owner: 'Shraddha_lp', story: 'US203', epic: 'ep201', feature: 'F201', issue: 'bug201' });

    await testData({ username: process.env.APP_USERNAME!, password: process.env.PASSWORD! }, 'Login')

    await allure.suite("Login Tests");
    await allure.severity("critical");
    await allure.feature("Authentication");
    await allure.story("Valid Login");
    await allure.description("Verify user can login with valid credentials");

    await allure.step("Login with valid creds", async () => {
        // await testData({process.env.APP_USERNAME!, process.env.PASSWORD!});
        await loginPage.doLogin(process.env.APP_USERNAME!, process.env.PASSWORD!); //using process object to call the username property from .env file
    });

    await allure.step("Login with valid creds", async () => {
        expect.soft(await homePage.isLogoutLinkExist()).toBeTruthy();
    });

    await allure.step("verify home page title is visible", async () => {
        expect.soft(await homePage.getHomePageTitle())
    });
});

test("new customer header exist test", async ({ loginPage }) => {
    meta({ priority: 'P2', severity: 'minor', owner: 'Shraddha_lp', story: 'US204', epic: 'ep201', feature: 'F201', issue: 'bug201' });

    expect(await loginPage.isNewCustomerHeaderExist()).toBeTruthy();
})

test("returning customer header exist test", async ({ loginPage }) => {
    meta({ priority: 'P2', severity: 'blocker', owner: 'Shraddha_lp', story: 'US205', epic: 'ep201', feature: 'F201', issue: 'bug201' });
    expect(await loginPage.isReturningCustomerHeaderDisplayed()).toBeTruthy();
})

// Invalid email + valid password test

test("Invalid email + valid password test", async ({ loginPage }) => {
    meta({ priority: 'P2', severity: 'minor', owner: 'Shraddha_lp', story: 'US206', epic: 'ep201', feature: 'F201', issue: 'bug201' });
    await loginPage.doLogin("pwapril123@pw.com", 'pw123');
    expect(await loginPage.isInvalidLoginErrorDisplayed()).toBeTruthy();
})


/**
 * DD_1: read csv data directly from the CSV file and loop the test method row wise...
 * pros:
 * light weight, easy to maintain/read, 3rd party lib, no license, flat files, fs
 * good for large set of test data
 * 
 */
let testCSVData = CsvHelper.readCsv('src/testdata/logindata.csv');

for (let row of testCSVData) {
    test(`login to app with invalid credentials with CSV data - ${row.username} - ${row.password}`, async ({ loginPage }) => {
        meta({ priority: 'P2', severity: 'minor', owner: 'Shraddha_lp', story: 'US207', epic: 'ep201', feature: 'F201', issue: 'bug201' });
        await testData(testCSVData, 'invalid Login Data');

        await loginPage.doLogin(row.username, row.password);
        expect(await loginPage.isInvalidLoginErrorDisplayed()).toBeTruthy();
    })
};


/**
 * npm install xlsx - used to install excel dependencies
 * DD_2: read xlsx data directly from the excel file and loop the test method row wise...
 * cons:
 * 1. maintenance
 * 2. MS Licenses
 * 3. may corrupt very soon
//  */
let testExcelData = ExcelHelper.readExcel('src/testdata/opencarttestdata.xlsx', 'login');
for (let row of testExcelData) {
    test(`login to app with invalid credentials with Excel Data - ${row.username} - ${row.password}`, async ({ loginPage }) => {
        meta({ priority: 'P2', severity: 'minor', owner: 'Shraddha_lp', story: 'US208', epic: 'ep201', feature: 'F201', issue: 'bug201' });
        await testData(testExcelData, 'Invalid Login Data');
        await loginPage.doLogin(row.username, row.password);
        expect(await loginPage.isInvalidLoginErrorDisplayed()).toBeTruthy();
    })
};

/**
 * DD_3: read JSON data directly from the JSON file and loop the test method row wise...
 * Pros:
 * 1. inbuilt method: parse, lightweight, smaller data source
 */

let testJSONData = JsonHelper.readJson('src/testdata/logindata.json');

for (let row of testJSONData) {
    test(`login to app with invalid credentials with JSON Data - ${row.username} - ${row.password}`, async ({ loginPage }) => {
        meta({ priority: 'P2', severity: 'minor', owner: 'Shraddha_lp', story: 'US209', epic: 'ep201', feature: 'F201', issue: 'bug201' });
        await testData(testJSONData, 'Invalid Login Data');

        await loginPage.doLogin(row.username, row.password);
        expect(await loginPage.isInvalidLoginErrorDisplayed()).toBeTruthy();
    })
};



//common features test:
test('App logo exists on Login Page', async ({ basePage }) => {
    meta({ priority: 'P2', severity: 'major', owner: 'Shraddha_lp', story: 'US210', epic: 'ep201', feature: 'F201', issue: 'bug201' });

    expect(await basePage.isLogoVisible()).toBeTruthy();
})

test('Search Box exists on Login Page', async ({ basePage }) => {
    meta({ priority: 'P2', severity: 'minor', owner: 'Shraddha_lp', story: 'US211', epic: 'ep201', feature: 'F201', issue: 'bug201' });
    expect(await basePage.isSearchBoxVisible()).toBeTruthy();
})

test('Cart exists on Login Page', async ({ basePage }) => {
    meta({ priority: 'P2', severity: 'minor', owner: 'Shraddha_lp', story: 'US212', epic: 'ep201', feature: 'F201', issue: 'bug201' });
    expect(await basePage.isCartButtonVisible()).toBeTruthy();
})

test('Footers exists on Login Page', async ({ basePage }) => {
    meta({ priority: 'P2', severity: 'minor', owner: 'Shraddha_lp', story: 'US213', epic: 'ep201', feature: 'F201', issue: 'bug201' });
    expect(await basePage.getPageFooterscount()).toBe(16);
});