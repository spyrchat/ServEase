const http = require("http");
const test = require("ava");
const got = require("got");
const app = require("../../index.js");

// Helper function to generate a client body
function createClientBody(overrides = {}) {
  return {
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
      ...overrides,
    },
    ...overrides,
  };
}

// Helper function to handle expected errors
async function assertPostError(t, body, expectedStatusCode, expectedMessage) {
  try {
    await t.context.got.post("clients", { json: body });
    t.fail("Expected createClient to throw an error");
  } catch (error) {
    t.is(error.response.statusCode, expectedStatusCode);
    t.is(error.response.body.message, expectedMessage);
  }
}

// ------------------------------------------ TESTS: POST /clients ------------------------------------------ //

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
 * Tests successful creation of a client [HAPPY PATH].
 */
test("Successful creation of client", async (t) => {
  const body = createClientBody();
  const clientResponse = await t.context.got.post("clients", { json: body });
  t.is(clientResponse.statusCode, 200, "Client creation should return status 200");
  t.truthy(clientResponse.body, "Body should be present");
  t.truthy(clientResponse.body.clientId, "Client ID should be present");
});

/**
 * Tests creation of a client with an invalid userType [UNHAPPY PATH].
 */
test("Unsuccessful creation of client: Invalid userType", async (t) => {
  const body = createClientBody({ userType: "servie" });
  //console.log(body)
  await assertPostError(
    t,
    body,
    400,
    "request.body.userType should be equal to one of the allowed values: client, guest, service"
  );
});

/**
 * Tests creation of a client with a mismatched userType [UNHAPPY PATH].
 */
test("Unsuccessful creation of client: Mismatched userType", async (t) => {
  const body = createClientBody({ userType: "service" });

  await assertPostError(
    t,
    body,
    400,
    "Invalid client data. 'userType' must be 'client'."
  );
});

/**
 * Tests creation of a client without personalInfo [UNHAPPY PATH].
 */
test("Unsuccessful creation of client: Personal info not provided", async (t) => {
  const body = { userType: "client" };
  await assertPostError(
    t,
    body,
    400,
    "request.body should have required property 'personalInfo'"
  );
});

/**
 * Tests creation of a client with empty required fields in personalInfo [UNHAPPY PATH].
 */
test("Unsuccessful creation of client: Empty required fields in personal info", async (t) => {
  const body = createClientBody({ email: "", password: "", phone: "" });
  await assertPostError(
    t,
    body,
    422,
    "Missing required fields: email, password, phone"
  );
});

/**
 * Tests creation of a client with a phone number exceeding the character limit [UNHAPPY PATH].
 */
test("Unsuccessful creation of client: Phone number exceeds limit", async (t) => {
  const body = createClientBody({ phone: "12345678901" });
  await assertPostError(
    t,
    body,
    400,
    "Phone number cannot exceed 10 characters."
  );
});

/**
 * Tests creation of a client with an invalid email format [UNHAPPY PATH].
 */
test("Unsuccessful creation of client: Invalid email format", async (t) => {
  const body = createClientBody({ email: "evaemail.com" });
  await assertPostError(
    t,
    body,
    422,
    "Invalid email format."
  );
});
