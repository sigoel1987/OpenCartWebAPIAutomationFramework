/**
 * here I can keep common functions like create user function
 * and this function can be called in spec file
 * async function createUser(apiHelper: any) {
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
 */