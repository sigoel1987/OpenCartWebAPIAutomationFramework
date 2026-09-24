import { test, expect } from '@playwright/test';
import { error } from 'node:console';
import { json } from 'node:stream/consumers';
import { meta } from 'reporting-labs';

// what different network calls are happening in the background
// web app ---> intercept the network calls and log them
// **/* winldcard pattern for URLs


//test to fetch/intercept all the background network calls
//how many requests were called and which method they are using
//usecase: need to check if api is working correctly or not
test('intercept and log requests', async ({ page }) => {
    meta({ priority: 'P2', severity: 'minor', owner: 'Shraddha_api', story: 'US709', epic: 'ep201', feature: 'F20' });
    await page.route('**/*', async (route) => {
        console.log(route.request().method(), route.request().url()); //whatever requests are happening in the background-give me their methods-GET/POST/PUT...and url
        await route.continue(); //please continue with all the urls--url1 --- capture, url2 --- capture...
    });

    //navigate to web app:
    await page.goto('https://naveenautomationlabs.com/opencart/index.php?route=common/home');
})


//intercept with mocking: 
//mocking: creating fake data/response:
//security testing

//for which api we want to produce fake data
test('mock search with fake json', async ({ page }) => {
    meta({ priority: 'P2', severity: 'minor', owner: 'Shraddha_api', story: 'US710', epic: 'ep201', feature: 'F20' });
    let fakeProducts = [
        { name: 'Fake Macbook Pro', price: '$599' },
        { name: 'Fake Iphone 18', price: '$5999' },
    ];

    //https://naveenautomationlabs.com/opencart/index.php?route=product/search&search=macbook
    await page.route('**/index.php?route=product/search&search=macbook', async (route) => {
        await route.fulfill({           //used for generating fake data
            status: 200,                //fake response should be 200
            contentType: 'application/json',
            body: JSON.stringify(fakeProducts) //html data can also be supplied
        });
    });

    await page.goto('https://abc.com/index.php?route=product/search&search=macbook');

    await page.pause();

    /**
     * usecase - real api is not available this time, so we create mock data to be displayed on web app
     * api is behaving like fake api
     * till the time database gets setup, i can validate if data will appear correctly on UI - throuch mocking
     * Banking application - we can't hit Bank APIs with real data so
     * we can create mock data by calling api and can do testing with mock data
     * 
     */
})

test('mock search page with fake HTML', async ({ page }) => {
    meta({ priority: 'P2', severity: 'minor', owner: 'Shraddha_api', story: 'US711', epic: 'ep201', feature: 'F20' });
    //https://naveenautomationlabs.com/opencart/index.php?route=product/search&search=macbook
    await page.route('**/index.php?route=product/search&search=macbook', async (route) => {
        await route.fulfill({           //used for generating fake data
            status: 200,                //fake response should be 200
            contentType: 'text/html',
            body: `
                <html>
                <body>
                    <h1>Search Results</h1>
                    <div class="product-layout">
                        <h4><a href="#">Fake Macbook Pro</a></h4>
                        <p class="price">$599</p>
                    </div>
                    <div class="product-layout">
                        <h4><a href="#">Fake iPhone 20</a></h4>
                        <p class="price">$999</p>
                    </div>
                </body>
                </html>
            `,
        });
    });

    await page.goto('https://naveenautomationlabs.com/opencart/index.php?route=product/search&search=macbook');

    //asserting on fake HTML
    const heading = await page.textContent('h1');
    expect(heading).toBe('Search Results');

    const products = await page.locator('.product-layout h4').allTextContents();
    expect(products).toEqual(["Fake Macbook Pro", "Fake iPhone 20"]);

    const prices = await page.locator('.price').allTextContents();
    expect(prices).toEqual(["$599", "$999"]);

    await page.pause();
})

/**
 * Assignment: create 2 negative test cases
 * response code -- 401 --- login api ---response body-display Not Authorized
 * response code -- 500 -- Internal server error
 */

test('mock error with 400 response code with fake JSON', async ({ page }) => {
    meta({ priority: 'P2', severity: 'minor', owner: 'Shraddha_api', story: 'US712', epic: 'ep201', feature: 'F20' });
    // https://naveenautomationlabs.com/opencart/index.php?route=account/login

    // route.fulfill()       → MOCKS the response
    page.route('**/index.php?route=account/login', async (route) => {
        route.fulfill({
            status: 400,
            contentType: 'application/json',
            body: JSON.stringify({
                error: 'Not Authorized'
            }),
        });
    });

    // Load actual login page
    const response = await page.goto('https://naveenautomationlabs.com/opencart/index.php?route=account/login');
    let body = await response?.json();

    //asserting on fake JSON
    expect(response?.status()).toBe(400);
    expect(body.error).toBe('Not Authorized')

    await page.pause();
})

test('mock error with 500 response code with fake HTML', async ({ page }) => {
    meta({ priority: 'P2', severity: 'minor', owner: 'Shraddha_api', story: 'US713', epic: 'ep201', feature: 'F20' });
    await page.route('****/index.php?route=account/login', async (route) => {
        await route.fulfill({           //used for generating fake data
            status: 500,                //fake response should be 500
            contentType: 'text/html',
            body: `
                <html>
                    <head>
                        <title>Internal Server Error</title>
                    </head>
                    <body>
                        <h1>Internal Server Error</h1>
                        <p>Something went wrong on the server.</p>
                    </body>
                </html>
            `,
        });
    });

    await page.goto('https://naveenautomationlabs.com/opencart/index.php?route=account/login');

    //asserting on fake HTML
    const heading = await page.textContent('h1');
    expect(heading).toBe('Internal Server Error');
    const errorMsg = await page.locator('p').textContent();
    expect(errorMsg).toBe("Something went wrong on the server.");
    await page.pause();
})