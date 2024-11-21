const http = require("http");
const test = require("ava");
const got = require("got");
const app = require("../../index.js");

// ------------------------------------------ TESTS: POST /clients ------------------------------------------ //

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
 * Tests successful creation of a client [HAPPY PATH].
 */
test("createClient - Should succeed with valid data", async (t) => {
  let body = {
    userType: "client",
    personalInfo: {
      address: "123 Main St",
      city: "Sample City",
      country: "Countryland",
      email: "test@example.com",
      firstName: "John",
      lastName: "Doe",
      password: "securePass123",
      phone: "1234567890",
      postalCode: 12345,
    },
  };

  // Make the POST request to create a client
  const clientResponse = await t.context.got.post("clients", { json: body });

  // Assert that the response status is 200 OK
  t.is(
    clientResponse.statusCode,
    200,
    "Client creation should return status 200"
  );

  // Assert that the response body is present
  t.truthy(clientResponse.body, "Body should be present");

  // Assert that the response body contains a valid client ID
  t.truthy(clientResponse.body.clientId, "Client ID should be present");
});

/**
 * Tests creation of a client with an invalid userType [UNHAPPY PATH].
 */
test("createClient - Invalid UserType", async (t) => {
  let body = {
    userType: "servie", // Invalid userType
    personalInfo: {
      address: "123 Main St",
      city: "Sample City",
      country: "Countryland",
      email: "test@example.com",
      firstName: "John",
      lastName: "Doe",
      password: "securePass123",
      phone: "1234567890",
      postalCode: 12345,
    },
  };

  // Attempt to create a client with an invalid userType
  try {
    const clientResponse = await t.context.got.post("clients", { json: body });
    t.fail("Expected createClient to throw an error");
  } catch (error) {
    // Assert that the API returns a 400 error for invalid userType
    t.is(error.response.statusCode, 400);
    t.is(
      error.response.body.message,
      "request.body.userType should be equal to one of the allowed values: client, guest, service"
    );
  }
});

/**
 * Tests creation of a client with a mismatched userType [UNHAPPY PATH].
 */
test("createClient - Mismatched UserType", async (t) => {
  let body = {
    userType: "service", // Incorrect userType
    personalInfo: {
      address: "123 Main St",
      city: "Sample City",
      country: "Countryland",
      email: "test@example.com",
      firstName: "John",
      lastName: "Doe",
      password: "securePass123",
      phone: "1234567890",
      postalCode: 12345,
    },
  };

  // Attempt to create a client with an incorrect userType
  try {
    const clientResponse = await t.context.got.post("clients", { json: body });
    t.fail("Expected createClient to throw an error");
  } catch (error) {
    // Assert that the API returns a 400 error for mismatched userType
    t.is(error.response.statusCode, 400);
    t.is(
      error.response.body.message,
      "Invalid client data. 'userType' must be 'client'."
    );
  }
});

/**
 * Tests creation of a client without personalInfo [UNHAPPY PATH].
 */
test("createClient - Delete Personal Info", async (t) => {
  let body = {
    userType: "client", // Missing personalInfo
  };

  // Attempt to create a client without personalInfo
  try {
    const clientResponse = await t.context.got.post("clients", { json: body });
    t.fail("Expected createClient to throw an error");
  } catch (error) {
    // Assert that the API returns a 400 error for missing personalInfo
    t.is(error.response.statusCode, 400);
    t.is(
      error.response.body.message,
      "request.body should have required property 'personalInfo'"
    );
  }
});

/**
 * Tests creation of a client with empty required fields in personalInfo [UNHAPPY PATH].
 */
test("createClient - Empty String in Required Fields - PersonalInfo", async (t) => {
  let body = {
    userType: "client",
    personalInfo: {
      address: "123 Main St",
      city: "Sample City",
      country: "Countryland",
      email: "", // Empty email
      firstName: "John",
      lastName: "Doe",
      password: "", // Empty password
      phone: "", // Empty phone
      postalCode: 12345,
    },
  };

  // Attempt to create a client with missing required fields
  try {
    const clientResponse = await t.context.got.post("clients", { json: body });
    t.fail("Expected createClient to throw an error");
  } catch (error) {
    // Assert that the API returns a 422 error for missing fields
    t.is(error.response.statusCode, 422);
    t.is(
      error.response.body.message,
      "Missing required fields: email, password, phone"
    );
  }
});

/**
 * Tests creation of a client with a phone number exceeding the character limit [UNHAPPY PATH].
 */
test("createClient - Phone Number Exceeds Limit", async (t) => {
  let body = {
    userType: "client",
    personalInfo: {
      address: "123 Main St",
      city: "Sample City",
      country: "Countryland",
      email: "test@example.com",
      firstName: "John",
      lastName: "Doe",
      password: "securePass123",
      phone: "12345678901", // Exceeds limit
      postalCode: 12345,
    },
  };

  // Attempt to create a client with a phone number exceeding the limit
  try {
    const clientResponse = await t.context.got.post("clients", { json: body });
    t.fail("Expected createClient to throw an error");
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
 * Tests creation of a client with an invalid email format [UNHAPPY PATH].
 */
test("createClient - Invalid Email Format", async (t) => {
  let body = {
    userType: "client",
    personalInfo: {
      address: "123 Main St",
      city: "Sample City",
      country: "Countryland",
      email: "evaemail.com", // Invalid email format
      firstName: "John",
      lastName: "Doe",
      password: "securePass123",
      phone: "1234567890",
      postalCode: 12345,
    },
  };

  // Attempt to create a client with an invalid email format
  try {
    const clientResponse = await t.context.got.post("clients", { json: body });
    t.fail("Expected createClient to throw an error");
  } catch (error) {
    // Assert that the API returns a 422 error for invalid email format
    t.is(error.response.statusCode, 422);
    t.is(error.response.body.message, "Invalid email format.");
  }
});
