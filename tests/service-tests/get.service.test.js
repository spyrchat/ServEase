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
test.after.always((t) => {
  t.context.server.close();
});

global.services = [
  {
    serviceId: 1,
    serviceType: "Plumbing",
    description: "Expert+plumbing+services.",
    city: "Los+Angeles",
    address: "123 Main St",
    country: "USA",
    postalCode: 90001,
    email: "plumbing@example.com",
    phone: "1234567890",
    rating: 4.5,
    serviceImg: "plumbing.jpg",
    availableTimeSlots: [
      { availability: true, date: "2023-11-26", startingTime: "09:00:00" },
    ],
  },
];

/**
 * Unit Tests for GET /services/{serviceId} API route implemented:
 * 1. Retrieve existing service by valid ID
 * 2. Retrieve service with non-existing serviceId
 * 3. Retrieve service with invalid (non-integer) serviceId
 * 4. Retrieve service with invalid (negative) serviceId
 */

/**
 * 1. Retrieve existing service by valid ID [HAPPY PATH]
 */
test("[HAPPY PATH] GET /services/{serviceId} - Retrieve existing service by valid ID", async (t) => {
  const serviceId = 1; // Assuming this serviceId exists in the mock data.

  const response = await t.context.got.get(`services/${serviceId}`);

  t.is(response.statusCode, 200, "Should return 200 OK for valid serviceId");
  t.truthy(response.body, "Response body should contain service details");
  t.is(
    response.body.serviceId,
    serviceId,
    "Returned serviceId should match requested serviceId"
  );
});

/**
 * 2. Retrieve service with non-existing serviceId [UNHAPPY PATH]
 */
test("[UNHAPPY PATH] GET /services/{serviceId} - Retrieve service with non-existing serviceId", async (t) => {
  const serviceId = 999; // Assuming this serviceId does not exist.

  const error = await t.throwsAsync(
    () => t.context.got.get(`services/${serviceId}`),
    {
      instanceOf: t.context.got.HTTPError,
    }
  );

  t.is(
    error.response.statusCode,
    404,
    "Should return 404 Not Found for non-existing serviceId"
  );
  t.is(
    error.response.body.message,
    `No service found with serviceId: ${serviceId}.`,
    "Error message should indicate no service found"
  );
});

/**
 * 3. Retrieve service with invalid (non-integer) serviceId [UNHAPPY PATH]
 */
test("[UNHAPPY PATH] GET /services/{serviceId} - Retrieve service with invalid (non-integer) serviceId", async (t) => {
  const serviceId = "abc";

  const error = await t.throwsAsync(
    () => t.context.got.get(`services/${serviceId}`),
    {
      instanceOf: t.context.got.HTTPError,
    }
  );

  t.is(
    error.response.statusCode,
    400,
    "Should return 400 Bad Request for invalid serviceId"
  );
  t.is(
    error.response.body.message,
    "request.params.serviceId should be integer",
    "Error message should indicate invalid serviceId"
  );
});

/**
 * 4. Retrieve service with invalid (negative) serviceId [UNHAPPY PATH]
 */
test("[UNHAPPY PATH] GET /services/{serviceId} - Retrieve service with invalid (negative) serviceId", async (t) => {
  const serviceId = -1;

  const error = await t.throwsAsync(
    () => t.context.got.get(`services/${serviceId}`),
    {
      instanceOf: t.context.got.HTTPError,
    }
  );

  t.is(
    error.response.statusCode,
    400,
    "Should return 400 Bad Request for negative serviceId"
  );
  t.is(
    error.response.body.message,
    "'serviceId' must be a positive integer.",
    "Error message should indicate invalid serviceId"
  );
});
