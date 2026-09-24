
/** Assignment: web automation + api automation
 * in same test, use page fixture for web along with request fixture
 * page.goto('');
 * go to booking page
 * write page locator and assertion--page.locator().isbookingid available or not??
 * 
 * contacts api
 * https://thinking-tester-contact-list.herokuapp.com/
 * web application credentials: shraddha.goel@pw.com | password123
 * 
 * 
 * create one contact using  add contact api POST api >> 
 * call this API 5 times --5 users will be created
 * come to the webpage -- contact should be created on web page >> 
 * verify if 5 contacts are coming on web
 * 
 * create a contact PUT
 * clicking on contact >> PUT API
 * call Delete API DELETE >> 
 * come back to contact list through web >> 
 * nothing should get return on web, entry should be deleted from web
 */

import { test, expect } from "../../src/fixtures/apifixtures";

// login: https://thinking-tester-contact-list.herokuapp.com/users/login
//create: https://thinking-tester-contact-list.herokuapp.com/contacts
// Delete: https://thinking-tester-contact-list.herokuapp.com/contacts/6ab4981860321f0015ac7f1d

let baseURL = 'https://thinking-tester-contact-list.herokuapp.com';
let tokenID: string;
let creds =
{
    "email": "shraddha.goel@pw.com",
    "password": "password123"
}
let newContact = {
    "firstName": "Shraddha",
    "lastName": "Goel",
    "birthdate": "1990-01-01",
    "email": `sgoel_${Date.now()}@pw.com`,
    "phone": "8005555555",
    "street1": "Main St.",
    "street2": "Apartment A",
    "city": "Mumbai",
    "stateProvince": "MH",
    "postalCode": "422258",
    "country": "INDIA"
}
// STEP 1: login through POST api and generate token >> 
test.beforeEach('generate the token', async ({ request }) => {

    let userResponse = await request.post(`${baseURL}/users/login`, {
        data: creds
    })
    let jsonResponse = await userResponse.json();
    tokenID = jsonResponse.token;
    console.log(`Contact User app admin user token: ${tokenID}`);
});

test('Contact APP E2E flow - create, verify, delete, validateList', async ({ request, page }) => {


    // STEP2: create contact POST (using token and body) >>
    let createApiResponse = await request.post(`${baseURL}/contacts`, {
        headers: { Authorization: `Bearer ${tokenID}` },
        data: newContact,
    })
    expect(createApiResponse.status()).toBe(201);
    let newContactJson = await createApiResponse.json();
    let contactID = newContactJson._id
    console.log(`New Contact Created: ${contactID}`);

    // STEP3: validate contacts count on UI (login to app and check contacts count)
    await page.goto(baseURL);
    await page.getByRole('textbox', { name: 'Email' }).fill(creds.email);
    await page.getByPlaceholder('Password').fill(creds.password);
    await page.getByRole('button', { name: 'Submit' }).click();

    await expect(page.getByRole('heading', { name: 'Contact List', level: 1 })).toBeVisible();

    let contactTable = page.locator('table#myTable.contactTable');
    await expect(contactTable).toBeVisible();

    console.log(await contactTable.innerText());

    async function getContactRecordCount(): Promise<number> {
        return await contactTable.locator('tr.contactTableBodyRow').count();
    }

    let totalContactsBeforeDelete = await getContactRecordCount();
    console.log(`Total Contacts in the list before delete are: ${totalContactsBeforeDelete}`);

    // STEP4: Delete Contact using DELETE
    // through Web: go to contact list >> assert on list count (should be less than 1 from the previous count)
    let deleteContactResponse = await request.delete(`${baseURL}/contacts/${contactID}`, {
        headers: { Authorization: `Bearer ${tokenID}` },
    })
    expect(deleteContactResponse.status()).toBe(200);

    await page.reload();
    await expect(contactTable).toBeVisible();
    const totalContactsafterDelete = await getContactRecordCount();
    expect(totalContactsafterDelete).toBe(totalContactsBeforeDelete - 1);
    console.log(`Total Contacts in the list after delete are: ${totalContactsafterDelete}`);
})