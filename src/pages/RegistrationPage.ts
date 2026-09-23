import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class RegistrationPage extends BasePage {

    // private locators
    private readonly firstName: Locator;
    private readonly lastName: Locator;
    private readonly email: Locator;
    private readonly phone: Locator;
    private readonly password: Locator;
    private readonly confirmPwd: Locator;
    private readonly policyCheckbox: Locator;
    private readonly continueBtn: Locator;
    private readonly confirmRegistration: Locator;
    private readonly emailregisteredError: Locator;



    // Constructor
    constructor(page: Page) {
        super(page);
        this.firstName = page.getByRole('textbox', { name: 'First Name' });
        this.lastName = page.getByRole('textbox', { name: '* Last Name' });
        this.email = page.getByRole('textbox', { name: '* E-Mail' });
        this.phone = page.getByRole('textbox', { name: '* Telephone' });
        this.password = page.locator('#input-password');
        this.confirmPwd = page.locator('#input-confirm');
        this.policyCheckbox = page.locator('//input[@type="checkbox"]');
        this.continueBtn = page.getByRole('button', { name: 'Continue' });
        this.confirmRegistration = page.getByRole('heading', { name: 'Your Account Has Been Created!', level: 1 });
        this.emailregisteredError = page.locator('.alert.alert-danger.alert-dismissible');
    }



    //Page Actions

    async getRegistrationPageTitle(): Promise<string> {
        return await this.page.title();
    }

    async fillRegistrationForm(firstName: string, lastName: string, email: string, phone: string, password: string, confirmPwd: string): Promise<void> {
        await this.firstName.fill(firstName);
        await this.lastName.fill(lastName);
        await this.email.fill(email)
        await this.phone.fill(phone);
        await this.password.fill(password);
        await this.confirmPwd.fill(confirmPwd);
        await this.policyCheckbox.check();
        await this.continueBtn.click();
    }

    async captureRegistrationSuccess(): Promise<string | null> {
        return await this.confirmRegistration.textContent();
    }

    async captureErrorMessage(): Promise<string | null> {
        return await this.emailregisteredError.textContent();
    }
}