const http = require("http");
const test = require("ava");
const got = require("got");
const app = require("../../index.js");

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
test("Successful modification of service", async (t) => {
  const serviceId = 1;
  let body = {
    serviceId: 1,
    userType: "service",
    serviceType: "Plumbing",
    description: "Perfect plumbing services.",
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
  };

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
  let body = {
    serviceId: 1,
    userType: "service",
    serviceType: "Plumbing",
    description: "Perfect plumbing services.",
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
  };

  // Attempt to modify a service with mismatched serviceId
  try {
    const serviceResponse = await t.context.got.put(`services/${serviceId}`, {
      json: body,
    });
    t.fail("Expected the PUT request to throw an error");
  } catch (error) {
    // Assert that the API returns a 400 error for non-matching serviceId
    t.is(error.response.statusCode, 400);
    t.is(
      error.response.body.message,
      "'serviceId' in path must match serviceId in body."
    );
  }
});

/**
 * Tests modification with negative serviceId in path [UNHAPPY PATH].
 */
test("Unsuccessful modification of service: Negative serviceId in path", async (t) => {
  const serviceId = -2;
  let body = {
    serviceId: -2,
    userType: "service",
    serviceType: "Plumbing",
    description: "Perfect plumbing services.",
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
  };

  // Attempt to modify a service with a negative serviceId
  try {
    const serviceResponse = await t.context.got.put(`services/${serviceId}`, {
      json: body,
    });
    t.fail("Expected the PUT request to throw an error");
  } catch (error) {
    // Assert that the API returns a 400 error for negative serviceId
    t.is(error.response.statusCode, 400);
    t.is(
      error.response.body.message,
      "'serviceId' must be a positive integer."
    );
  }
});

/**
 * Tests modification with missing required fields in the body [UNHAPPY PATH].
 */
test("Unsuccessful modification of service: Missing required fields", async (t) => {
  const serviceId = 1;
  let body = {
    serviceId: 1,
    userType: "service",
    serviceType: "Plumbing",
    description: "Perfect plumbing services.",
    city: "Los Angeles",
    address: "456 Elm Street",
    country: "USA",
    postalCode: 90001,
    email: "plumbing.services@example.com",
    phone: "9876543210",
    rating: 4.5,
    availableTimeSlots: [
      {
        availability: true,
        date: "2023-12-01",
        startingTime: "09:00:00",
      },
    ],
  };

  // Attempt to modify a service with missing required fields
  try {
    const serviceResponse = await t.context.got.put(`services/${serviceId}`, {
      json: body,
    });
    t.fail("Expected the PUT request to throw an error");
  } catch (error) {
    // Assert that the API returns a 400 error for missing required fields
    t.is(error.response.statusCode, 400);
    t.is(
      error.response.body.message,
      "request.body should have required property 'serviceImg'"
    );
  }
});

/**
 * Tests modification with empty required fields in the body [UNHAPPY PATH].
 */
test("Unsuccessful modification of service: Empty required fields", async (t) => {
  const serviceId = 1;
  let body = {
    serviceId: 1,
    userType: "service",
    serviceType: "Plumbing",
    description: "Perfect plumbing services.",
    city: "Los Angeles",
    address: "456 Elm Street",
    country: "USA",
    postalCode: 90001,
    email: "plumbing.services@example.com",
    phone: "",
    rating: 4.5,
    serviceImg: "binaryImageData",
    availableTimeSlots: [
      {
        availability: true,
        date: "2023-12-01",
        startingTime: "09:00:00",
      },
    ],
  };

  // Attempt to modify a service with empty required fields
  try {
    const serviceResponse = await t.context.got.put(`services/${serviceId}`, {
      json: body,
    });
    t.fail("Expected the PUT request to throw an error");
  } catch (error) {
    // Assert that the API returns a 422 error for empty required fields
    t.is(error.response.statusCode, 422);
    t.is(error.response.body.message, "Missing required fields: phone");
  }
});

/**
 * Tests modification with no matching service in the database [UNHAPPY PATH].
 */
test("Unsuccessful modification of service: No matching service in database", async (t) => {
  const serviceId = 5;
  let body = {
    serviceId: 5,
    userType: "service",
    serviceType: "Plumbing",
    description: "Perfect plumbing services.",
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
  };

  // Attempt to modify a non-existent service
  try {
    const serviceResponse = await t.context.got.put(`services/${serviceId}`, {
      json: body,
    });
    t.fail("Expected the PUT request to throw an error");
  } catch (error) {
    // Assert that the API returns a 404 error for no matching service
    t.is(error.response.statusCode, 404);
    t.is(
      error.response.body.message,
      `No service found with serviceId: ${serviceId}`
    );
  }
});

/**
 * Tests modification with description exceeding 300 characters [UNHAPPY PATH].
 */
test("Unsuccessful modification of service: Description exceeds 300 characters", async (t) => {
  const serviceId = 1;
  let body = {
    serviceId: 1,
    userType: "service",
    serviceType: "Plumbing",
    description: "A".repeat(301),
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
  };

  // Attempt to modify a service with an invalid description
  try {
    const serviceResponse = await t.context.got.put(`services/${serviceId}`, {
      json: body,
    });
    t.fail("Expected the PUT request to throw an error");
  } catch (error) {
    // Assert that the API returns a 400 error for invalid description
    t.is(error.response.statusCode, 400);
    t.is(
      error.response.body.message,
      "Description cannot exceed 300 characters."
    );
  }
});

/**
 * Tests modification with phone number exceeding 10 characters [UNHAPPY PATH].
 */
test("Unsuccessful modification of service: Phone number exceeds 10 characters", async (t) => {
  const serviceId = 1;
  let body = {
    serviceId: 1,
    userType: "service",
    serviceType: "Plumbing",
    description: "Perfect plumbing services.",
    city: "Los Angeles",
    address: "456 Elm Street",
    country: "USA",
    postalCode: 90001,
    email: "plumbing.services@example.com",
    phone: "98765432100",
    rating: 4.5,
    serviceImg: "binaryImageData",
    availableTimeSlots: [
      {
        availability: true,
        date: "2023-12-01",
        startingTime: "09:00:00",
      },
    ],
  };

  // Attempt to modify a service with an invalid phone number
  try {
    const serviceResponse = await t.context.got.put(`services/${serviceId}`, {
      json: body,
    });
    t.fail("Expected the PUT request to throw an error");
  } catch (error) {
    // Assert that the API returns a 400 error for invalid phone number
    t.is(error.response.statusCode, 400);
    t.is(
      error.response.body.message,
      "Phone number cannot exceed 10 characters."
    );
  }
});
