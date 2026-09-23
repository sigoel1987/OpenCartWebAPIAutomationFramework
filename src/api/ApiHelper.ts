
import { APIRequestContext } from "@playwright/test";

export class ApiHelper {


    private readonly request: APIRequestContext;
    private readonly baseURL: string;


    constructor(request: APIRequestContext, baseURL: string) {
        this.request = request;
        this.baseURL = baseURL;
    }

    // helper methods:

    // GET
    // api url: base url+endpoint---->https://gorest.co.in/public/v2/users/8618916

    async get(endpoint: string, headers?: Record<string, string>) {
        let response = await this.request.get(`${this.baseURL}${endpoint}`, {
            headers: headers //(header coming from PW:header I have to supply)
        })

        const contentType = response.headers()['content-type'];
        let body = null;
        /**
         * it is not necessary that api response will always be JSON
         * that's used if-else condition here in helper to validate if response header is JSOn
         * then return json response else return text
         * header can be checked in postman under header section in response body
         */

        if (contentType?.includes('application/json')) {
            body = await response.json();
        } else {
            body = await response.text();
        }
        console.log(body, response.status());
        // console.log(response.status());
        return {
            status: response.status(),
            body
        }
    }


    // POST
    async post(endpoint: string, data: object, headers?: Record<string, string>) {
        let response = await this.request.post(`${this.baseURL}${endpoint}`, {
            headers: headers,               //(header coming from PW:header I have to supply)
            data: data
        });
        const contentType = response.headers()['content-type'];
        let body = null;
        if (contentType?.includes('application/json')) {
            body = await response.json();
        } else {
            body = await response.text();
        }
        console.log(body, response.status());

        // console.log(await response.json(), response.status());
        return {
            status: response.status(),
            body
        }
    }

    // PUT
    async put(endpoint: string, data: object, headers?: Record<string, string>) {
        let response = await this.request.put(`${this.baseURL}${endpoint}`, {
            headers: headers,
            data: data
        })
        console.log(await response.json(), response.status());
        return {
            status: response.status(),
            body: await response.json()
        }
    }

    // DELETE
    async delete(endpoint: string, headers?: Record<string, string>) {
        let response = await this.request.delete(`${this.baseURL}${endpoint}`, {
            headers: headers,
        })
        console.log(`User is deleted`);
        return {
            status: response.status(),
        }
    }
}