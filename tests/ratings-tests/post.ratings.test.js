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
 * Utility function for sending POST requests and handling assertions.
 */
async function sendPostRequest(t, endpoint, requestBody, expectedStatusCode, expectedMessage) {
  try {
    await t.context.got.post(endpoint, { json: requestBody });
    t.fail("Request should not succeed.");
  } catch (error) {
    t.is(error.response.statusCode, expectedStatusCode);
    t.is(error.response.body.message, expectedMessage);
  }
}

/**
 * Utility function for common happy path assertions.
 */
function assertSuccessfulResponse(t, response, expected) {
  t.is(response.statusCode, 200);
  t.truthy(response.body);
  t.is(response.body.clientId, expected.clientId);
  t.is(response.body.serviceId, expected.serviceId);
  t.truthy(response.body.date);
  t.is(response.body.stars, expected.stars);
  if (expected.review) {
    t.is(response.body.review, expected.review);
  }
}

/**
 * Tests successful creation of a rating [HAPPY PATH].
 */
test("createRating - Successful creation of rating", async (t) => {
  const requestBody = {
    clientId: 1,
    date: "2021-05-05",
    serviceId: 1,
    stars: 5,
    review: "Excellent service!",
  };

  const response = await t.context.got.post(`service/1/ratings`, { json: requestBody });
  assertSuccessfulResponse(t, response, requestBody);
});

/**
 * Tests successful creation of a rating without giving a review [HAPPY PATH].
 */
test("createRating - Successful rating creation without a review", async (t) => {
  const requestBody = {
    clientId: 3,
    date: "2021-05-05",
    serviceId: 2,
    stars: 5,
  };

  const response = await t.context.got.post(`service/2/ratings`, { json: requestBody });
  assertSuccessfulResponse(t, response, requestBody);
});

/**
 * Tests unsuccessful creation of a rating with invalid stars number [UNHAPPY PATH].
 */
test("createRating - Invalid 'stars' value", async (t) => {
  const requestBody = {
    clientId: 1,
    date: "2021-05-05",
    serviceId: 1,
    stars: 7,
    review: "Excellent service!",
  };

  await sendPostRequest(t, `service/1/ratings`, requestBody, 400, "request.body.stars should be <= 5");
});

/**
 * Tests unsuccessful creation of a rating - client with clientId doesn't exist [UNHAPPY PATH].
 */
test("createRating - Client does not exist", async (t) => {
  const requestBody = {
    clientId: 999,
    date: "2021-05-05",
    serviceId: 1,
    stars: 4,
    review: "Great service!",
  };

  await sendPostRequest(t, `service/1/ratings`, requestBody, 404, "No client found with clientId: 999");
});

/**
 * Tests unsuccessful creation of a rating - clientId is not an integer [UNHAPPY PATH].
 */
test("createRating - clientId not an integer", async (t) => {
  const requestBody = {
    clientId: "one",
    date: "2021-05-05",
    serviceId: 1,
    stars: 5,
    review: "Excellent service!",
  };

  await sendPostRequest(t, `service/1/ratings`, requestBody, 400, "request.body.clientId should be integer");
});

/**
 * Tests unsuccessful creation of a rating - clientId not provided [UNHAPPY PATH].
 */
test("createRating - clientId not provided", async (t) => {
  const requestBody = {
    date: "2021-05-05",
    serviceId: 1,
    stars: 5,
    review: "Excellent service!",
  };

  await sendPostRequest(t, `service/1/ratings`, requestBody, 400, "request.body should have required property 'clientId'");
});

/**
 * Tests unsuccessful creation of a rating - service with serviceId doesn't exist [UNHAPPY PATH].
 */
test("createRating - Service does not exist", async (t) => {
  const requestBody = {
    clientId: 1,
    date: "2021-05-05",
    serviceId: 999,
    stars: 5,
    review: "Excellent service!",
  };

  await sendPostRequest(t, `service/999/ratings`, requestBody, 404, "No service found with serviceId: 999");
});

/**
 * Tests unsuccessful creation of a rating - serviceId is not an integer [UNHAPPY PATH].
 */
test("createRating - serviceId not an integer", async (t) => {
  const requestBody = {
    clientId: 1,
    date: "2021-05-05",
    serviceId: "one",
    stars: 5,
    review: "Excellent service!",
  };

  await sendPostRequest(t, `service/one/ratings`, requestBody, 400, "request.params.serviceId should be integer, request.body.serviceId should be integer");
});

/**
 * Tests unsuccessful creation of a rating - serviceId not provided [UNHAPPY PATH].
 */
test("createRating - serviceId not provided", async (t) => {
  const requestBody = {
    clientId: 1,
    date: "2021-05-05",
    stars: 5,
    review: "Excellent service!",
  };

  await sendPostRequest(t, `service/undefined/ratings`, requestBody, 400, "request.params.serviceId should be integer, request.body should have required property 'serviceId'");
});
