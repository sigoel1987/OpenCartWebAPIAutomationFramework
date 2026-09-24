import { test, expect, APIResponse } from "@playwright/test";
import { meta } from "reporting-labs";

let AUTH_TOKEN = {
    Authorization: 'Bearer 2c663241fc0b8d180238e42b83a3f63292b382deff70fc9c7b0991583a188f92'
};

test('get all users GET api test', async ({ request }) => {
    meta({ priority: 'P2', severity: 'minor', owner: 'Shraddha', story: 'US102', epic: 'ep201', feature: 'F20' });

    let response: APIResponse = await request.get('https://gorest.co.in/public/v2/users', {
        headers: AUTH_TOKEN
    });

    // console.log(response); //not relevant o/p
    let jsonBody = await response.json();
    console.log(jsonBody); //O/P== complete JSON response
    console.log(response.status()); //200
    console.log(response.statusText()); //OK

    expect(response.status()).toBe(200);
})

test('create a user POST api test', async ({ request }) => {
    meta({ priority: 'P2', severity: 'minor', owner: 'Shraddha', story: 'US102', epic: 'ep201', feature: 'F20' });

    //user javascript object: this object should get converted into JSON
    let userData = {
        "name": "PW API Automation Sigoel",
        "email": `sigoelapiautomation_${Date.now()}@open.com`,
        "gender": "female",
        "status": "active"
    }
    // javascript Object ----> should get converted into JSON
    // this process is called serialization
    // PW POST method internally converts JS objectto JSON
    // no need to use stringify method here

    let response = await request.post('https://gorest.co.in/public/v2/users', {
        headers: AUTH_TOKEN,
        data: userData
    });
    let jsonBody = await response.json();
    console.log(jsonBody);
    console.log(response.status()); //201
    console.log(response.statusText); //created

    expect(response.status()).toBe(201);
})


test('update a user PUT api test', async ({ request }) => {
    meta({ priority: 'P2', severity: 'minor', owner: 'Shraddha', story: 'US102', epic: 'ep201', feature: 'F20' });

    // supply user data
    let userData = {
        "name": "PW API Automation sigoel",
        "email": "sigoelapiautomationtest@open.com",
        "gender": "female",
        "status": "active"
    }
    let response = await request.put('https://gorest.co.in/public/v2/users/8618916', {
        headers: AUTH_TOKEN,
        data: userData,
    });
    let jsonBody = await response.json();
    console.log(jsonBody);
    console.log(response.status());
    console.log(response.statusText());
})

test('delete a user DELETE api test', async ({ request }) => {
    meta({ priority: 'P2', severity: 'minor', owner: 'Shraddha_api', story: 'US723', epic: 'ep201', feature: 'F20' });
    let response = await request.delete('https://gorest.co.in/public/v2/users/8619041', {
        headers: AUTH_TOKEN,
    });

    console.log(response.status()); //200
    console.log(response.statusText()); //No Content

    expect(response.status()).toBe(204);
})