const http = require("http");
const test = require("ava");
const got = require("got");
const app = require("../../index.js");
const { respondWithCode } = require("../../utils/writer.js");

// Helper function to generate request bodies for appointment updates
function createAppointmentUpdate(overrides = {}) {
  return {
    appointmentId: 1,
    clientId: 1,
    serviceId: 1,
    serviceDetails: "Need to fix my fridge",
    status: "Confirmed",
    timeSlot: {
      availability: true,
      date: "2024-12-20",
      startingTime: "15:00:00",
    },
    ...overrides,
  };
}

// Helper function to handle PUT request errors
async function assertPutError(t, appointmentId, requestBody, expectedResponse) {
  try {
    await t.context.got.put(`appointments/${appointmentId}`, { json: requestBody });
    t.fail("Expected editServiceAppointment to throw an error");
  } catch (error) {
    t.is(error.response.statusCode, expectedResponse.code);
    t.is(error.response.body.message, expectedResponse.payload);
  }
}

// ------------------------------- TESTS: PUT /appointments/{appointmentId} ------------------------------- //

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
test.after.always(async (t) => {
  t.context.server.close();
});

/**
 * Tests successful modification of an appointment  [HAPPY PATH].
 */
test("editServiceAppointment - Successful appointment modification", async (t) => {
  const appointmentId = 1;
  const requestBody = createAppointmentUpdate({ status: "Confirmed" });
  const appointmentResponse = await t.context.got.put(
    `appointments/${appointmentId}`,
    { json: requestBody }
  );
  t.is(appointmentResponse.statusCode, 200);
  t.deepEqual(
    appointmentResponse.body,
    {
      appointmentId: appointmentId,
      clientId: requestBody.clientId,
      serviceDetails: requestBody.serviceDetails,
      serviceId: requestBody.serviceId,
      status: requestBody.status,
      timeSlot: requestBody.timeSlot,
    },
    "Response body should reflect the updated appointment details"
  );
});

/**
 * Tests unsuccessful modification of an appointment - appointment with appointmentId does NOT exist [UNHAPPY PATH].
 */
test("editServiceAppointment - Appointment doesn't exist", async (t) => {
  const invalidAppointmentId = 999;
  const requestBody = createAppointmentUpdate({ appointmentId: invalidAppointmentId });
  expectedResponse = respondWithCode(404, `No appointment found with appointmentId: ${invalidAppointmentId}`)

  await assertPutError(
    t,
    invalidAppointmentId,
    requestBody,
    expectedResponse
  );
});

/**
 * Tests unsuccessful modification of an appointment - Attempt to modify appointmentId [UNHAPPY PATH].
 */
test("editServiceAppointment - Attempt to modify appointmentId should fail", async (t) => {
  const appointmentId = 1;
  const requestBody = createAppointmentUpdate({ appointmentId: 2 });
  expectedResponse = respondWithCode(400, "The following fields cannot be updated: appointmentId.")

  await assertPutError(
    t,
    appointmentId,
    requestBody,
    expectedResponse
  );

});

/**
 * Tests unsuccessful modification of an appointment - Attempt to modify clientId [UNHAPPY PATH].
 */
test("editServiceAppointment - Attempt to modify clientId should fail", async (t) => {
  const appointmentId = 1;
  const requestBody = createAppointmentUpdate({ clientId: 10 });
  expectedResponse = respondWithCode(400, "The following fields cannot be updated: clientId.")

  await assertPutError(
    t,
    appointmentId,
    requestBody,
    expectedResponse
  );

});

/**
 * Tests unsuccessful modification of an appointment - Attempt to modify serviceId [UNHAPPY PATH].
 */
test("editServiceAppointment - Attempt to modify serviceId should fail", async (t) => {
  const appointmentId = 1;
  const requestBody = createAppointmentUpdate({ serviceId: 3 });
  expectedResponse = respondWithCode(400, "The following fields cannot be updated: serviceId.")

  await assertPutError(
    t,
    appointmentId,
    requestBody,
    expectedResponse
  );

});

/**
 * Tests unsuccessful modification of an appointment - Attempt to modify appointmentId, clientId, and serviceId [UNHAPPY PATH].
 */
test("editServiceAppointment - Attempt to modify appointmentId, clientId, and serviceId should fail", async (t) => {
  const appointmentId = 1;
  const requestBody = createAppointmentUpdate({
    appointmentId: 2,
    clientId: 10,
    serviceId: 15,
  });
  expectedResponse = respondWithCode(400, "The following fields cannot be updated: appointmentId, clientId, serviceId.")

  await assertPutError(
    t,
    appointmentId,
    requestBody,
    expectedResponse
  );
  
});