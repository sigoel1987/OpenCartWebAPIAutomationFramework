
import { test as baseTest } from "@playwright/test";
import { ApiHelper } from "../api/ApiHelper";

// define types for API fixtures:
type apiFixtures = {
    apiHelper: ApiHelper
}

export let test = baseTest.extend<apiFixtures>({

    apiHelper: async ({ request }, use) => {
        let apiHelper = new ApiHelper(request, process.env.API_BASE_URL!);
        await use(apiHelper);
    }

})

export { expect } from '@playwright/test';