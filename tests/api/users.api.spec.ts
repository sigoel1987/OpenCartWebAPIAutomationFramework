
import { meta } from "reporting-labs";
import { test, expect } from "../../src/fixtures/apifixtures";

const TOKEN = process.env.API_TOKEN;
let AUTH_HEADER = {
    Authorization: `Bearer ${TOKEN}`
};
let userId: number;

/**sequence of test:tests should be in sequential mode not in parallel				
    get all users					
    post --- user id					
    get /user id					
    put /userid					
    delete/userid					
 */

test.describe.serial('running e2e go rest crud apis tests', () => {

    // GET test:
    test('GET API - get all users', async ({ apiHelper }) => {
        meta({ priority: 'P2', severity: 'minor', owner: 'Shraddha_api', story: 'US724', epic: 'ep201', feature: 'F20' });
        let response = await apiHelper.get('/public/v2/users', AUTH_HEADER);

        expect(response.status).toBe(200);
        expect(response.body.length).toBeGreaterThan(1);
    });

    // POST test:
    test('POST API - create a fresh user', async ({ apiHelper }) => {
        meta({ priority: 'P2', severity: 'minor', owner: 'Shraddha_api', story: 'US725', epic: 'ep201', feature: 'F20' });
        let userData = {
            "name": "PW API Automation Sigoel",
            "email": `sigoelapiautomation_${Date.now()}@open.com`,
            "gender": "female",
            "status": "active"
        }

        let response = await apiHelper.post('/public/v2/users', userData, AUTH_HEADER);

        expect(response.status).toBe(201);
        userId = response.body.id;
        console.log(`created user id: ${userId}`);
    });

    // PUT test:
    test('PUT API - update a user', async ({ apiHelper }) => {
        meta({ priority: 'P2', severity: 'minor', owner: 'Shraddha_api', story: 'US726', epic: 'ep201', feature: 'F20' });
        let userData = {
            "name": "PW API Automation Sigoel test",
            "status": "inactive"
        }

        let response = await apiHelper.put(`/public/v2/users/${userId}`, userData, AUTH_HEADER);

        expect(response.status).toBe(200);
        // expect(response.status)
        expect(response.body.name).toBe(userData.name);
        expect(response.body.status).toBe(userData.status);
    });

    // DELETE test:
    test('DELETE API - Delete a user', async ({ apiHelper }) => {
        meta({ priority: 'P2', severity: 'minor', owner: 'Shraddha_api', story: 'US727', epic: 'ep201', feature: 'F20' });
        let response = await apiHelper.delete(`/public/v2/users/${userId}`, AUTH_HEADER);
        expect(response.status).toBe(204);
    });

    //final GET the user to validate if user exist or not:

    test('GET API - fetch the user', async ({ apiHelper }) => {
        meta({ priority: 'P2', severity: 'minor', owner: 'Shraddha_api', story: 'US728', epic: 'ep201', feature: 'F20' });
        let response = await apiHelper.get(`/public/v2/users/${userId}`, AUTH_HEADER);
        expect(response.status).toBe(404);
        expect(response.body.message).toEqual('Not Found');
    })
})




