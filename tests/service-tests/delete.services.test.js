const http = require("http");
const test = require("ava");
const got = require("got");
const app = require("../../index.js");

// ------------------------------------------ TESTS: DELETE /services ------------------------------------------ //

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
 * Tests successful deletion of a service [HAPPY PATH].
 */
test("Delete a service successfully", async (t) => {
  const serviceId = 1;

  // Make the DELETE request to delete a service
  const serviceResponse = await t.context.got.delete(`services/${serviceId}`);

  // Assert that the response status is 200 OK
  t.is(
    serviceResponse.statusCode,
    200,
    "Service deletion should return status 200"
  );
});

/**
 * Tests deletion with an undefined serviceId in the path [UNHAPPY PATH].
 */
test("Undefined serviceId in path", async (t) => {
  const serviceId = undefined;

  // Attempt to delete a service with an undefined serviceId
  try {
    const serviceResponse = await t.context.got.delete(`services/${serviceId}`);
    t.fail("Expected the DELETE request to throw an error");
  } catch (error) {
    // Assert that the API returns a 400 error for undefined serviceId
    t.is(error.response.statusCode, 400);
    t.is(
      error.response.body.message,
      "request.params.serviceId should be integer"
    );
  }
});

/**
 * Tests deletion with a null serviceId in the path [UNHAPPY PATH].
 */
test("Null serviceId in path", async (t) => {
  const serviceId = null;

  // Attempt to delete a service with a null serviceId
  try {
    const serviceResponse = await t.context.got.delete(`services/${serviceId}`);
    t.fail("Expected the DELETE request to throw an error");
  } catch (error) {
    // Assert that the API returns a 400 error for null serviceId
    t.is(error.response.statusCode, 400);
    t.is(
      error.response.body.message,
      "request.params.serviceId should be integer"
    );
  }
});

/**
 * Tests deletion with a negative serviceId in the path [UNHAPPY PATH].
 */
test("Negative serviceId in path", async (t) => {
  const serviceId = -2;

  // Attempt to delete a service with a negative serviceId
  try {
    const serviceResponse = await t.context.got.delete(`services/${serviceId}`);
    t.fail("Expected the DELETE request to throw an error");
  } catch (error) {
    // Assert that the API returns a 400 error for negative serviceId
    t.is(error.response.statusCode, 400);
    t.is(
      error.response.body.message,
      "'serviceId' must be a positive integer."
    );
  }
});

/**
 * Tests deletion with a non-existent serviceId in the path [UNHAPPY PATH].
 */
test("Non existent serviceId", async (t) => {
  const serviceId = 5;

  // Attempt to delete a non-existent service
  try {
    const serviceResponse = await t.context.got.delete(`services/${serviceId}`);
    t.fail("Expected the DELETE request to throw an error");
  } catch (error) {
    // Assert that the API returns a 404 error for non-existent serviceId
    t.is(error.response.statusCode, 404);
    t.is(
      error.response.body.message,
      `No service found with serviceId: ${serviceId}`
    );
  }
});
