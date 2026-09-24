
import { meta } from 'reporting-labs';
import { test, expect } from '../src/fixtures/pagefixtures';
import { CsvHelper } from '../src/utils/CsvHelper';
import { ExcelHelper } from '../src/utils/ExcelHelper';

test.beforeEach(async ({ loginPage }) => {
    await loginPage.goToLoginPage();
    await loginPage.doLogin(process.env.APP_USERNAME!, process.env.PASSWORD!);
})


/**
 * data provider: CSV
 */
// CsvHelper.readCsv('src/testdata/product.csv');

// verify search
let productCsvData = CsvHelper.readCsv('src/testdata/product.csv');
for (let row of productCsvData) {
    test(`verify search results count - ${row.searchkey} - ${row.productname}`, async ({ homePage, searchResultsPage }) => {
        meta({ priority: 'P2', severity: 'minor', owner: 'Shraddha_sp', story: 'US501', epic: 'ep201', feature: 'F20' });
        await homePage.doSearch(row.searchkey);
        let productResultCount = await searchResultsPage.getProductSearchResultsCount();
        console.log(`Search Result Count: ${productResultCount}`);
        expect(productResultCount).toBe(Number(row.resultcount));
    });
}

/**
 * homepage> search for macbook> click on the product> product page should be displayed  (verify title)
 */

for (let row of productCsvData) {
    test(`verify user is able to land on the product page - ${row.searchkey} - ${row.productname}`, async ({ homePage, searchResultsPage, page }) => {
        meta({ priority: 'P2', severity: 'minor', owner: 'Shraddha_sp', story: 'US502', epic: 'ep201', feature: 'F20' });
        await homePage.doSearch(row.searchkey);
        await searchResultsPage.selectProduct(row.productname);
        expect(await page.title()).toBe(row.productname);
    });
}


/**
 * dataprovider: excel
 */

let productExcelData = ExcelHelper.readExcel('src/testdata/opencarttestdata.xlsx', 'product');
for (let row of productExcelData) {
    test(`verify search results count with Excel data- ${row.searchkey} - ${row.productname}`, async ({ homePage, searchResultsPage }) => {
        meta({ priority: 'P2', severity: 'minor', owner: 'Shraddha_sp', story: 'US503', epic: 'ep201', feature: 'F20' });
        await homePage.doSearch(row.searchkey);
        let productResultCount = await searchResultsPage.getProductSearchResultsCount();
        console.log(`Search Result Count: ${productResultCount}`);
        expect(productResultCount).toBe(Number(row.resultcount));
    });
}

//common features test:
test('App logo exists on Login Page', async ({ basePage }) => {
    meta({ priority: 'P2', severity: 'minor', owner: 'Shraddha_sp', story: 'US504', epic: 'ep201', feature: 'F20' });
    expect(await basePage.isLogoVisible()).toBeTruthy();
})

test('Search Box exists on Login Page', async ({ basePage }) => {
    meta({ priority: 'P2', severity: 'minor', owner: 'Shraddha_sp', story: 'US505', epic: 'ep201', feature: 'F20' });
    expect(await basePage.isSearchBoxVisible()).toBeTruthy();
})

test('Cart exists on Login Page', async ({ basePage }) => {
    meta({ priority: 'P2', severity: 'minor', owner: 'Shraddha_sp', story: 'US506', epic: 'ep201', feature: 'F20' });
    expect(await basePage.isCartButtonVisible()).toBeTruthy();
})

test('Footers exists on Login Page', async ({ basePage }) => {
    meta({ priority: 'P2', severity: 'minor', owner: 'Shraddha_sp', story: 'US507', epic: 'ep201', feature: 'F20' });
    expect(await basePage.getPageFooterscount()).toBe(16);
});