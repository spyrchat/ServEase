const http = require("http");
const test = require("ava");
const got = require("got");
const app = require("../../index.js");

// ------------------------------------------ TESTS: GET /services ------------------------------------------ //

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
test.after.always((t) => {
  t.context.server.close();
});

/**
 * Tests search with valid filters. [HAPPY PATH]
 */
test("Unit Test GET /services - Successful search with valid filters", async (t) => {
  const filters = {
    search: "Plumbing",
    typeFilter: "Plumbing",
    locationFilter: "Los Angeles",
    ratingFilter: 4,
  };

  try {
    const response = await t.context.got.get("services", {
      searchParams: filters,
    });

    // Assert response status code
    t.is(
      response.statusCode,
      200,
      "Should return 200 OK for successful service search"
    );

    // Assert response body is present
    t.truthy(response.body, "Response body should be present");

    // Assert that each service in the response matches the filters
    response.body.forEach((service) => {
      // Check if service matches the 'search' filter
      t.true(
        service.serviceType
          .toLowerCase()
          .includes(filters.search.toLowerCase()),
        `Service type should include search term: ${filters.search}`
      );

      // Check if service matches the 'typeFilter'
      t.is(
        service.serviceType,
        filters.typeFilter,
        "Service type should match the typeFilter"
      );

      // Check if service matches the 'locationFilter'
      t.is(
        service.city,
        filters.locationFilter,
        "Service city should match the locationFilter"
      );

      // Check if service matches the 'ratingFilter'
      t.true(
        service.rating >= filters.ratingFilter,
        `Service rating should meet or exceed the filter: ${filters.ratingFilter}`
      );

      // Ensure service conforms to the expected schema
      t.truthy(service.serviceId, "Service should have a valid serviceId");
      t.truthy(service.description, "Service should have a description");
      t.truthy(service.address, "Service should have an address");
      t.truthy(service.email, "Service should have an email");
      t.truthy(service.phone, "Service should have a phone number");
    });
  } catch (error) {
    // Log and fail the test if an unexpected error occurs
    t.fail(`Test encountered an unexpected error: ${error.message}`);
  }
});

/**
 * Tests search with no matching results. [HAPPY PATH]
 */
test("Unit Test GET /services - No matching results", async (t) => {
  const filters = { search: "NonExistingService" };

  const response = await t.context.got.get("services", {
    searchParams: filters,
  });

  // Assert response status code
  t.is(response.statusCode, 204, "Should return 204 No Content for no matches");

  // Assert response body is empty (or not returned)
  t.falsy(response.body, "Response body should be empty or undefined");
});

/**
 * Tests unsuccessful search with invalid 'ratingFilter'. [UNHAPPY PATH]
 */
test("Unit Test GET /services - Invalid 'ratingFilter'", async (t) => {
  const filters = { ratingFilter: 6 };

  const error = await t.throwsAsync(
    () => t.context.got.get("services", { searchParams: filters }),
    { instanceOf: t.context.got.HTTPError }
  );

  // Assert response status code
  t.is(
    error.response.statusCode,
    400,
    "Should return 400 Bad Request for invalid 'ratingFilter'"
  );

  // Assert response body contains error message
  t.is(
    error.response.body.message,
    "request.query.ratingFilter should be <= 5",
    "Error message should match expected validation error"
  );
});

/**
 * Tests unsuccessful search with invalid 'typeFilter'. [UNHAPPY PATH]
 */
test("Unit Test GET /services - Invalid 'typeFilter'", async (t) => {
  const filters = { typeFilter: "" };

  const error = await t.throwsAsync(
    () => t.context.got.get("services", { searchParams: filters }),
    { instanceOf: t.context.got.HTTPError }
  );

  // Assert response status code
  t.is(
    error.response.statusCode,
    400,
    "Should return 400 Bad Request for invalid 'typeFilter'"
  );

  // Assert response body contains error message
  t.is(
    error.response.body.message,
    "Empty value found for query parameter 'typeFilter'",
    "Error message should match expected validation error"
  );
});

/**
 * Tests search with no filters (return all services). [HAPPY PATH]
 */
test("Unit Test GET /services - Search with no filters", async (t) => {
  const response = await t.context.got.get("services");

  // Assert response status code
  t.is(response.statusCode, 200, "Should return 200 OK for unfiltered search");

  // Assert response body contains all services
  t.true(Array.isArray(response.body), "Response should be an array");
  t.truthy(response.body.length, "Response should contain all services");
});