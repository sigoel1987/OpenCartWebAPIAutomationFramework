
/**
 * Assignment:
 * https://restful-booker.herokuapp.com/apidoc/index.html
 * getBooking, createBooking, partial booking, update booking
 * automate this API
 * get all the bookings
 * get booking with id
 * create booking -POST
 * do this in serial format
 * 
 */

/**sequence of test:tests should be in sequential mode not in parallel				
    get all bookings					
    post --- create a booking --booking Id generated					
    get booking /booking id					
    put update booking/booking id
    get booking /booking id					
    delete booking/booking id
    validate booking exist - get booking /booking id					
 */

import { meta } from "reporting-labs";
import { test, expect } from "../../src/fixtures/apifixtures"

let bookingId: number;
const TOKEN = process.env.BOOKING_API_TOKEN
let AUTH_HEADER = {
    Authorization: `Basic ${TOKEN}`
}

test.describe.serial('Booking e2e tests', () => {
    test('GET API - get all bookings', async ({ apiHelper }) => {
        meta({ priority: 'P2', severity: 'minor', owner: 'Shraddha_api', story: 'US702', epic: 'ep201', feature: 'F20' });
        let response = await apiHelper.get('/booking');

        expect(response.body.length).toBeGreaterThan(1)
        expect(response.status).toBe(200)
    })

    test('POST API - create new booking', async ({ apiHelper }) => {
        meta({ priority: 'P2', severity: 'minor', owner: 'Shraddha_api', story: 'US703', epic: 'ep201', feature: 'F20' });
        let bookingData = {
            "firstname": "Shraddha",
            "lastname": `Goel_${Date.now()}`,
            "totalprice": 500,
            "depositpaid": true,
            "bookingdates": {
                "checkin": "2018-01-01",
                "checkout": "2019-01-01"
            },
            "additionalneeds": "Breakfast"
        }
        let response = await apiHelper.post('/booking', bookingData);
        bookingId = response.body.bookingid;
        console.log(`Created booking ID: ${bookingId}`);
        expect(response.status).toBe(200);
    })

    test('GET API - get booking for specific id', async ({ apiHelper }) => {
        meta({ priority: 'P2', severity: 'minor', owner: 'Shraddha_api', story: 'US704', epic: 'ep201', feature: 'F20' });
        let response = await apiHelper.get(`/booking/${bookingId}`)
        expect(response.status).toBe(200);
    })

    test('PUT API - update existing booking test', async ({ apiHelper }) => {
        meta({ priority: 'P2', severity: 'minor', owner: 'Shraddha_api', story: 'US705', epic: 'ep201', feature: 'F20' });
        let bookingData = {
            "firstname": "Shraddha",
            "lastname": `Goel_${bookingId}`,
            "totalprice": 2000,
            "depositpaid": true,
            "bookingdates": {
                "checkin": "2026-09-18",
                "checkout": "2026-09-20"
            },
            "additionalneeds": "Breakfast & Lunch"
        }
        console.log(`*************updated response: }`);
        let response = await apiHelper.put(`/booking/${bookingId}`, bookingData, AUTH_HEADER)

        expect(response.body.lastname).toEqual(`Goel_${bookingId}`);
        expect(response.status).toBe(200);
    })

    test('Delete API - Delete existing booking', async ({ apiHelper }) => {
        meta({ priority: 'P2', severity: 'minor', owner: 'Shraddha_api', story: 'US706', epic: 'ep201', feature: 'F20' });
        let response = await apiHelper.delete(`/booking/${bookingId}`, AUTH_HEADER)
        expect(response.status).toBe(201);
    })

    test('GET API - booking id vaidation after deletion test', async ({ apiHelper }) => {
        meta({ priority: 'P2', severity: 'minor', owner: 'Shraddha_api', story: 'US707', epic: 'ep201', feature: 'F20' });
        let response = await apiHelper.get(`/booking/${bookingId}`)
        console.log('Booking Id not found');
        expect(response.status).toBe(404);
        expect(response.body).toEqual('Not Found');

    })
})