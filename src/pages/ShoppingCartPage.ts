import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class ShoppingCartPage extends BasePage {

    //Locator
    private readonly shoppingCartHeader;
    private readonly cartTable;
    private readonly cartProduct;
    private readonly productQuantity;


    //constructor
    constructor(page: Page) {
        super(page);

        this.shoppingCartHeader = page.locator('#content h1');
        this.cartTable = page.locator('#content .table-responsive');
        this.cartProduct = page.locator('.table-bordered td.text-left a').first();
        this.productQuantity = page.locator('.table-bordered div.input-group input.form-control');
    }


    //methods
    async getShoppingCartPageHeader(): Promise<string | null> {
        let shoppingCartHeader = await this.shoppingCartHeader.textContent();
        console.log(`Shopping Cart Header: ${shoppingCartHeader}`);
        return shoppingCartHeader;
    }

    async isCartTableVisible(): Promise<boolean> {
        return await this.cartTable.isVisible();
    }

    // let cartProduct = await this.cartProduct.textContent();
    // console.log(`Product in cart: ${cartProduct}`);
    // return cartProduct;

    async getProductInCart(productName: string): Promise<Locator> {
        return this.cartProduct.filter({ hasText: productName });
    }

    async getProductQuantity(): Promise<string> {
        let quantity = await this.productQuantity.inputValue();
        console.log(`Quantity on cart Page: ${quantity}`);
        return quantity;
    }
}