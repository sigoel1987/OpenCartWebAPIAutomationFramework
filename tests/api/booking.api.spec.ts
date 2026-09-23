/**
 * BASIC Authentication:
 * supply username and password and get the token
 */

import { test, expect } from '../../src/fixtures/apifixtures';

let tokenID: string;

test.beforeEach('generate the token', async ({ request }) => {

    let creds = {
        "username": "admin",
        "password": "password123"
    }

    let authResponse = await request.post('https://restful-booker.herokuapp.com/auth', {
        headers: { 'Content-Type': 'application/json' },
        data: creds
    });

    expect(authResponse.status()).toBe(200);
    let jsonResponse = await authResponse.json();
    console.log(`Auth api response: `, jsonResponse);
    tokenID = jsonResponse.token;
    console.log(`token ------> ${tokenID}`);
});

let bookingData = {
    "firstname": "Shraddha",
    "lastname": "Goel",
    "totalprice": 500,
    "depositpaid": true,
    "bookingdates": {
        "checkin": "2018-01-01",
        "checkout": "2019-01-01"
    },
    "additionalneeds": "Breakfast"
}

test('booking CRUD with token', async ({ request }) => {
    // 1. create a new booking : POST ---no token required
    let bookingResponse = await request.post(`https://restful-booker.herokuapp.com/booking`, {
        headers: { 'Content-Type': 'application/json' },
        data: bookingData
    });
    expect(bookingResponse.status()).toBe(200);
    let bookingJson = await bookingResponse.json();
    let bookingID = bookingJson.bookingid;
    console.log(`Booking ID: `, bookingID);


    // 2. Update a booking by bookingID: needs token

    let updatedResponse = await request.put(`https://restful-booker.herokuapp.com/booking/${bookingID}`, {
        headers: { Cookie: `token=${tokenID}` },
        data: {
            "firstname": `Shraddha-${bookingID}`,
            "lastname": "Goel",
            "totalprice": 12100000,
            "depositpaid": true,
            "bookingdates": {
                "checkin": "2026-09-18",
                "checkout": "2026-09-20"
            },
            "additionalneeds": "Lunch"
        }
    });

    expect(updatedResponse.status()).toBe(200);
    expect((await updatedResponse.json()).totalprice).toBe(12100000);
    expect((await updatedResponse.json()).additionalneeds).toBe('Lunch');


    // 3. Delete a booking  by bookingID
    let deleteResponse = await request.delete(`https://restful-booker.herokuapp.com/booking/${bookingID}`, {
        headers: { Cookie: `token=${tokenID}` },
    });
    expect(deleteResponse.status()).toBe(201);
})

test('partial update booking with token', async ({ request }) => {

    /** ASSIGNMENT:
     * url:https://restful-booker.herokuapp.com/booking/
     * data: id
     * token:basic
     * steps: create booking with data POST >> partial update booking PATCH >> get booking GET
     */
    // STEP 1:

    let bookingResponse = await request.post(`https://restful-booker.herokuapp.com/booking`, {
        headers: { 'Content-Type': 'application/json' },
        data: bookingData
    });
    expect(bookingResponse.status()).toBe(200);
    let bookingJson = await bookingResponse.json();
    let bookingID = bookingJson.bookingid;
    console.log(`created new booking: `, bookingID);

    //STEP2:
    let patchResponse = await request.patch(`https://restful-booker.herokuapp.com/booking/${bookingID}`, {
        data: {
            "firstname": "James",
            "lastname": "Brown"
        },
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json', 'Cookie': `token=${tokenID}`
        }
    })
    expect(patchResponse.status()).toBe(200);
    let jsonbody = await patchResponse.json()
    console.log(`partial update in the booking: `, jsonbody);

    //STEP 3:
    let getResponse = await request.get(`https://restful-booker.herokuapp.com/booking/${bookingID}`);
    expect(getResponse.status()).toBe(200);
    let jsonBody = await getResponse.json();
    expect(jsonBody.firstname).toBe('James');
    expect(jsonBody.lastname).toBe('Brown');
    console.log(`update booking name is: ${jsonBody.firstname}${jsonBody.lastname}`);
});



/**
 * Assignment from previous chapter - FW_06
 */

// POST ---> bookingID ---> GET/bookingID ---> DELETE/bookingID (204) ---> GET bookingID (404)---> verify
test('Delete booking using cookie Token test', async ({ apiHelper }) => {


    async function bookingToken(apiHelper: any) {
        let bookingAdminUser = {
            "username": "admin",
            "password": "password123"
        }
        let response = await apiHelper.post('/auth', bookingAdminUser);
        console.log(`Booking api cookie token: ${response.body.token}`);
        return response.body.token;
    }
    let cookieToken = await bookingToken(apiHelper);

    // creating the booking
    async function createBooking(apiHelper: any) {
        // User JS object:
        let bookingData = {
            "firstname": "Shraddha",
            "lastname": "Goel",
            "totalprice": 500,
            "depositpaid": true,
            "bookingdates": {
                "checkin": "2018-01-01",
                "checkout": "2019-01-01"
            },
            "additionalneeds": "Breakfast"
        }
        let response = await apiHelper.post('/booking', bookingData);
        expect(response.status).toBe(200);
        console.log(`created booking: ${response.body.bookingid}`);
        return response.body.bookingid;
    }

    // // 1. create a booking:
    let idBooked = await createBooking(apiHelper);
    // 2. get the booking:
    let getBooking = await apiHelper.get(`/booking/${idBooked}`);
    expect(getBooking.status).toBe(200);
    // 3. Delete the booking using cookie token
    let updateResponse = await apiHelper.delete(`/booking/${idBooked}`, {
        Cookie: `token=${cookieToken}`
    });
    expect(updateResponse.status).toBe(201);

    // 4. get the booking: validating whether booking exist
    getBooking = await apiHelper.get(`/booking/${idBooked}`);
    expect(getBooking.status).toBe(404);
    expect(getBooking.body).toBe('Not Found');
})



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
