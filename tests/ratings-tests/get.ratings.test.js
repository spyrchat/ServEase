const http = require("http");
const test = require("ava");
const got = require("got");
const app = require("../../index.js");

// ------------------------------- TESTS: GET /service/{serviceId}/ratings  ------------------------------ //

/**
 * Opens server, before tests.
 */
test.before(async (t) => {
  // Create server
  t.context.server = http.createServer(app);
  const server = t.context.server.listen();
  const { port } = server.address();
  t.context.got = got.extend({
    responseType: "json",
    prefixUrl: `http://localhost:${port}`,
  });
});


/**
 * Closes server, after tests
 */
test.after.always((t) => {
  t.context.server.close();
});


/**
 * Tests successful fetch of ratings by serviceId  [HAPPY PATH].
 */
test("getServiceRatings - Successful fetch of ratings by serviceId", async (t) => {
    
    // Suppose service with serviceId exists and has ratings
    const serviceId = 1;
    
    try {
        const ratingsResponse = await t.context.got.get(`service/${serviceId}/ratings`);

        t.is(ratingsResponse.statusCode, 200, "Should return 200 OK for successful retrieval");
        t.truthy(ratingsResponse.body, "Response body should not be empty");
        t.true(Array.isArray(ratingsResponse.body), "Response should be an array");

        ratingsResponse.body.forEach((ratings) => {
            t.is(ratings.serviceId, serviceId);
        });

    } catch (error) {
        t.fail(`Test encountered an unexpected error: ${error.message}`);
    }
  });




/**
 * Tests unsuccessful fetch of ratings by serviceId - serviceId does NOT exist [UNHAPPY PATH]
 */
test("getServiceRatings - Service not found", async (t) => {

    // Suppose service with the following id does NOT exist
    const invalidServiceId = 999;
    
    try {
        const response = await t.context.got.get(`service/${invalidServiceId}/ratings`);
        t.fail("Request should have failed with 404, but it did not");

    } catch (error) {
        t.is(error.response.statusCode, 404);
        t.is(error.response.body.message, `No service found with serviceId: ${invalidServiceId}`);
    }
});


/**
 * Tests unsuccessful fetch of ratings by serviceId - serviceId is NOT an integer [UNHAPPY PATH]
 */
test("getServiceRatings - serviceId not an integer", async (t) => {

    // Suppose service with the following id does NOT exist
    const invalidServiceId = "one";
    
    try {
        const response = await t.context.got.get(`service/${invalidServiceId}/ratings`);
        t.fail("Request should have failed with 400, but it did not");

    } catch (error) {
        t.is(error.response.statusCode, 400);
        t.is(error.response.body.message, "request.params.serviceId should be integer");
    }
});
  

/**
 * Tests unsuccessful fetch of ratings by serviceId - serviceId is NOT provided [UNHAPPY PATH]
 */
test("getServiceRatings - serviceId not provided", async (t) => {

    // Suppose service with the following id does NOT exist
    const invalidServiceId = undefined;
    
    try {
        const response = await t.context.got.get(`service/${invalidServiceId}/ratings`);
        t.fail("Request should have failed with 400, but it did not");

    } catch (error) {
        t.is(error.response.statusCode, 400);
        t.is(error.response.body.message, "request.params.serviceId should be integer");
    }
});



/**
 * Tests unsuccessful fetch of ratings by serviceId - Service exists but has no ratings [UNHAPPY PATH]
 */
test("getServiceRatings - Service exists but has no ratings", async (t) => {

    // Suppose service with serviceId exists but has NO ratings
    const serviceId = 3;

    try {
        const response = await t.context.got.get(`service/${serviceId}/ratings`);

        // Assertions
        t.is(response.statusCode, 200, "Should return 200 OK for empty ratings");
        t.truthy(response.body.message, "No ratings yet for this service.");
        t.deepEqual(response.body.data.length, 0, "Response should be an empty array");
    } catch (error) {
        t.fail(`Test failed with error: ${error.message}`);
    }
});

