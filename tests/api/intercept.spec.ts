import { test, expect } from '@playwright/test';

//web app ---> intercept the network calls and log them

test('intercept and log requests', async ({ page }) => {
    await page.route('**/*', async(route)=>{
        console.log(route.request().method(),route.request().url());
        await route.continue(); //url1 --- capture, url2 --- capture...
    });


    //navigate to web app:
    await page.goto('https://naveenautomationlabs.com/opencart/index.php?route=common/home');
})


//intercept with mocking:
//mocking: fake data/response:
//security testing

test('mock searchwith fake json', async ({ page }) => {
   
    let fakeProducts = [
        {name:'Fake Macbook Pro', price:'$599'},
        {name:'Fake Iphone 18', price:'$5999'},
    ];

    //https://naveenautomationlabs.com/opencart/index.php?route=product/search&search=macbook
    await page.route('**/index.php?route=product/search&search=macbook',async(route)=>{
        await route.fulfill({
            status:200,
            contentType:'application/json',
            body: JSON.stringify(fakeProducts)
        });
    });

    await page.goto('https://abc.com/opencart/index.php?route=product/search&search=macbook');

    await page.pause();

    /**
     * usecase - real api is not available this time, so we create mock data to be displayed on web app
     *  
     */
})

test('mock searchwith fake HTML', async ({ page }) => {

    // //https://naveenautomationlabs.com/opencart/index.php?route=product/search&search=macbook
    // await page.route('**/index.php?route=product/search&search=macbook',async(route)=>{
    //     await route.fulfill({
    //         status:200,
    //         contentType:'text/html',
    //         body: 
    //     });
    // });

    await page.goto('https://abc.com/opencart/index.php?route=product/search&search=macbook');

    await page.pause();
})

/**
 * Assignment: create 2 negative test cases
 * 
 */