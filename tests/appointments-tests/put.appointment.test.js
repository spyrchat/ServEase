const http = require("http");
const test = require("ava");
const got = require("got");
const app = require("../../index.js");

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
 * Utility function for sending PUT requests and handling assertions.
 */
async function sendPutRequest(t, endpoint, requestBody, expectedStatusCode, expectedMessage) {
  try {
    await t.context.got.put(endpoint, { json: requestBody });
    t.fail("Request should not succeed.");
  } catch (error) {
    t.is(error.response.statusCode, expectedStatusCode);
    t.is(error.response.body.message, expectedMessage);
  }
}

/**
 * Tests successful modification of an appointment [HAPPY PATH].
 */
test("editServiceAppointment - Successful appointment modification", async (t) => {
  const appointmentId = 1;
  const requestBody = {
    appointmentId,
    clientId: 1,
    serviceId: 1,
    serviceDetails: "Need to fix my fridge",
    status: "Confirmed",
    timeSlot: {
      availability: true,
      date: "2024-12-20",
      startingTime: "15:00:00",
    },
  };

  const appointmentResponse = await t.context.got.put(
    `appointments/${appointmentId}`,
    { json: requestBody }
  );

  t.is(appointmentResponse.statusCode, 200);
  t.deepEqual(appointmentResponse.body, requestBody);
});

/**
 * Tests unsuccessful modification of an appointment - appointment does NOT exist [UNHAPPY PATH].
 */
test("editServiceAppointment - Appointment doesn't exist", async (t) => {
  const invalidAppointmentId = 999;
  const requestBody = {
    appointmentId: invalidAppointmentId,
    clientId: 1,
    serviceId: 1,
    serviceDetails: "Need to fix my fridge",
    status: "Confirmed",
    timeSlot: {
      availability: true,
      date: "2024-12-20",
      startingTime: "15:00:00",
    },
  };

  await sendPutRequest(
    t,
    `appointments/${invalidAppointmentId}`,
    requestBody,
    404,
    `No appointment found with appointmentId: ${invalidAppointmentId}`
  );
});

/**
 * Tests unsuccessful modification of appointmentId [UNHAPPY PATH].
 */
test("editServiceAppointment - Attempt to modify appointmentId should fail", async (t) => {
  const appointmentId = 1;
  const requestBody = {
    appointmentId: 2,
    clientId: 1,
    serviceId: 1,
    serviceDetails: "Updated details",
    status: "Confirmed",
    timeSlot: {
      availability: true,
      date: "2024-12-21",
      startingTime: "14:00:00",
    },
  };

  await sendPutRequest(
    t,
    `appointments/${appointmentId}`,
    requestBody,
    400,
    "The following fields cannot be updated: appointmentId."
  );
});

/**
 * Tests unsuccessful modification of clientId [UNHAPPY PATH].
 */
test("editServiceAppointment - Attempt to modify clientId should fail", async (t) => {
  const appointmentId = 1;
  const requestBody = {
    appointmentId: 1,
    clientId: 10,
    serviceId: 1,
    serviceDetails: "Updated details",
    status: "Confirmed",
    timeSlot: {
      availability: true,
      date: "2024-12-21",
      startingTime: "14:00:00",
    },
  };

  await sendPutRequest(
    t,
    `appointments/${appointmentId}`,
    requestBody,
    400,
    "The following fields cannot be updated: clientId."
  );
});

/**
 * Tests unsuccessful modification of serviceId [UNHAPPY PATH].
 */
test("editServiceAppointment - Attempt to modify serviceId should fail", async (t) => {
  const appointmentId = 1;
  const requestBody = {
    appointmentId: 1,
    clientId: 1,
    serviceId: 3,
    serviceDetails: "Updated details",
    status: "Confirmed",
    timeSlot: {
      availability: true,
      date: "2024-12-21",
      startingTime: "14:00:00",
    },
  };

  await sendPutRequest(
    t,
    `appointments/${appointmentId}`,
    requestBody,
    400,
    "The following fields cannot be updated: serviceId."
  );
});

/**
 * Tests unsuccessful modification of multiple fields [UNHAPPY PATH].
 */
test("editServiceAppointment - Attempt to modify multiple non-updatable fields", async (t) => {
  const appointmentId = 1;
  const requestBody = {
    appointmentId: 2,
    clientId: 10,
    serviceId: 15,
    serviceDetails: "Updated details",
    status: "Confirmed",
    timeSlot: {
      availability: true,
      date: "2024-12-21",
      startingTime: "14:00:00",
    },
  };

  await sendPutRequest(
    t,
    `appointments/${appointmentId}`,
    requestBody,
    400,
    "The following fields cannot be updated: appointmentId, clientId, serviceId."
  );
});
