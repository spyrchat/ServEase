const http = require("http");
const test = require("ava");
const got = require("got");
const app = require("../../index.js");
const { respondWithCode } = require("../../utils/writer.js");

// Helper function to generate service body
function createServiceBody(overrides = {}) {
  return {
    serviceId: 1,
    userType: "service",
    serviceType: "Plumbing",
    description: "Amazing plumbing services.",
    city: "Los Angeles",
    address: "456 Elm Street",
    country: "USA",
    postalCode: 90001,
    email: "plumbing.services@example.com",
    phone: "9876543210",
    rating: 4.5,
    serviceImg: "binaryImageData",
    availableTimeSlots: [
      {
        availability: true,
        date: "2023-12-01",
        startingTime: "09:00:00",
      },
    ],
    ...overrides,
  };
}

// Helper function to handle expected errors
async function assertPutError(t, serviceId, body, expectedResponse) {
  try {
    await t.context.got.put(`services/${serviceId}`, { json: body });
    t.fail("Expected the PUT request to throw an error");
  } catch (error) {
    t.is(error.response.statusCode, expectedResponse.code);
    t.is(error.response.body.message, expectedResponse.payload);
  }
}

// ------------------------------------------ TESTS: PUT /services/{serviceId} ------------------------------------------ //

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
 * Tests successful modification of a service [HAPPY PATH].
 */
test("Successful modification of service description", async (t) => {
  const serviceId = 1;
  const body = createServiceBody();

  // Make the PUT request to modify a service
  const serviceResponse = await t.context.got.put(`services/${serviceId}`, {
    json: body,
  });

  // Assert that the response status is 200 OK
  t.is(
    serviceResponse.statusCode,
    200,
    "Service modification should return status 200"
  );
});

/**
 * Tests modification with non-matching serviceId in path and body [UNHAPPY PATH].
 */
test("Unsuccessful modification of service: Non-matching serviceId in path and body", async (t) => {
  const serviceId = 2;
  const body = createServiceBody({ serviceId: 1 });
  expectedResponse = respondWithCode(400, "'serviceId' in path must match serviceId in body.")
  
  await assertPutError(
    t,
    serviceId,
    body,
    expectedResponse
  );

});

/**
 * Tests modification with negative serviceId in path [UNHAPPY PATH].
 */
test("Unsuccessful modification of service: Negative serviceId in path", async (t) => {
  const serviceId = -2;
  const body = createServiceBody({ serviceId });
  expectedResponse = respondWithCode(400, "'serviceId' must be a positive integer.")
  
  await assertPutError(
    t,
    serviceId,
    body,
    expectedResponse
  );
 
});

/**
 * Tests modification with missing required fields in the body [UNHAPPY PATH].
 */
test("Unsuccessful modification of service: Missing required fields", async (t) => {
  const serviceId = 1;
  const body = createServiceBody();
  delete body.serviceImg;
  expectedResponse = respondWithCode(400, "request.body should have required property 'serviceImg'")
  
  await assertPutError(
    t,
    serviceId,
    body,
    expectedResponse
  );

});

/**
 * Tests modification with empty required fields in the body [UNHAPPY PATH].
 */
test("Unsuccessful modification of service: Empty required fields", async (t) => {
  const serviceId = 1;
  const body = createServiceBody({ phone: "" });
  expectedResponse = respondWithCode(422, "Missing required fields: phone")
  
    await assertPutError(
      t,
      serviceId,
      body,
      expectedResponse
    );

});

/**
 * Tests modification with no matching service in the database [UNHAPPY PATH].
 */
test("Unsuccessful modification of service: No matching service in database", async (t) => {
  const serviceId = 5;
  const body = createServiceBody({ serviceId: 5 });
  expectedResponse = respondWithCode(404, `No service found with serviceId: ${serviceId}`)
  
    await assertPutError(
      t,
      serviceId,
      body,
      expectedResponse
    );
});

/**
 * Tests modification with description exceeding 300 characters [UNHAPPY PATH].
 */
test("Unsuccessful modification of service: Description exceeds 300 characters", async (t) => {
  const serviceId = 1;
  const body = createServiceBody({ description: "A".repeat(301) });
  expectedResponse = respondWithCode(400, "Description cannot exceed 300 characters.")
  
    await assertPutError(
      t,
      serviceId,
      body,
      expectedResponse
    );
});

/**
 * Tests modification with phone number exceeding 10 characters [UNHAPPY PATH].
 */
test("Unsuccessful modification of service: Phone number exceeds 10 characters", async (t) => {
  const serviceId = 1;
  const body = createServiceBody({ phone: "98765432100" });
  expectedResponse = respondWithCode(400, "Phone number cannot exceed 10 characters.")
  
    await assertPutError(
      t,
      serviceId,
      body,
      expectedResponse
    );

});
