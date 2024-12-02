// ------------------------------------------ TESTS: GET /services/{serviceId} ------------------------------------------ //

describe("Servease app: GET /services/{serviceId}", () => {
  /**
   * Opens SwaggerHub UI
   */
  beforeEach(() => {
    cy.visit("http://localhost:8080/docs/");
  });

  /**
   * Checks if GET /services/{serviceId} element exists
   */
  it("GET /services/{serviceId}: Exists", () => {
    cy.get("#operations-services-getService")
      .should("exist")
      .within(() => {
        // Verify method and data-path
        cy.contains(".opblock-summary-method", "GET").should("exist");

        cy.contains(".opblock-summary-path", "/services")
          .should("exist")
          .should("have.attr", "data-path", "/services/{serviceId}");

        // Verify endpoint description, method, and path are displayed correctly
        cy.contains(".opblock-summary-description", "Get a service")
          .should("exist");
      });
  });

  /**
   * Checks if GET /services/{serviceId} element is clickable
   */
  it("GET /services/{serviceId}: Is clickable", () => {
    // Ensure the GET /services/{serviceId} section can be expanded
    cy.get("#operations-services-getService")
      .click()
      .should("have.class", "is-open")
      .within(() => {
        // Verifies that expected text appears in the expanded section
        cy.contains(
          "FR-5 The client must be able to access a service's information, FR-9 The professional must be able to edit his service's information"
        ).should("exist");
      });
  });

  /**
   * Checks if "Try it out" button is clickable
   */
  it("GET /services/{serviceId}: 'Try it out' button is clickable", () => {
    cy.get("#operations-services-searchServices").click();

    cy.get("#operations-services-searchServices .try-out__btn")
      .should("contain.text", "Try it out")
      .click()
      .should("contain.text", "Cancel");
  });

  /**
   * Makes a GET /services/{serviceId} request
   */
  it("GET /services/{serviceId}: Try it out with serviceId", () => {
    const serviceId = 2;

    cy.get("#operations-services-getService .opblock-summary").click();
    cy.get("#operations-services-getService .try-out__btn").click();

    // Find the <tr> with data-param-name="serviceId" and type into its input field
    cy.get('#operations-services-getService tr[data-param-name="serviceId"]')
      .should("exist")
      .find("input")
      .clear()
      .type(serviceId);

    // Execute the request
    cy.get("#operations-services-getService .btn.execute").click();

    // Verify the response contains a 200 status code
    cy.get(
      "#operations-services-getService .responses-table.live-responses-table"
    )
      .find(".col.response-col_status")
      .should("exist")
      .and("include.text", "200");
  });
});
