import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";


export class LoginPage extends BasePage { //extending base page - login page is child of base page


    // 1. Private Locators: encapsulation
    private readonly emailId: Locator;
    private readonly password: Locator;
    private readonly loginBtn: Locator;
    private readonly forgottenPasswordLink: Locator;
    private readonly loginErrorMessage: Locator;
    private readonly newCustomerHeader: Locator;
    private readonly returningCustomerHeader: Locator;
    private readonly registerLink: Locator;

    // 2. constructor of the page class: init the locators:
    //child class constructor
    //through super -- base page constructor will be called
    constructor(page: Page) {
        super(page); //taking page object from super class-parent class base page
        this.emailId = page.getByRole('textbox', { name: 'E-Mail Address' });
        this.password = page.getByLabel('Password');
        this.loginBtn = page.getByRole('button', { name: 'Login' })
        this.forgottenPasswordLink = page.getByRole('link', { name: 'Forgotten Password' }).first();
        this.loginErrorMessage = page.locator('.alert.alert-danger.alert-dismissible');
        this.newCustomerHeader = page.getByRole('heading', { name: 'New Customer', level: 2 });
        this.returningCustomerHeader = page.getByRole('heading', { name: 'Returning Customer', level: 2 });

        this.registerLink = page.getByRole('link', { name: 'Register' });
    }

    // 3. public page actions(methods) / behaviour: Encapsulation
    // make sure all the page methods return something so that I can validate in my test

    async goToLoginPage(): Promise<void> {
        await this.page.goto('opencart/index.php?route=account/login'); //page is coming from base page: Inheritance
    }

    // removing it as common method is created in base page for title
    // async getLoginPageTitle(): Promise<string> {
    //     return await this.page.title();
    // }

    async isForgottenPwdLinkExist(): Promise<boolean> {
        return await this.forgottenPasswordLink.isVisible();
    }

    async doLogin(username: string, password: string): Promise<void> {
        console.log(`user creds: ${username} - ${password}`);
        await this.emailId.fill(username);
        await this.password.fill(password);
        await this.loginBtn.click();
    }

    async isInvalidLoginErrorDisplayed(): Promise<boolean> {
        return await this.loginErrorMessage.isVisible();
    }

    async isNewCustomerHeaderExist(): Promise<boolean> {
        return await this.newCustomerHeader.isVisible();
    }

    async isReturningCustomerHeaderDisplayed(): Promise<boolean> {
        return await this.returningCustomerHeader.isVisible();
    }

    async goToRegistrationPage(): Promise<void> {
        await this.registerLink.click();
    }

}