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
 * Tests successful creation of a service [HAPPY PATH].
 */
test("createService - Should succeed with valid data", async (t) => {
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

  // Make the POST request to create a service
  const serviceResponse = await t.context.got.post("services", { json: body });

  // Assert that the response status is 200 OK
  t.is(
    serviceResponse.statusCode,
    200,
    "Service creation should return status 200"
  );

  // Assert that the response body is present
  t.truthy(serviceResponse.body, "Body should be present");

  // Assert that the response body contains a valid service ID
  t.truthy(serviceResponse.body.serviceId, "Service ID should be present");
});

/**
 * Tests creation of a service with an invalid userType [UNHAPPY PATH].
 */
test("createService - Invalid UserType", async (t) => {
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
    const serviceResponse = await t.context.got.post("services", {
      json: body,
    });
    t.fail("Expected createService to throw an error");
  } catch (error) {
    // Assert that the API returns a 400 error for invalid userType
    t.is(error.response.statusCode, 400);
    t.is(
      error.response.body.message,
      "Invalid service data. 'userType' must be 'service' is required."
    );
  }
});

/**
 * Tests creation of a service with missing required fields [UNHAPPY PATH].
 */
test("createService - Missing Required Fields", async (t) => {
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
    const serviceResponse = await t.context.got.post("services", {
      json: body,
    });
    t.fail("Expected createService to throw an error");
  } catch (error) {
    // Assert that the API returns a 400 error for missing required fields
    t.is(error.response.statusCode, 400);
    t.is(
      error.response.body.message,
      "Invalid service data. 'description' is required."
    );
  }
});

/**
 * Tests creation of a service with a phone number exceeding the character limit [UNHAPPY PATH].
 */
test("createService - Phone Number Exceeds Limit", async (t) => {
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
    const serviceResponse = await t.context.got.post("services", {
      json: body,
    });
    t.fail("Expected createService to throw an error");
  } catch (error) {
    // Assert that the API returns a 400 error for exceeding phone character limit
    t.is(error.response.statusCode, 400);
    t.is(
      error.response.body.message,
      "Phone number cannot exceed 10 characters."
    );
  }
});

/**
 * Tests creation of a service with an invalid rating [UNHAPPY PATH].
 */
test("createService - Invalid Rating", async (t) => {
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
    const serviceResponse = await t.context.got.post("services", {
      json: body,
    });
    t.fail("Expected createService to throw an error");
  } catch (error) {
    // Assert that the API returns a 400 error for invalid rating
    t.is(error.response.statusCode, 400);
    t.is(error.response.body.message, "request.body.rating should be <= 5");
  }
});

/**
 * Tests creation of a service with an invalid email format [UNHAPPY PATH].
 */
test("createService - Invalid Email Format", async (t) => {
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
    const serviceResponse = await t.context.got.post("services", {
      json: body,
    });
    t.fail("Expected createService to throw an error");
  } catch (error) {
    // Assert that the API returns a 400 error for invalid email format
    t.is(error.response.statusCode, 400);
    t.is(error.response.body.message, "Invalid email format.");
  }
});
