import { meta } from "reporting-labs";
import { ApiHelper } from "../../src/api/ApiHelper";
import { test, expect } from "../../src/fixtures/apifixtures";

const TOKEN = process.env.API_TOKEN;

let AUTH_HEADER = {
    Authorization: `Bearer ${TOKEN}`
};

//helper - generic reusable function -- create a user (POST CALL):
async function createUser(apiHelper: any) {
    // User JS object:
    let userData = {
        name: "apiautomationsigoel",
        email: `automation.sigoel_${Date.now()}@pw.com`,
        gender: "female",
        status: "active"
    }
    let response = await apiHelper.post('/public/v2/users', userData, AUTH_HEADER);
    expect(response.status).toBe(201);
    return response.body;
}


// test1: Create a user test + verify : AAA
// POST ----- return userID ----> GET/userID ----> verify

test('create a user test + verify : AAA', async ({ apiHelper }) => {
    meta({ priority: 'P2', severity: 'minor', owner: 'Shraddha_api', story: 'US717', epic: 'ep201', feature: 'F20' });
    // create a fresh user
    let userResponse = await createUser(apiHelper);
    // get a user:
    let getResponse = await apiHelper.get(`/public/v2/users/${userResponse.id}`, AUTH_HEADER);
    expect(getResponse.status).toBe(200);
    expect(getResponse.body.name).toBe('apiautomationsigoel')
})


// Test2: Update a user test + verify: AAA
// POST ---> userID ---> GET/userID ---> PUT/userID ---> GET userID ---> verify
test('Update a user test', async ({ apiHelper }) => {
    meta({ priority: 'P2', severity: 'minor', owner: 'Shraddha_api', story: 'US718', epic: 'ep201', feature: 'F20' });
    // 1. create a user:
    let userResponse = await createUser(apiHelper);
    // 2. get a user:
    let getResponse = await apiHelper.get(`/public/v2/users/${userResponse.id}`, AUTH_HEADER);
    expect(getResponse.status).toBe(200);
    expect(getResponse.body.email).toBe(userResponse.email);
    // 3. update a user: needs data object also
    let userUpdatedData = {
        name: "apiautomationsigoel-updated",
        status: "inactive"
    }
    let updateResponse = await apiHelper.put(`/public/v2/users/${getResponse.body.id}`, userUpdatedData, AUTH_HEADER);
    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.name).toBe(userUpdatedData.name);
    expect(updateResponse.body.status).toBe(userUpdatedData.status);

    // 4. get a user:
    getResponse = await apiHelper.get(`/public/v2/users/${userResponse.id}`, AUTH_HEADER);
    expect(getResponse.status).toBe(200);
    expect(getResponse.body.name).toBe(userUpdatedData.name);
    expect(updateResponse.body.status).toBe(userUpdatedData.status);
})

// Test3: Delete a user test + verify: AAA
// POST ---> userID ---> GET/userID ---> DELETE/userID (204) ---> GET userID (404)---> verify
test('Delete a user using Basic Token test', async ({ apiHelper }) => {
    meta({ priority: 'P2', severity: 'minor', owner: 'Shraddha_api', story: 'US719', epic: 'ep201', feature: 'F20' });
    // 1. create a user:
    let userResponse = await createUser(apiHelper);

    // 2. get a user:
    let getResponse = await apiHelper.get(`/public/v2/users/${userResponse.id}`, AUTH_HEADER);
    expect(getResponse.status).toBe(200);
    expect(getResponse.body.email).toBe(userResponse.email);

    // 3. Delete a user
    let updateResponse = await apiHelper.delete(`/public/v2/users/${getResponse.body.id}`, AUTH_HEADER);
    expect(updateResponse.status).toBe(204);

    // 4. get a user:
    getResponse = await apiHelper.get(`/public/v2/users/${userResponse.id}`, AUTH_HEADER);
    expect(getResponse.status).toBe(404);
    expect(getResponse.body.message).toBe('Resource not found');
})

// Test4: PATCH a user test + verify: AAA
// POST ---> userID ---> GET/userID ---> PATCH/userID ---> GET userID ---> verify
test('Update a user partially test', async ({ apiHelper }) => {
    meta({ priority: 'P2', severity: 'minor', owner: 'Shraddha_api', story: 'US720', epic: 'ep201', feature: 'F20' });
    // 1. create a user:
    let userResponse = await createUser(apiHelper);
    // 2. get a user:
    let getResponse = await apiHelper.get(`/public/v2/users/${userResponse.id}`, AUTH_HEADER);
    expect(getResponse.status).toBe(200);
    expect(getResponse.body.email).toBe(userResponse.email);
    // 3. update a user: needs data object also
    let userUpdatedData = {
        name: "apiautomationsigoel-updated",
        status: "inactive"
    }
    let updateResponse = await apiHelper.put(`/public/v2/users/${getResponse.body.id}`, userUpdatedData, AUTH_HEADER);
    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.name).toBe(userUpdatedData.name);
    expect(updateResponse.body.status).toBe(userUpdatedData.status);

    // 4. get a user:
    getResponse = await apiHelper.get(`/public/v2/users/${userResponse.id}`, AUTH_HEADER);
    expect(getResponse.status).toBe(200);
    expect(getResponse.body.name).toBe(userUpdatedData.name);
    expect(updateResponse.body.status).toBe(userUpdatedData.status);
})





/**
 * reading OTP from mail
 * call the application api and read otp from mail
 * practice site: mailosaur.com
 */