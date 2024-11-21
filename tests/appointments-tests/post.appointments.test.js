const http = require("http");
const test = require("ava");
const got = require("got");
const app = require("../../index.js");

// ------------------------------------------ TESTS: POST /appointments ------------------------------------------ //

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
 * Tests successful creation of an appointment [HAPPY PATH].
 */
test("Unit Test POST /appointments - Successful creation of appointment", async (t) => {
  try {
    // Suppose client and service with the following ids exist
    const clientId = 1;
    const serviceId = 1;

    // Create a new appointment
    const newAppointment = {
      clientId: clientId,
      serviceId: serviceId,
      serviceDetails: "Need to fix my car",
      status: "Confirmation Pending",
      timeSlot:
        {
          availability: true,
          date: "2024-12-20",
          startingTime: "15:00:00",
        },
    };

    const appointmentResponse = await t.context.got.post("appointments", {
      json: newAppointment,
    });

    // Assert that the response status is 200 OK
    t.is(
      appointmentResponse.statusCode,
      200,
      "Should return 200 OK for successful appointment creation"
    );

    // Assert that the response body contains the appointment details
    t.truthy(appointmentResponse.body, "Body should be present");
    t.truthy(
      appointmentResponse.body.appointmentId,
      "Appointment ID should be present"
    );
    t.is(appointmentResponse.body.clientId, clientId, "Client ID should match");
    t.is(
      appointmentResponse.body.serviceId,
      serviceId,
      "Service ID should match"
    );
  } catch (error) {
    t.fail(`Test encountered an unexpected error: ${error.message}`);
  }
});

/**
 * Tests unsuccessful creation of an appointment - clientId doesn't match [UNHAPPY PATH].
 */
test("Unit Test POST /appointments - Unsuccessful creation of appointment: clientId doesn't match", async (t) => {
  try {
    // Suppose the client's id doesn't match
    const clientId = 4;
    const serviceId = 1;

    // Create a new appointment
    const newAppointment = {
      clientId: clientId,
      serviceId: serviceId,
      serviceDetails: "Need to fix my car",
      status: "Confirmation Pending",
      timeSlot:
        {
          availability: true,
          date: "2024-12-20",
          startingTime: "15:00:00",
        },
    };

    // Make the POST request
    const error = await t.throwsAsync(
      () => t.context.got.post("appointments", { json: newAppointment }),
      { instanceOf: t.context.got.HTTPError }
    );

    // Assert that the API returned the expected error response
    t.is(error.response.statusCode, 404, "Should return 404");
    t.is(
      error.response.body.message,
      `No client found with clientId: ${clientId}`
    );
  } catch (error) {
    t.fail(`Test encountered an unexpected error: ${error.message}`);
  }
});

/**
 * Tests unsuccessful creation of an appointment - clientId not provided [UNHAPPY PATH].
 */
test("Unit Test POST /appointments - Unsuccessful creation of appointment: clientId not provided", async (t) => {
  try {
    // Suppose the client's id not provided
    const clientId = undefined;
    const serviceId = 1;

    // Create a new appointment
    const newAppointment = {
      clientId: clientId,
      serviceId: serviceId,
      serviceDetails: "Need to fix my car",
      status: "Confirmation Pending",
      timeSlot:
        {
          availability: true,
          date: "2024-12-20",
          startingTime: "15:00:00",
        },
    };

    // Make the POST request
    const error = await t.throwsAsync(
      () => t.context.got.post("appointments", { json: newAppointment }),
      { instanceOf: t.context.got.HTTPError }
    );

    // Assert that the API returned the expected error response
    t.is(error.response.statusCode, 400, "Should return 400");
    t.is(
      error.response.body.message,
      "request.body should have required property 'clientId'"
    );
  } catch (error) {
    t.fail(`Test encountered an unexpected error: ${error.message}`);
  }
});

/**
 * Tests unsuccessful creation of an appointment - clientId is not integer [UNHAPPY PATH].
 */
test("Unit Test POST /appointments - Unsuccessful creation of appointment: clientId is not integer", async (t) => {
  try {
    // Suppose the clientId is not integer
    const clientId = "hi";
    const serviceId = 1;

    // Create a new appointment
    const newAppointment = {
      clientId: clientId,
      serviceId: serviceId,
      serviceDetails: "Need to fix my car",
      status: "Confirmation Pending",
      timeSlot:
        {
          availability: true,
          date: "2024-12-20",
          startingTime: "15:00:00",
        },
    };

    // Make the POST request
    const error = await t.throwsAsync(
      () => t.context.got.post("appointments", { json: newAppointment }),
      { instanceOf: t.context.got.HTTPError }
    );

    // Assert that the API returned the expected error response
    t.is(error.response.statusCode, 400, "Should return 400");
    t.is(
      error.response.body.message,
      "request.body.clientId should be integer"
    );
  } catch (error) {
    t.fail(`Test encountered an unexpected error: ${error.message}`);
  }
});

/**
 * Tests unsuccessful creation of an appointment - serviceId doesn't match [UNHAPPY PATH].
 */
test("Unit Test POST /appointments - Unsuccessful creation of appointment: serviceId doesn't match", async (t) => {
  try {
    // Suppose the service's id doesn't match
    const clientId = 1;
    const serviceId = 4;

    // Create a new appointment
    const newAppointment = {
      clientId: clientId,
      serviceId: serviceId,
      serviceDetails: "Need to fix my car",
      status: "Confirmation Pending",
      timeSlot:
        {
          availability: true,
          date: "2024-12-20",
          startingTime: "15:00:00",
        },
    };

    // Make the POST request
    const error = await t.throwsAsync(
      () => t.context.got.post("appointments", { json: newAppointment }),
      { instanceOf: t.context.got.HTTPError }
    );

    // Assert that the API returned the expected error response
    t.is(error.response.statusCode, 404, "Should return 404");
    t.is(
      error.response.body.message,
      `No service found with serviceId: ${serviceId}`
    );
  } catch (error) {
    t.fail(`Test encountered an unexpected error: ${error.message}`);
  }
});

/**
 * Tests unsuccessful creation of an appointment - serviceId not provided [UNHAPPY PATH].
 */
test("Unit Test POST /appointments - Unsuccessful creation of appointment: serviceId not provided", async (t) => {
  try {
    // Suppose the service's id not provided
    const clientId = 1;
    const serviceId = undefined;

    // Create a new appointment
    const newAppointment = {
      clientId: clientId,
      serviceId: serviceId,
      serviceDetails: "Need to fix my car",
      status: "Confirmation Pending",
      timeSlot: 
        {
          availability: true,
          date: "2024-12-20",
          startingTime: "15:00:00",
        },
    };

    // Make the POST request
    const error = await t.throwsAsync(
      () => t.context.got.post("appointments", { json: newAppointment }),
      { instanceOf: t.context.got.HTTPError }
    );

    // Assert that the API returned the expected error response
    t.is(error.response.statusCode, 400, "Should return 400");
    t.is(
      error.response.body.message,
      "request.body should have required property 'serviceId'"
    );
  } catch (error) {
    t.fail(`Test encountered an unexpected error: ${error.message}`);
  }
});

/**
 * Tests unsuccessful creation of an appointment - serviceId is not integer [UNHAPPY PATH].
 */
test("Unit Test POST /appointments - Unsuccessful creation of appointment: serviceId is not integer", async (t) => {
  try {
    // Suppose the serviceId is not integer
    const clientId = 1;
    const serviceId = "hi";

    // Create a new appointment
    const newAppointment = {
      clientId: clientId,
      serviceId: serviceId,
      serviceDetails: "Need to fix my car",
      status: "Confirmation Pending",
      timeSlot:
        {
          availability: true,
          date: "2024-12-20",
          startingTime: "15:00:00",
        },
    };

    // Make the POST request
    const error = await t.throwsAsync(
      () => t.context.got.post("appointments", { json: newAppointment }),
      { instanceOf: t.context.got.HTTPError }
    );

    // Assert that the API returned the expected error response
    t.is(error.response.statusCode, 400, "Should return 400");
    t.is(
      error.response.body.message,
      "request.body.serviceId should be integer"
    );
  } catch (error) {
    t.fail(`Test encountered an unexpected error: ${error.message}`);
  }
});

/**
 * Tests unsuccessful creation of an appointment - timeSlot not provided [UNHAPPY PATH].
 */
test("Unit Test POST /appointments - Unsuccessful creation of appointment: timeSlot not provided", async (t) => {
  try {
    // Suppose timeSlot not provided
    const clientId = 1;
    const serviceId = 1;

    const timeSlot = undefined;

    // Create a new appointment
    const newAppointment = {
      clientId: clientId,
      serviceId: serviceId,
      serviceDetails: "Need to fix my car",
      status: "Confirmation Pending",
      timeSlot: timeSlot,
    };

    // Make the POST request
    const error = await t.throwsAsync(
      () => t.context.got.post("appointments", { json: newAppointment }),
      { instanceOf: t.context.got.HTTPError }
    );

    // Assert that the API returned the expected error response
    t.is(error.response.statusCode, 400, "Should return 400");
    t.is(
      error.response.body.message,
      "request.body should have required property 'timeSlot'"
    );
  } catch (error) {
    t.fail(`Test encountered an unexpected error: ${error.message}`);
  }
});
