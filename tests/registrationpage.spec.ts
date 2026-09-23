import { test, expect } from "../src/fixtures/pagefixtures";
import { CsvHelper } from "../src/utils/CsvHelper";

test.beforeEach(async ({ loginPage }) => {
    await loginPage.goToLoginPage();
    await loginPage.goToRegistrationPage();
})

test('Registration Page title test', async ({ registrationPage }) => {
    let registrationPageTitle = await registrationPage.getRegistrationPageTitle();
    expect(registrationPageTitle).toBe('Register Account');
})

// dataprovider:
let registeraccountdata = CsvHelper.readCsv('src/testdata/registeraccountdata.csv');
for (let row of registeraccountdata) {
    test(`Register account test - ${row.firstname} - ${row.lastname}`, async ({ registrationPage }) => {
        await registrationPage.fillRegistrationForm(row.firstname, row.lastname, row.email, row.mobile, row.pwd, row.confirmpwd);
        let successMessage = await registrationPage.captureRegistrationSuccess();
        expect(successMessage).toEqual('Your Account Has Been Created!')
    });
}

test('Verify registration fails when email is already registered', async ({ registrationPage }) => {
    await registrationPage.fillRegistrationForm('Shraddha', 'Goel', 'shraddha.goel@pw3.com', '9934562354', 'pw1234', 'pw1234');
    const REGISTERED_EMAIL_ERROR_MESSAGE = await registrationPage.captureErrorMessage();
    expect(REGISTERED_EMAIL_ERROR_MESSAGE).toBe(' Warning: E-Mail Address is already registered!');
})







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