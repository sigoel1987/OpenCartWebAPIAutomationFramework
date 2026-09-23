import { Locator, Page } from "@playwright/test";

//Base page responsible for all common components - header, logo, footer, title, search icon
export class BasePage {

    protected readonly page: Page; //protected: only child of the base page can access its property

    //common locators across all pages:
    protected readonly logo: Locator;
    protected readonly searchBox: Locator;
    protected readonly searchIcon: Locator;
    protected readonly footerLinks: Locator;
    protected readonly currency: Locator;
    protected readonly cartButton: Locator;


    constructor(page: Page) {
        this.page = page;
        this.logo = page.getByRole('img', { name: 'naveenopencart' });
        this.searchBox = page.getByRole('textbox', { name: 'Search' }).first();
        this.searchIcon = page.locator('div#search button');
        this.currency = page.locator('#form-currency');
        this.cartButton = page.locator('div#cart button');
        this.footerLinks = page.locator('footer a')
    }

    //App common features/actions: footer, logo, search

    async isLogoVisible(): Promise<boolean> {
        return this.logo.isVisible();
    }

    async isSearchBoxVisible(): Promise<boolean> {
        return this.searchBox.isVisible();
    }
    async isCurrencyVisible(): Promise<boolean> {
        return this.currency.isVisible();
    }

    async isCartButtonVisible(): Promise<boolean> {
        return this.cartButton.isVisible();
    }

    async getPageFooterscount(): Promise<number> {
        return await this.footerLinks.count();
    }

    async getPageFooters(): Promise<string[]> {
        return await this.footerLinks.allInnerTexts();
    }


    //page level generic methods:
    async getPageTitle(): Promise<string> {
        return await this.page.title()
    }

    getPageCurrentUrl(): string {
        return this.page.url()
    }

    async waitForPageLoad() {
        await this.page.waitForLoadState('load');
    }

    async takeScreenshot(name: string) {
        return await this.page.screenshot({
            fullPage: true,
            path: `reports/screenshot/${name}.png`
        })
    }

}