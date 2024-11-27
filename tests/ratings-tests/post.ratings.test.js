const http = require("http");
const test = require("ava");
const got = require("got");
const app = require("../../index.js");


// ------------------------------- TESTS: POST /service/{serviceId}/ratings ------------------------------- //

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
 * Closes server, after tests.
 */
test.after.always(async (t) => {
    // Close the server
    t.context.server.close();
});



/**
 * Tests successful creation of a rating  [HAPPY PATH].
 */
test("createRating - Successful creation of rating", async (t) => {

    try{ 
        // Suppose client and service with the following ids exist
        const clientId = 1;
        const serviceId = 1;

        // Prepare the request body
        let requestBody = {
            clientId: clientId,
            date: "2021-05-05",
            serviceId: serviceId,
            stars: 5,
            review: "Excellent service!",
        };
    
        // POST request to create a new rating for serviceId = 1
        const ratingResponse = await t.context.got.post(`service/${serviceId}/ratings`, { json: requestBody });

        // Assertions
        t.is(ratingResponse.statusCode, 200, "Should return 200 OK for successful rating creation");
        t.truthy(ratingResponse.body, "Body should be present");
        t.is(ratingResponse.body.clientId, clientId, "Client ID in the response should match the request");
        t.is(ratingResponse.body.serviceId, serviceId, "Service ID in the response should match the endpoint");        
        t.truthy(ratingResponse.body.date, "Date should be present");

        t.is(ratingResponse.body.stars, 5, "Stars should match the request value");
        t.is(ratingResponse.body.review, "Excellent service!", "Review should match the request value");

    } catch (error) {
        t.fail(`Test encountered an unexpected error: ${error.message}`);
    }
});



/**
 * Tests successful creation of a rating without giving a review  [HAPPY PATH].
 */
test("createRating - Successful rating creation without a review", async (t) => {

    try{ 
        // Suppose client and service with the following ids exist
        const clientId = 3;
        const serviceId = 2;


        // Prepare the request body
        let requestBody = {
            clientId: clientId,
            date: "2021-05-05",
            serviceId: serviceId,
            stars: 5,
        };
    
        // POST request to create a new rating for serviceId = 1
        const ratingResponse = await t.context.got.post(`service/${serviceId}/ratings`, { json: requestBody });

        // Assertions
        t.is(ratingResponse.statusCode, 200, "Should return 200 OK for successful rating creation");
        t.truthy(ratingResponse.body, "Body should be present");
        t.is(ratingResponse.body.clientId, clientId, "Client ID in the response should match the request");
        t.is(ratingResponse.body.serviceId, serviceId, "Service ID in the response should match the endpoint");        
        t.truthy(ratingResponse.body.date, "Date should be present");

        t.is(ratingResponse.body.stars, 5, "Stars should match the request value");

    } catch (error) {
        t.fail(`Test encountered an unexpected error: ${error.message}`);
    }
});




/**
 * Tests unsuccessful creation of a rating with invalid stars number [UNHAPPY PATH]
 */
test("createRating - Invalid 'stars' value", async (t) => {

    // Suppose client with the following ids exist
    const clientId = 1;
    const serviceId = 1;

    let requestBody = {
        clientId: clientId,
        date: "2021-05-05",
        serviceId: serviceId,
        stars: 7,   // Invalid stars value
        review: "Excellent service!",
    };
    try {
        const ratingResponse = await t.context.got.post(`service/${serviceId}/ratings`, { json: requestBody });
        t.fail("Expected createRting to throw an error");
        
    } catch (error) {

        t.is(error.response.statusCode, 400);
        t.is(error.response.body.message, "request.body.stars should be <= 5");
        
    }
});



/**
 * Tests unsuccessful creation of a rating - client with clientId doesn't exist. [UNHAPPY PATH]
 */
test("createRating - Client does not exist", async (t) => {

    // Suppose service with the following id exists
    const serviceId = 1;

    // Suppose client with the following id does NOT exist
    const invalidClientId = 999;

    let requestBody = {
        clientId: invalidClientId,  // Invalid clientId (doesn't exist)
        date: "2021-05-05",
        serviceId: serviceId,
        stars: 4,
        review: "Great service!",
    };

    try {
    const ratingResponse = await t.context.got.post(`service/${serviceId}/ratings`, { json: requestBody });
    
    t.fail("Expected createRating to throw an error due to non-existent clientId");

    } catch (error) {
    t.is(error.response.statusCode, 404);
    t.is(error.response.body.message, `No client found with clientId: ${invalidClientId}`,);
    }
});



/**
 * Tests unsuccessful creation of a rating - clientId is not an integer. [UNHAPPY PATH]
 */
test("createRating - clientId not an integer", async (t) => {

    // Suppose client with the following id (not an integer)
    const clientId = "one";

    // Suppose service with the following id does NOT exists
    const serviceId = 1;

    // Prepare the request body
    let requestBody = {
        
        clientId: clientId,
        date: "2021-05-05",
        serviceId: serviceId,
        stars: 5,
        review: "Excellent service!",
    };

    try {
        const response = await t.context.got.post(`service/${serviceId}/ratings`, { json: requestBody });
        t.fail("Expected createRating to throw an error due to non-integer clientId");

    } catch (error) {
        t.is(error.response.statusCode, 400);
        t.is(error.response.body.message, "request.body.clientId should be integer");
    }
});



/**
 * Tests unsuccessful creation of a rating - clientId not provided. [UNHAPPY PATH]
 */
test("createRating - clientId not provided", async (t) => {

    // Suppose the clientId is NOT provided
    const clientId = undefined;

    // Suppose service with the following id exists
    const serviceId = 1;

    // Prepare the request body
    let requestBody = {
        
        clientId: clientId,
        date: "2021-05-05",
        serviceId: serviceId,
        stars: 5,
        review: "Excellent service!",
    };

    try {
        const response = await t.context.got.post(`service/${serviceId}/ratings`, { json: requestBody });
        t.fail("Expected createRating to throw an error due to undefined clientId");

    } catch (error) {
        t.is(error.response.statusCode, 400);
        t.is(error.response.body.message, "request.body should have required property \'clientId\'");
    }
});




// /**
//  * Tests unsuccessful creation of a rating - service with serviceId doesn't exist. [UNHAPPY PATH]
//  */
test("createRating - Service does not exist", async (t) => {

    // Suppose client with the following id exists
    const clientId = 1;

    // Suppose service with the following id does NOT exists
    const invalidServiceId = 999;

    // Prepare the request body
    let requestBody = {
        
        clientId: clientId,
        date: "2021-05-05",
        serviceId: invalidServiceId,
        stars: 5,
        review: "Excellent service!",
    };

    try {
        const response = await t.context.got.post(`service/${invalidServiceId}/ratings`, { json: requestBody });
        t.fail("Expected createRating to throw an error due to non-existent serviceId");

    } catch (error) {
         t.is(error.response.statusCode, 404);
         t.is(error.response.body.message, `No service found with serviceId: ${invalidServiceId}`);
    }
});




/**
 * Tests unsuccessful creation of a rating - serviceId is not an integer. [UNHAPPY PATH]
 */
test("createRating - serviceId not an integer", async (t) => {

    // Suppose client with the following id exists
    const clientId = 1;

    // Suppose service with the following id that is NOT an integer
    const serviceId = "one";

    // Prepare the request body
    let requestBody = {
        
        clientId: clientId,
        date: "2021-05-05",
        serviceId: serviceId,
        stars: 5,
        review: "Excellent service!",
    };

    try {
        const response = await t.context.got.post(`service/${serviceId}/ratings`, { json: requestBody });
        t.fail("Expected createRating to throw an error due to non-integer serviceId");

    } catch (error) {
        t.is(error.response.statusCode, 400);
        t.is(error.response.body.message, "request.params.serviceId should be integer, request.body.serviceId should be integer");
    }
});




/**
 * Tests unsuccessful creation of a rating - serviceId not provided. [UNHAPPY PATH]
 */
test("createRating - serviceId not provided", async (t) => {

    // Suppose client with the following id exists
    const clientId = 1;

    // Suppose the serviceId is NOT provided
    const serviceId = undefined;

    // Prepare the request body
    let requestBody = {
        
        clientId: clientId,
        date: "2021-05-05",
        serviceId: serviceId,
        stars: 5,
        review: "Excellent service!",
    };

    try {
        const response = await t.context.got.post(`service/${serviceId}/ratings`, { json: requestBody });
        t.fail("Expected createRating to throw an error due to undifined serviceId");

    } catch (error) {
        t.is(error.response.statusCode, 400);
        t.is(error.response.body.message, "request.params.serviceId should be integer, request.body should have required property \'serviceId\'");
    }
});


