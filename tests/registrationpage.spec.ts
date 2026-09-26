import { meta } from "reporting-labs";
import { test, expect } from "../src/fixtures/pagefixtures";
import { CsvHelper } from "../src/utils/CsvHelper";

test.beforeEach(async ({ loginPage }) => {
    await loginPage.goToLoginPage();
    await loginPage.goToRegistrationPage();
})

test('Registration Page title test', async ({ basePage }) => {
    meta({ priority: 'P2', severity: 'minor', owner: 'Shraddha_rp', story: 'US401', epic: 'ep201', feature: 'F20' });

    let registrationPageTitle = await basePage.getPageTitle();
    expect(registrationPageTitle).toBe('Register Account');
})

// dataprovider:
let registeraccountdata = CsvHelper.readCsv('src/testdata/registeraccountdata.csv');
for (let row of registeraccountdata) {
    test(`Register account test - ${row.firstname} - ${row.lastname}`, async ({ registrationPage }) => {
        meta({ priority: 'P2', severity: 'minor', owner: 'Shraddha_rp', story: 'US402', epic: 'ep201', feature: 'F20' });

        await registrationPage.fillRegistrationForm(row.firstname, row.lastname, `sigoel_${Date.now()}@gmail.com`, row.mobile, row.pwd, row.confirmpwd);
        let successMessage = await registrationPage.captureRegistrationSuccess();
        expect(successMessage).toEqual('Your Account Has Been Created!')
    });
}

test('Verify registration fails when email is already registered', async ({ registrationPage }) => {
    meta({ priority: 'P2', severity: 'minor', owner: 'Shraddha_rp', story: 'US403', epic: 'ep201', feature: 'F20' });

    await registrationPage.fillRegistrationForm('Shraddha', 'Goel', 'shraddha.goel@pw3.com', '9934562354', 'pw1234', 'pw1234');
    const REGISTERED_EMAIL_ERROR_MESSAGE = await registrationPage.captureErrorMessage();
    expect(REGISTERED_EMAIL_ERROR_MESSAGE).toBe(' Warning: E-Mail Address is already registered!');
})


//common features test:
test('App logo exists on registration Page', async ({ basePage }) => {
    meta({ priority: 'P2', severity: 'major', owner: 'Shraddha_rp', story: 'US404', epic: 'ep201', feature: 'F201', issue: 'bug201' });
    console.log('----running common methods.....');
   let isVisble =  await basePage.isLogoVisible();
   console.log(isVisble);
   expect(isVisble).toBeTruthy();
   // expect(await basePage.isLogoVisible()).toBeTruthy();
})

test('Search Box exists on registration Page', async ({ basePage }) => {
    meta({ priority: 'P2', severity: 'minor', owner: 'Shraddha_rp', story: 'US405', epic: 'ep201', feature: 'F201', issue: 'bug201' });
    expect(await basePage.isSearchBoxVisible()).toBeTruthy();
})

test('Cart exists on registration Page', async ({ basePage }) => {
    meta({ priority: 'P2', severity: 'minor', owner: 'Shraddha_rp', story: 'US406', epic: 'ep201', feature: 'F201', issue: 'bug201' });
    expect(await basePage.isCartButtonVisible()).toBeTruthy();
})

test('Footers exists on registration Page', async ({ basePage }) => {
    meta({ priority: 'P2', severity: 'minor', owner: 'Shraddha_rp', story: 'US407', epic: 'ep201', feature: 'F201', issue: 'bug201' });
    expect(await basePage.getPageFooterscount()).toBe(16);
});





/**
 * Assignment:
 * go to login page
 * without login go to registration page
 * fill the entire registration page
 * click on continue and write an assertion with fixture
 * separation page  - registration page
 * create registration page entry inside the fixture
 * write test for registration page
 */