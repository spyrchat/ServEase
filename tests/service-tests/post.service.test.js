const http = require("http");
const test = require("ava");
const got = require("got");
const app = require("../../index.js");

// ------------------------------------------ TESTS: POST /services ------------------------------------------ //

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
 * Unit Tests for POST /services API route:
 * 1. Successful creation of service
 * 2. Unsuccessful creation of service: invalid userType
 * 3. Unsuccessful creation of service: missing required fields
 * 4. Unsuccessful creation of service: phone number exceeds character limit
 * 5. Unsuccessful creation of service: invalid rating
 * 6. Unsuccessful creation of service: invalid email format
 */

/**
 * 1. Successful creation of service [HAPPY PATH]
 */
test("POST /services - Successful creation of service", async (t) => {
  let body = {
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
  };

  const serviceResponse = await t.context.got.post("services", { json: body });

  t.is(
    serviceResponse.statusCode,
    200,
    "Service creation should return status 200"
  );
  t.truthy(serviceResponse.body, "Body should be present");
  t.truthy(serviceResponse.body.serviceId, "Service ID should be present");
});

/**
 * 2. Unsuccessful creation of service: invalid userType [UNHAPPY PATH]
 */
test("POST /services - Invalid userType", async (t) => {
  let body = {
    userType: "client", // Invalid userType
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
    availableTimeSlots: [],
  };

  try {
    await t.context.got.post("services", { json: body });
    t.fail("Expected createService to throw an error");
  } catch (error) {
    t.is(error.response.statusCode, 400);
    t.is(
      error.response.body.message,
      "Invalid service data. 'userType' must be 'service' is required."
    );
  }
});

/**
 * 3. Unsuccessful creation of service: missing required fields [UNHAPPY PATH]
 */
test("POST /services - Missing required fields", async (t) => {
  let body = {
    userType: "service",
    serviceType: "doctor",
    description: "",
    city: "Health City",
    address: "123 Medical Lane",
    country: "Countryland",
    postalCode: 12345,
    email: "doctor@example.com",
    phone: "1234567890",
    rating: 4.5,
    serviceImg: "image_binary_data",
    availableTimeSlots: [],
  };

  try {
    await t.context.got.post("services", { json: body });
    t.fail("Expected createService to throw an error");
  } catch (error) {
    t.is(error.response.statusCode, 400);
    t.is(
      error.response.body.message,
      "Invalid service data. 'description' is required."
    );
  }
});

/**
 * 4. Unsuccessful creation of service: phone number exceeds character limit [UNHAPPY PATH]
 */
test("POST /services - Phone number exceeds character limit", async (t) => {
  let body = {
    userType: "service",
    serviceType: "doctor",
    description: "A professional medical service.",
    city: "Health City",
    address: "123 Medical Lane",
    country: "Countryland",
    postalCode: 12345,
    email: "doctor@example.com",
    phone: "12345678901", // Exceeds limit
    rating: 4.5,
    serviceImg: "image_binary_data",
    availableTimeSlots: [],
  };

  try {
    await t.context.got.post("services", { json: body });
    t.fail("Expected createService to throw an error");
  } catch (error) {
    t.is(error.response.statusCode, 400);
    t.is(
      error.response.body.message,
      "Phone number cannot exceed 10 characters."
    );
  }
});

/**
 * 5. Unsuccessful creation of service: invalid rating [UNHAPPY PATH]
 */
test("POST /services - Invalid rating", async (t) => {
  let body = {
    userType: "service",
    serviceType: "doctor",
    description: "A professional medical service.",
    city: "Health City",
    address: "123 Medical Lane",
    country: "Countryland",
    postalCode: 12345,
    email: "doctor@example.com",
    phone: "1234567890",
    rating: 6, // Invalid rating
    serviceImg: "image_binary_data",
    availableTimeSlots: [],
  };

  try {
    await t.context.got.post("services", { json: body });
    t.fail("Expected createService to throw an error");
  } catch (error) {
    t.is(error.response.statusCode, 400);
    t.is(error.response.body.message, "request.body.rating should be <= 5");
  }
});

/**
 * 6. Unsuccessful creation of service: invalid email format [UNHAPPY PATH]
 */
test("POST /services - Invalid email format", async (t) => {
  let body = {
    userType: "service",
    serviceType: "doctor",
    description: "A professional medical service.",
    city: "Health City",
    address: "123 Medical Lane",
    country: "Countryland",
    postalCode: 12345,
    email: "doctoratexample.com", // Invalid email format
    phone: "1234567890",
    rating: 4.5,
    serviceImg: "image_binary_data",
    availableTimeSlots: [],
  };

  try {
    await t.context.got.post("services", { json: body });
    t.fail("Expected createService to throw an error");
  } catch (error) {
    t.is(error.response.statusCode, 400);
    t.is(error.response.body.message, "Invalid email format.");
  }
});
