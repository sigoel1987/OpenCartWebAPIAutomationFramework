import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";


export class ProductInfoPage extends BasePage {

    //private locators:

    private readonly header: Locator;
    private readonly productImages: Locator;
    private readonly productMetaData: Locator;
    private readonly productPricing: Locator;
    private productInfoMap: Map<string, string | number>;

    private readonly quantity: Locator;
    private readonly addToCartBtn: Locator;
    private readonly addCartSuccessMsg: Locator;

    private readonly shoppingCartLink: Locator;



    //const... of the class...init the locators:
    constructor(page: Page) {
        super(page);
        this.header = page.getByRole('heading', { name: 'MacBook Pro', level: 1 });
        this.productImages = page.locator('#content li img');
        this.productMetaData = page.locator('div#content ul.list-unstyled:nth-of-type(1) li');
        this.productPricing = page.locator('div#content ul.list-unstyled:nth-of-type(2) li');
        this.productInfoMap = new Map<string, string | number>;

        this.quantity = page.getByRole('textbox', { name: 'Qty' });
        this.addToCartBtn = page.getByRole('button', { name: 'Add to Cart' });
        this.addCartSuccessMsg = page.locator('.alert.alert-success');

        this.shoppingCartLink = page.getByRole('link', { name: "shopping cart" }).first();
    };


    //page actions:

    // getProductHeader()
    async getProductHeader(): Promise<string> {
        return await this.header.innerText();
    }

    // getProductImagesCount()
    async getProductImagesCount(): Promise<number> {
        await this.productImages.first().waitFor({ state: 'visible' });//waiting for alteast first image is visible
        return await this.productImages.count();
    }

    // getProductMetaData()...map concept which stores data in the form of key & value pairs
    /**
     *  Brand: Apple
        Product Code: Product 18
        Reward Points: 800
        Availability: Out Of Stock
     */
    async getProductMetaData(): Promise<void> {
        let metadata = await this.productMetaData.allInnerTexts();
        for (let data of metadata) {
            let meta = data.split(':');
            let metaKey = meta[0].trim();
            let metaValue = meta[1].trim();
            this.productInfoMap.set(metaKey, metaValue)
        }
    }

    // getProductPriceData()
    /**
     *  $2,000.00
        Ex Tax: $2,000.00
     */
    async getProductPriceData(): Promise<void> {
        let priceData = await this.productPricing.allInnerTexts();
        let productPrice = priceData[0].trim();
        let exTaxPrice = priceData[1].split(':')[1].trim();
        this.productInfoMap.set('productPrice', productPrice);
        this.productInfoMap.set('exTaxPrice', exTaxPrice);
    }

    // getProductInfo() ---capture all things about the product
    // productheader
    // productimagescount
    // getProductMetaData
    // getProductPriceData

    async getProductInfo(): Promise<Map<string, string | number>> {
        this.productInfoMap.set('productHeader', await this.getProductHeader());//4
        this.productInfoMap.set('productImagesCount', await this.getProductImagesCount());
        await this.getProductMetaData();
        await this.getProductPriceData();
        return this.productInfoMap;
    }

    async addProductToCart(quantity: number): Promise<void> {
        await this.quantity.fill(quantity.toString());
        await this.addToCartBtn.click();
    }

    async getcartAdditionSuccessMsg(): Promise<string | null> {
        let cartSuccessMsg = await this.addCartSuccessMsg.textContent();
        console.log(`cart success msg: ${cartSuccessMsg}`);
        return cartSuccessMsg;
    }

    async goToShoppingCartPage(): Promise<void> {
        await this.shoppingCartLink.click();
    }

}


/**
 * Assignment:
 * add the quantity> click on add to cart
 * create locators on productInfo page
 * create locators and methods
 * create addToCart method
 * addTo Cart method - supply quantity and click on add to cart
 * click on the shopping cart
 * new page -  shopping cart page
 * write functionality of the shopping cart page
 * --check product name is visible
 * --check quantity is added there or not
 * 
 */