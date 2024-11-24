const http = require("http");
const test = require("ava");
const got = require("got");
const app = require("../../index.js");

// ------------------------------------------ TESTS: GET /appointments ------------------------------------------ //

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
 * Tests successful fetch of appointments by serviceId. [HAPPY PATH]
 */
test("Unit Test GET /appointments - Successful Fetch appointments by serviceId", async (t) => {
  try {
    // Suppose serviceId exists
    const serviceId = 2;

    // Fetch appointments
    const appointmentsResponse = await t.context.got.get("appointments", {
      searchParams: { serviceId: serviceId },
    });

    // Assert that the response status is 200 OK
    t.is(
      appointmentsResponse.statusCode,
      200,
      "Should return 200 OK for successful appointment fetch"
    );

    // Assert that the response body contains the appointment details
    t.truthy(appointmentsResponse.body, "Body should be present");

    appointmentsResponse.body.forEach((appointment) => {
      t.is(appointment.serviceId, serviceId);
    });
  } catch (error) {
    t.fail(`Test encountered an unexpected error: ${error.message}`);
  }
});

/**
 * Tests successful fetch of appointments by clientId. [HAPPY PATH]
 */
test("Unit Test GET /appointments - Successful Fetch appointments by clientId", async (t) => {
  try {
    // Suppose clientId exists
    const clientId = 1;

    // Fetch appointments
    const appointmentsResponse = await t.context.got.get("appointments", {
      searchParams: { clientId: clientId },
    });

    // Assert that the response status is 200 OK
    t.is(
      appointmentsResponse.statusCode,
      200,
      "Should return 200 OK for successful appointment fetch"
    );

    // Assert that the response body contains the appointment details
    t.truthy(appointmentsResponse.body, "Body should be present");

    appointmentsResponse.body.forEach((appointment) => {
      t.is(appointment.clientId, clientId);
    });
  } catch (error) {
    t.fail(`Test encountered an unexpected error: ${error.message}`);
  }
});

/**
 * Tests successful fetch of appointments by clientId and serviceId. [HAPPY PATH]
 */
test("Unit Test GET /appointments - Successful Fetch appointments by clientId and serviceId", async (t) => {
  try {
    // Suppose clientId and serviceId exist
    const clientId = 1;
    const serviceId = 1;

    // Fetch appointments
    const appointmentsResponse = await t.context.got.get("appointments", {
      searchParams: { clientId: clientId, serviceId: serviceId },
    });

    // Assert that the response status is 200 OK
    t.is(
      appointmentsResponse.statusCode,
      200,
      "Should return 200 OK for successful appointment fetch"
    );

    // Assert that the response body contains the appointment details
    t.truthy(appointmentsResponse.body, "Body should be present");

    appointmentsResponse.body.forEach((appointment) => {
      t.is(appointment.clientId, clientId);
      t.is(appointment.serviceId, serviceId);
    });
  } catch (error) {
    t.fail(`Test encountered an unexpected error: ${error.message}`);
  }
});

/**
 * Tests unsuccessful fetch of appointments by clientId: clientId is not integer. [UNHAPPY PATH]
 */
test("Unit Test GET /appointments - Unsuccessful Fetch appointments by clientId: clientId is not integer", async (t) => {
  try {
    // Suppose serviceId is not integer
    const clientId = "hi";

    // Fetch appointments
    const error = await t.throwsAsync(
      () =>
        t.context.got.get("appointments", {
          searchParams: { clientId: clientId },
        }),
      { instanceOf: t.context.got.HTTPError }
    );

    // Assert that the API returned the expected error response
    t.is(error.response.statusCode, 400, "Should return 400");
    t.is(
      error.response.body.message,
      "request.query.clientId should be integer"
    );
  } catch (error) {
    t.fail(`Test encountered an unexpected error: ${error.message}`);
  }
});

/**
 * Tests unsuccessful fetch of appointments by serviceId: serviceId is not integer. [UNHAPPY PATH]
 */
test("Unit Test GET /appointments - Unsuccessful Fetch appointments by serviceId: serviceId is not integer", async (t) => {
  try {
    // Suppose serviceId is not integer
    const serviceId = "hi";

    // Fetch appointments
    const error = await t.throwsAsync(
      () =>
        t.context.got.get("appointments", {
          searchParams: { serviceId: serviceId },
        }),
      { instanceOf: t.context.got.HTTPError }
    );

    // Assert that the API returned the expected error response
    t.is(error.response.statusCode, 400, "Should return 400");
    t.is(
      error.response.body.message,
      "request.query.serviceId should be integer"
    );
  } catch (error) {
    t.fail(`Test encountered an unexpected error: ${error.message}`);
  }
});