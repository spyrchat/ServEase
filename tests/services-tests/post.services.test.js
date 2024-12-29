const http = require("http");
const test = require("ava");
const got = require("got");
const app = require("../../index.js");

// Helper function to create a service
function createService(overrides = {}) {
  return {
    userType: "service",
    serviceType: "doctor",
    description: "A professional medical service.",
    city: "Health City",
    address: "123 Medical Lane",
    country: "Countryland",
    postalCode: 12345,
    email: "doctor@example.com",
    phone: "1234567890",
    rating: 4.5,
    serviceImg: "image_binary_data",
    availableTimeSlots: [
      { availability: true, date: "2024-01-01", startingTime: "09:00:00" },
    ],
    ...overrides,
  };
}

// Helper function to handle POST request errors
async function assertPostError(t, body, expectedStatusCode, expectedMessage) {
  try {
    await t.context.got.post("services", { json: body });
    t.fail("Expected createService to throw an error");
  } catch (error) {
    t.is(error.response.statusCode, expectedStatusCode);
    t.is(error.response.body.message, expectedMessage);
  }
}

// ------------------------------------------ TESTS: POST /services ------------------------------------------ //

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
 * 1. Successful creation of service [HAPPY PATH]
 */
test("POST /services - Successful creation of service", async (t) => {
  const body = createService();
  const serviceResponse = await t.context.got.post("services", { json: body });
  t.is(serviceResponse.statusCode, 200, "Service creation should return status 200");
  t.truthy(serviceResponse.body);
  t.truthy(serviceResponse.body.serviceId);
});

/**
 * 2. Unsuccessful creation of service: invalid userType [UNHAPPY PATH]
 */
test("POST /services - Invalid userType", async (t) => {
  const body = createService({ userType: "client" });
  await assertPostError(
    t,
    body,
    400,
    "Invalid service data. 'userType' must be 'service' is required."
  );
});

/**
 * 3. Unsuccessful creation of service: missing required fields [UNHAPPY PATH]
 */
test("POST /services - Missing required fields", async (t) => {
  const body = createService({ description: "" });
  await assertPostError(
    t,
    body,
    400,
    "Invalid service data. 'description' is required."
  );
});

/**
 * 4. Unsuccessful creation of service: phone number exceeds character limit [UNHAPPY PATH]
 */
test("POST /services - Phone number exceeds character limit", async (t) => {
  const body = createService({ phone: "12345678901" });
  await assertPostError(
    t,
    body,
    400,
    "Phone number cannot exceed 10 characters."
  );
});

/**
 * 5. Unsuccessful creation of service: invalid rating [UNHAPPY PATH]
 */
test("POST /services - Invalid rating", async (t) => {
  const body = createService({ rating: 6 });
  await assertPostError(
    t,
    body,
    400,
    "request.body.rating should be <= 5"
  );
});

/**
 * 6. Unsuccessful creation of service: invalid email format [UNHAPPY PATH]
 */
test("POST /services - Invalid email format", async (t) => {
  const body = createService({ email: "doctoratexample.com" });
  await assertPostError(
    t,
    body,
    400,
    "Invalid email format."
  );
});
