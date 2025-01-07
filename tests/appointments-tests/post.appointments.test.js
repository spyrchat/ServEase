const http = require("http");
const test = require("ava");
const got = require("got");
const app = require("../../index.js");

// Helper function to create new appointments
function createNewAppointment(overrides = {}) {
  return {
    clientId: 1,
    serviceId: 1,
    serviceDetails: "Need to fix my car",
    status: "Confirmation Pending",
    timeSlot: {
      availability: true,
      date: "2024-12-20",
      startingTime: "15:00:00",
    },
    ...overrides,
  };
}

// Helper function to handle POST request errors
async function assertPostError(t, newAppointment, expectedStatusCode, expectedMessage) {
  const error = await t.throwsAsync(
    () => t.context.got.post("appointments", { json: newAppointment }),
    { instanceOf: t.context.got.HTTPError }
  );
  t.is(error.response.statusCode, expectedStatusCode);
  t.is(error.response.body.message, expectedMessage);
}

// ------------------------------------------ TESTS: POST /appointments ------------------------------------------ //

/**
 * Opens server, before tests.
 */
test.before(async (t) => {
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
 * Tests successful creation of an appointment. [HAPPY PATH]
 */
test("Unit Test POST /appointments - Successful creation of appointment", async (t) => {
  const newAppointment = createNewAppointment();
  const appointmentResponse = await t.context.got.post("appointments", {
    json: newAppointment,
  });
  t.is(appointmentResponse.statusCode, 200, "Should return 200 OK");
  t.truthy(appointmentResponse.body);
  t.truthy(appointmentResponse.body.appointmentId);
  t.is(appointmentResponse.body.clientId, newAppointment.clientId);
  t.is(appointmentResponse.body.serviceId, newAppointment.serviceId);
});

/**
 * Tests unsuccessful creation of an appointment - clientId doesn't match. [UNHAPPY PATH]
 */
test("Unit Test POST /appointments - Unsuccessful creation of appointment: clientId doesn't match", async (t) => {
  const newAppointment = createNewAppointment({ clientId: 4 });
  await assertPostError(
    t,
    newAppointment,
    404,
    "No client found with clientId: 4"
  );
});

/**
 * Tests unsuccessful creation of an appointment - clientId not provided. [UNHAPPY PATH]
 */
test("Unit Test POST /appointments - Unsuccessful creation of appointment: clientId not provided", async (t) => {
  const newAppointment = createNewAppointment({ clientId: undefined });
  await assertPostError(
    t,
    newAppointment,
    400,
    "request.body should have required property 'clientId'"
  );
});

/**
 * Tests unsuccessful creation of an appointment - clientId is not integer. [UNHAPPY PATH]
 */
test("Unit Test POST /appointments - Unsuccessful creation of appointment: clientId is not integer", async (t) => {
  const newAppointment = createNewAppointment({ clientId: "hi" });
  await assertPostError(
    t,
    newAppointment,
    400,
    "request.body.clientId should be integer"
  );
});

/**
 * Tests unsuccessful creation of an appointment - serviceId doesn't match. [UNHAPPY PATH]
 */
test("Unit Test POST /appointments - Unsuccessful creation of appointment: serviceId doesn't match", async (t) => {
  const newAppointment = createNewAppointment({ serviceId: 4 });
  await assertPostError(
    t,
    newAppointment,
    404,
    "No service found with serviceId: 4"
  );
});

/**
 * Tests unsuccessful creation of an appointment - serviceId not provided. [UNHAPPY PATH]
 */
test("Unit Test POST /appointments - Unsuccessful creation of appointment: serviceId not provided", async (t) => {
  const newAppointment = createNewAppointment({ serviceId: undefined });
  await assertPostError(
    t,
    newAppointment,
    400,
    "request.body should have required property 'serviceId'"
  );
});

/**
 * Tests unsuccessful creation of an appointment - serviceId is not integer. [UNHAPPY PATH]
 */
test("Unit Test POST /appointments - Unsuccessful creation of appointment: serviceId is not integer", async (t) => {
  const newAppointment = createNewAppointment({ serviceId: "hi" });
  await assertPostError(
    t,
    newAppointment,
    400,
    "request.body.serviceId should be integer"
  );
});

/**
 * Tests unsuccessful creation of an appointment - timeSlot not provided. [UNHAPPY PATH]
 */
test("Unit Test POST /appointments - Unsuccessful creation of appointment: timeSlot not provided", async (t) => {
  const newAppointment = createNewAppointment({ timeSlot: undefined });
  await assertPostError(
    t,
    newAppointment,
    400,
    "request.body should have required property 'timeSlot'"
  );
});