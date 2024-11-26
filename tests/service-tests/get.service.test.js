const http = require("http");
const test = require("ava");
const got = require("got");
const app = require("../../index.js");

// ------------------------------------------ TESTS: GET /services/{serviceId} ------------------------------------------ //

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
test.after.always((t) => {
  t.context.server.close();
});

/**
 * Tests successful retrieval of a service. [HAPPY PATH]
 */
test("Unit Test GET /services/{serviceId} - Successful retrieval of service", async (t) => {
  try {
    // Suppose service with the following id exists
    const serviceId = 1;

    const serviceResponse = await t.context.got.get(`services/${serviceId}`);

    // Assert that the response status is 200 OK
    t.is(
      serviceResponse.statusCode,
      200,
      "Should return 200 OK for successful service fetch"
    );

    // Assert that the response body contains the service details
    t.truthy(serviceResponse.body, "Body should be present");
    t.truthy(serviceResponse.body.serviceId, "Service ID should be present");
  } catch (error) {
    t.fail(`Test encountered an unexpected error: ${error.message}`);
  }
});

/**
 * Tests unsuccessful retrieval of a service - serviceId doesn't exist. [UNHAPPY PATH]
 */
test("Unit Test GET /services/{serviceId} - Unsuccessful retrieval of service: serviceId doesn't exist", async (t) => {
  try {
    // Suppose the serviceId does not exist
    const serviceId = 4;

    const error = await t.throwsAsync(
      () => t.context.got.get(`services/${serviceId}`),
      { instanceOf: t.context.got.HTTPError }
    );

    // Assert that the API returned the expected error response
    t.is(error.response.statusCode, 404, "Should return 404");
    t.is(
      error.response.body.message,
      `No service found with serviceId: ${serviceId}.`
    );
  } catch (error) {
    t.fail(`Test encountered an unexpected error: ${error.message}`);
  }
});

/**
 * Tests unsuccessful retrieval of a service - serviceId is not integer. [UNHAPPY PATH]
 */
test("Unit Test GET /services/{serviceId} - Unsuccessful retrieval of service: serviceId is not integer", async (t) => {
  try {
    // Suppose the serviceId is not an integer
    const serviceId = "abc";

    const error = await t.throwsAsync(
      () => t.context.got.get(`services/${serviceId}`),
      { instanceOf: t.context.got.HTTPError }
    );

    // Assert that the API returned the expected error response
    t.is(error.response.statusCode, 400, "Should return 400");
    t.is(
      error.response.body.message,
      "request.params.serviceId should be integer"
    );
  } catch (error) {
    t.fail(`Test encountered an unexpected error: ${error.message}`);
  }
});
