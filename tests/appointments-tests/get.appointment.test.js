const http = require("http");
const test = require("ava");
const got = require("got");
const app = require("../../index.js");

// ------------------------------------------ TESTS: GET /appointment/{appointmentId} ------------------------------------------ //

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
 * Tests successful fetch of an appointment by appointmentId. [HAPPY PATH]
 */
test("Unit Test GET /appointment/{appointmentId} - Successful Fetch appointment by appointmentId", async (t) => {
  try {
    // Suppose appointmentId exists
    const appointmentId = 1;

    // Fetch appointment
    const appointmentResponse = await t.context.got.get(
      `appointments/${appointmentId}`
    );

    // Assert that the response status is 200 OK
    t.is(
      appointmentResponse.statusCode,
      200,
      "Should return 200 OK for successful appointment fetch"
    );

    // Assert that the response body contains the appointment details
    t.truthy(appointmentResponse.body, "Body should be present");
    t.truthy(
      appointmentResponse.body.appointmentId,
      "Appointment ID should be present"
    );
  } catch (error) {
    t.fail(`Test encountered an unexpected error: ${error.message}`);
  }
});

/**
 * Tests unsuccessful fetch of an appointment by appointmentId: appointmentId doesn't match. [UNHAPPY PATH]
 */
test("Unit Test GET /appointment/{appointmentId} - Unsuccessful Fetch appointment by appointmentId: appointmentId doesn't match", async (t) => {
  try {
    // Suppose appointmentId doesn't match
    const appointmentId = 4;

    // Make the GET request
    const error = await t.throwsAsync(
      () => t.context.got.get(`appointments/${appointmentId}`),
      { instanceOf: t.context.got.HTTPError }
    );

    // Assert that the API returned the expected error response
    t.is(error.response.statusCode, 404, "Should return 404");
    t.is(
      error.response.body.message,
      `No appointment found with appointmentId: ${appointmentId}`
    );
  } catch (error) {
    t.fail(`Test encountered an unexpected error: ${error.message}`);
  }
});

/**
 * Tests unsuccessful fetch of an appointment by appointmentId: appointmentId is not positive. [UNHAPPY PATH]
 */
test("Unit Test GET /appointment/{appointmentId} - Unsuccessful Fetch appointment by appointmentId: appointmentId is not positive", async (t) => {
  try {
    // Suppose appointmentId is not positive
    const appointmentId = -4;

    // Make the GET request
    const error = await t.throwsAsync(
      () => t.context.got.get(`appointments/${appointmentId}`),
      { instanceOf: t.context.got.HTTPError }
    );

    // Assert that the API returned the expected error response
    t.is(error.response.statusCode, 400, "Should return 400");
    t.is(error.response.body.message, "appointmentId must be positive integer");
  } catch (error) {
    t.fail(`Test encountered an unexpected error: ${error.message}`);
  }
});

/**
 * Tests unsuccessful fetch of an appointment by appointmentId: appointmentId is not integer. [UNHAPPY PATH]
 */
test("Unit Test GET /appointment/{appointmentId} - Unsuccessful Fetch appointment by appointmentId: appointmentId is not integer", async (t) => {
  try {
    // Suppose appointmentId is not integer
    const appointmentId = "hi";

    // Make the GET request
    const error = await t.throwsAsync(
      () => t.context.got.get(`appointments/${appointmentId}`),
      { instanceOf: t.context.got.HTTPError }
    );

    // Assert that the API returned the expected error response
    t.is(error.response.statusCode, 400, "Should return 400");
    t.is(
      error.response.body.message,
      "request.params.appointmentId should be integer"
    );
  } catch (error) {
    t.fail(`Test encountered an unexpected error: ${error.message}`);
  }
});
