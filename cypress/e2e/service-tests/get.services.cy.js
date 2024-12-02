// ------------------------------------------ TESTS: GET /services ------------------------------------------ //

describe("Servease app: GET /services", () => {
  /**
   * Opens SwaggerHub UI
   */
  beforeEach(() => {
    cy.visit("http://localhost:8080/docs/");
  });

  /**
   * Checks if GET /services element exists
   */
  it("GET /services: Exists", () => {
    cy.get("#operations-services-searchServices")
      .should("exist")
      .within(() => {
        // Verify method and data-path
        cy.contains(".opblock-summary-method", "GET").should("exist");

        cy.contains(".opblock-summary-path", "/services")
          .should("exist")
          .should("have.attr", "data-path", "/services");

        // Verify endpoint description, method, and path are displayed correctly
        cy.contains(
          ".opblock-summary-description",
          "Search for services by name and filters"
        ).should("exist");
      });
  });

  /**
   * Checks if GET /appointments element is clickable
   */
  it("GET /services: Is clickable", () => {
    // Ensure the POST /appointments section can be expanded
    cy.get("#operations-services-searchServices")
      .click()
      .should("have.class", "is-open")
      .within(() => {
        // Verifies that expected text appears in the expanded section
        cy.contains(
          "FR-1 The guest must be able to search for services, FR-2 The guest must be able to filter his search for services"
        ).should("exist");
      });
  });

  /**
   * Checks if "Try it out" button is clickable
   */
  it("GET /services: 'Try it out' button is clickable", () => {
    cy.get("#operations-services-searchServices").click();

    cy.get("#operations-services-searchServices .try-out__btn")
      .should("contain.text", "Try it out")
      .click()
      .should("contain.text", "Cancel");
  });

  /**
   * Makes a GET /services request
   */
  it("GET /services: Send a valid request", () => {
    cy.get("#operations-services-searchServices .opblock-summary").click();
    cy.get("#operations-services-searchServices .try-out__btn").click();
    cy.get("#operations-services-searchServices .btn.execute").click();
    cy.get(
      "#operations-services-searchServices .responses-table.live-responses-table"
    )
      .find(".col.response-col_status")
      .should("exist")
      .and("include.text", "200");
  });
});
