const http = require("http");
const test = require("ava");
const got = require("got");
const app = require("../../index.js");
const { console } = require("inspector");


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
test("createRating - Successful rating creation", async (t) => {

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


// Successful rating creation if review is missing

// correct ratings
// client with client id exists
// service with service id exists


////////// should i test if 'stars' is integer too?

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
        const ratingResponse = await t.context.got.post(`service/${serviceId}/ratings`, { json: invalidBody });
        t.fail("Expected createRting to throw an error");
    } catch (error) {
        console.log("xixixi")
        console.log(error)
        //t.is(error.response.statusCode, 400);
        //t.is(error.response.body.message, "'stars' must be an integer between 1 and 5.");
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
 * Tests unsuccessful creation of a rating - client with clientId doesn't exist. [UNHAPPY PATH]
 */
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




//////////// should i test if 'stars' is integer too?

// should i check if client and service id are integers and not undifined??
