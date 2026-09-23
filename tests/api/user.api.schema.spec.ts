

/**
 * SCHEMA VALIDATION TESTING: in contract testing we test type of data not actual data
 * schema: type of response data -----"type": "array"
 * ajv api - node lib for schema validation, provided by nodeJS
 * npm install ajv
 * ajv library helping me to validate the schema of any response
 * Ex - id is not coming in number / status is not coming or coming as null
 * all the mandatory fields should be coming in the response - mandatory attributes shiuld not be missed
 */

import { test, expect } from "../../src/fixtures/apifixtures";
import Ajv from 'ajv';
import fs from 'fs';

/**
 * STEPS:
 * 1. Define TOKEN
 * 2. Define AUTH_HEADER
 * 3. set up AJV lib by creating an object of Ajv
 * 4. create data schema using the response for which we want to validate schema 
 * 5. Create test - first create user and then get user to get the schema
 *                  Validate the schema using ajv.compile
 *                  its response will behave like a function - pass body of the response which needs to be vlidated (step 1 getUserResponse)
 *                  apply assertion
 */

const TOKEN = process.env.API_TOKEN;

let AUTH_HEADER = {
    Authorization: `Bearer ${TOKEN}`
};

// setup the AJV lib: crete object of Ajv
let ajv = new Ajv();

/**
 * to validate the schema, I need to define JSON schema in my test
 * define JSON schema: type of data
 * https://transform.tools/json-to-json-schema
*/
// let userSchema = {
//     "type": "object",
//     "properties": {
//         "id": {
//             "type": "number"
//         },
//         "name": {
//             "type": "string"
//         },
//         "email": {
//             "type": "string"
//         },
//         "gender": {
//             "type": "string"
//         },
//         "status": {
//             "type": "string"
//         }
//     },
//     "required": [
//         "id",
//         "name",
//         "email",
//         "gender",
//         "status",
//         // "city"
//     ]
// }
// note: above is commented because I have maintained userSchema in separate file - schema >> userschema.json
let userArraySchema = {
    "type": "array",
    // "items": userSchema
    "items":JSON.parse(fs.readFileSync('./src/schema/userschema.json','utf-8'))
}

test('get a user - schema test', async ({ apiHelper }) => {
    // first create a fresh user and then GET the user to get the JSON
    let userData = {
        name: "apiautomationsigoel",
        email: `automation.sigoel_${Date.now()}@pw.com`,
        gender: "female",
        status: "active"
    }
    let response = await apiHelper.post('/public/v2/users', userData, AUTH_HEADER);
    expect(response.status).toBe(201);
    let userId = response.body.id;
    console.log('created user id: ', userId);

    // get a user:
    let getUserResponse = await apiHelper.get(`/public/v2/users/${userId}`, AUTH_HEADER);
    expect(getUserResponse.status).toBe(200);

    //now do schema validation: validate the response schema now
    // readFileSync is reading JSON file and JSON.parse method is reading the file and converting it into JSON
    // let validateSchema = ajv.compile(userSchema);
    let validateSchema = ajv.compile(JSON.parse(fs.readFileSync('./src/schema/userschema.json','utf-8')))
    let isSchemaValid = validateSchema(getUserResponse.body);
    if (!isSchemaValid) {
        console.log("SCHEMA ERROR: ", validateSchema.errors);
    }

    expect(isSchemaValid).toBeTruthy();
})

/**
 * now we need to validate the schema of an array
 * in JSON schema - "type": "array"
 * define arraySchema - use simple schema items inside it - don't write duplicate code here
 * 
 */

test('get all users - schema test', async ({ apiHelper }) => {
    //here no need to create user just get the users
    //GET all users:
    let getUsersResponse = await apiHelper.get(`/public/v2/users`, AUTH_HEADER);
    expect(getUsersResponse.status).toBe(200);

    //now do array schema validation: validate the response of array schema now
    let validateArraySchema = ajv.compile(userArraySchema);
    let isArraySchemaValid = validateArraySchema(getUsersResponse.body);
    if (!isArraySchemaValid) {
        console.log("SCHEMA ERROR: ", validateArraySchema.errors);
    }

    expect(isArraySchemaValid).toBeTruthy();
})

/**
 * if we have huge array response
 * spotigy api - getAlbums
 * having huge response - create JSON schema
 * if don't want to write it in spec file - create a sample separate JSON file--> export it --> import in your test
 */

/**
 *  * Test cases:
 * | TC ID | Test case                                       | Expected result                                                       |
| ----- | ----------------------------------------------- | --------------------------------------------------------------------- |
| SC-01 | Validate response matches expected JSON schema  | Response conforms to schema                                           |
| SC-02 | Validate required fields are present            | All mandatory fields exist                                            |
| SC-03 | Validate all fields data type                   | data type should be as expected - string | number                     |                             |
| SC-04 | Validate no unexpected fields                   | Response contains only expected properties, if contract requires this |
| SC-05 | Validate array response schema for `GET /users` | Every user object follows the schema in array                         |
| SC-04 | Validate nested object schema, if applicable    | Nested properties/types are correct                                   |
| SC-05 | Validate schema for `POST /users` response      | Created user response matches schema                                  |
| SC-06 | Validate schema for `PUT /users/{id}` response  | Updated user response matches schema                                  |
| SC-07 | Validate error-response schema                  | 4xx response has expected error structure                             |
 */




