const http = require("http");
const test = require("ava");
const got = require("got");
const app = require("../../index.js");

// ------------------------------------------ TESTS: GET /services ------------------------------------------ //

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

/**
 * Unit Tests for GET /services API route implemented:
 * 1. Successful search with valid filters
 * 2. Unsuccessful search with no matching results
 * 3. Successful search with no filters
 * 4. Unsuccessful search: ratingFilter out of range
 * 5. Unsuccessful search: ratingFilter not a number
 * 6. Unsuccessful search: typeFilter is an empty string
 */

/**
 * 1. Successful search with valid filters [HAPPY PATH]
 */
test("[HAPPY PATH] GET /services - Successful search with valid filters", async (t) => {
  const filters = {
    search: "Plumbing",
    typeFilter: "Plumbing",
    locationFilter: "Los+Angeles",
    ratingFilter: 4,
  };

  try {
    const response = await t.context.got.get("services", {
      searchParams: filters,
    });

    t.is(
      response.statusCode,
      200,
      "Should return 200 OK for successful service search"
    );

    t.truthy(response.body, "Response body should be present");

    response.body.forEach((service) => {
      t.true(
        service.serviceType
          .toLowerCase()
          .includes(filters.search.toLowerCase()),
        `Service type should include search term: ${filters.search}`
      );
      t.is(
        service.serviceType,
        filters.typeFilter,
        "Service type should match the typeFilter"
      );
      t.is(
        service.city,
        filters.locationFilter,
        "Service city should match the locationFilter"
      );
      t.true(
        service.rating >= filters.ratingFilter,
        `Service rating should meet or exceed the filter: ${filters.ratingFilter}`
      );
      t.truthy(service.serviceId, "Service should have a valid serviceId");
      t.truthy(service.description, "Service should have a description");
      t.truthy(service.address, "Service should have an address");
      t.truthy(service.email, "Service should have an email");
      t.truthy(service.phone, "Service should have a phone number");
    });
  } catch (error) {
    t.fail(`Test encountered an unexpected error: ${error.message}`);
  }
});

/**
 * 2. Unsuccessful search with no matching results [UNHAPPY PATH]
 */
test("[HAPPY PATH] GET /services - No matching results", async (t) => {
  const filters = { search: "NonExistingService" };

  const response = await t.context.got.get("services", {
    searchParams: filters,
  });

  t.is(response.statusCode, 204, "Should return 204 No Content for no matches");
  t.falsy(response.body, "Response body should be empty or undefined");
});

/**
 * 3. Successful search with no filters [HAPPY PATH]
 */
test("[HAPPY PATH] GET /services - Search with no filters", async (t) => {
  const response = await t.context.got.get("services");

  t.is(response.statusCode, 200, "Should return 200 OK for unfiltered search");
  t.true(Array.isArray(response.body), "Response should be an array");
  t.truthy(response.body.length, "Response should contain all services");
});

/**
 * 4. Unsuccessful search: ratingFilter out of range [UNHAPPY PATH]
 */
test("[UNHAPPY PATH] GET /services - Invalid 'ratingFilter' (out of range)", async (t) => {
  const filters = { ratingFilter: 6 }; // Out of range (valid range is 1-5)

  try {
    await t.context.got.get("services", {
      searchParams: filters,
    });
    t.fail("Expected request to throw an HTTPError");
  } catch (error) {
    t.is(
      error.response?.statusCode,
      400,
      "Should return 400 Bad Request for invalid ratingFilter"
    );
    t.is(
      error.response?.body?.message,
      "request.query.ratingFilter should be <= 5",
      "Error message should indicate the invalid rating filter"
    );
  }
});

/**
 * 5. Unsuccessful search: ratingFilter not a number [UNHAPPY PATH]
 */
test("[UNHAPPY PATH] GET /services - Invalid 'ratingFilter' (not a number)", async (t) => {
  const filters = { ratingFilter: "abc" }; // Invalid type

  try {
    await t.context.got.get("services", {
      searchParams: filters,
    });
    t.fail("Expected request to throw an HTTPError");
  } catch (error) {
    t.is(
      error.response?.statusCode,
      400,
      "Should return 400 Bad Request for invalid ratingFilter"
    );
    t.is(
      error.response?.body?.message,
      "request.query.ratingFilter should be integer",
      "Error message should indicate the invalid rating filter"
    );
  }
});

/**
 * 6. Unsuccessful search: typeFilter is an empty string [UNHAPPY PATH]
 */
test("[UNHAPPY PATH] GET /services - Invalid 'typeFilter' (empty string)", async (t) => {
  const filters = { typeFilter: "" };

  const error = await t.throwsAsync(
    () => t.context.got.get("services", { searchParams: filters }),
    { instanceOf: t.context.got.HTTPError }
  );

  t.is(
    error.response.statusCode,
    400,
    "Should return 400 Bad Request for empty typeFilter"
  );
  t.is(
    error.response.body.message,
    "Empty value found for query parameter 'typeFilter'",
    "Error message should match expected validation error"
  );
});
