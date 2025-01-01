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
 * Tests successful creation of a rating [HAPPY PATH].
 */
test("createRating - Successful creation of rating", async (t) => {
  const clientId = 1;
  const serviceId = 1;

  const requestBody = {
    clientId,
    date: "2021-05-05",
    serviceId,
    stars: 5,
    review: "Excellent service!",
  };

  const ratingResponse = await t.context.got.post(`service/${serviceId}/ratings`, { json: requestBody });

  t.is(ratingResponse.statusCode, 200);
  t.truthy(ratingResponse.body);
  t.is(ratingResponse.body.clientId, clientId);
  t.is(ratingResponse.body.serviceId, serviceId);
  t.truthy(ratingResponse.body.date);
  t.is(ratingResponse.body.stars, 5);
  t.is(ratingResponse.body.review, "Excellent service!");
});

/**
 * Tests successful creation of a rating without giving a review [HAPPY PATH].
 */
test("createRating - Successful rating creation without a review", async (t) => {
  const clientId = 3;
  const serviceId = 2;

  const requestBody = {
    clientId,
    date: "2021-05-05",
    serviceId,
    stars: 5,
  };

  const ratingResponse = await t.context.got.post(`service/${serviceId}/ratings`, { json: requestBody });

  t.is(ratingResponse.statusCode, 200);
  t.truthy(ratingResponse.body);
  t.is(ratingResponse.body.clientId, clientId);
  t.is(ratingResponse.body.serviceId, serviceId);
  t.truthy(ratingResponse.body.date);
  t.is(ratingResponse.body.stars, 5);
});

/**
 * Tests unsuccessful creation of a rating with invalid stars number [UNHAPPY PATH]
 */
test("createRating - Invalid 'stars' value", async (t) => {
  const clientId = 1;
  const serviceId = 1;

  const requestBody = {
    clientId,
    date: "2021-05-05",
    serviceId,
    stars: 7,
    review: "Excellent service!",
  };

  await sendPostRequest(
    t,
    `service/${serviceId}/ratings`,
    requestBody,
    400,
    "request.body.stars should be <= 5"
  );
});

/**
 * Tests unsuccessful creation of a rating - client with clientId doesn't exist [UNHAPPY PATH].
 */
test("createRating - Client does not exist", async (t) => {
  const serviceId = 1;
  const invalidClientId = 999;

  const requestBody = {
    clientId: invalidClientId,
    date: "2021-05-05",
    serviceId,
    stars: 4,
    review: "Great service!",
  };

  await sendPostRequest(
    t,
    `service/${serviceId}/ratings`,
    requestBody,
    404,
    `No client found with clientId: ${invalidClientId}`
  );
});

/**
 * Tests unsuccessful creation of a rating - clientId is not an integer [UNHAPPY PATH].
 */
test("createRating - clientId not an integer", async (t) => {
  const clientId = "one";
  const serviceId = 1;

  const requestBody = {
    clientId,
    date: "2021-05-05",
    serviceId,
    stars: 5,
    review: "Excellent service!",
  };

  await sendPostRequest(
    t,
    `service/${serviceId}/ratings`,
    requestBody,
    400,
    "request.body.clientId should be integer"
  );
});

/**
 * Tests unsuccessful creation of a rating - clientId not provided [UNHAPPY PATH].
 */
test("createRating - clientId not provided", async (t) => {
  const serviceId = 1;

  const requestBody = {
    date: "2021-05-05",
    serviceId,
    stars: 5,
    review: "Excellent service!",
  };

  await sendPostRequest(
    t,
    `service/${serviceId}/ratings`,
    requestBody,
    400,
    "request.body should have required property 'clientId'"
  );
});

/**
 * Tests unsuccessful creation of a rating - service with serviceId doesn't exist [UNHAPPY PATH].
 */
test("createRating - Service does not exist", async (t) => {
  const clientId = 1;
  const invalidServiceId = 999;

  const requestBody = {
    clientId,
    date: "2021-05-05",
    serviceId: invalidServiceId,
    stars: 5,
    review: "Excellent service!",
  };

  await sendPostRequest(
    t,
    `service/${invalidServiceId}/ratings`,
    requestBody,
    404,
    `No service found with serviceId: ${invalidServiceId}`
  );
});

/**
 * Tests unsuccessful creation of a rating - serviceId is not an integer [UNHAPPY PATH].
 */
test("createRating - serviceId not an integer", async (t) => {
  const clientId = 1;
  const serviceId = "one";

  const requestBody = {
    clientId,
    date: "2021-05-05",
    serviceId,
    stars: 5,
    review: "Excellent service!",
  };

  await sendPostRequest(
    t,
    `service/${serviceId}/ratings`,
    requestBody,
    400,
    "request.params.serviceId should be integer, request.body.serviceId should be integer"
  );
});

/**
 * Tests unsuccessful creation of a rating - serviceId not provided [UNHAPPY PATH].
 */
test("createRating - serviceId not provided", async (t) => {
  const clientId = 1;

  const requestBody = {
    clientId,
    date: "2021-05-05",
    stars: 5,
    review: "Excellent service!",
  };

  await sendPostRequest(
    t,
    `service/undefined/ratings`,
    requestBody,
    400,
    "request.params.serviceId should be integer, request.body should have required property 'serviceId'"
  );
});
