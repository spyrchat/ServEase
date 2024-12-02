/// <reference types="cypress" />

// ------------------------------------------ TESTS: PUT /services/{serviceId} ------------------------------------------ //

describe("Servease app: PUT /services/{serviceId}", () => {
    /**
     * Opens SwaggerHub UI before each test
     */
    beforeEach(() => {
      cy.visit("http://localhost:8080/docs");
    });
  
    /**
     * Checks if PUT /services/{serviceId} endpoint exists
     */
    it("Contains PUT /services/{serviceId}", () => {
      cy.get("#operations-services-editService")
        .should("exist")
        .within(() => {
          // Verify endpoint description, method, and path are displayed correctly
          cy.contains(
            ".opblock-summary-description",
            "Edit a service"
          ).should("exist");
          cy.contains(".opblock-summary-method", "PUT").should("exist");
          cy.contains(".opblock-summary-path", "/services").should("exist");
          cy.contains(".opblock-summary-path", "/{serviceId}").should("exist");
        });
    });

    /**
   * Checks if POST /clients endpoint is clickable and displays additional details
   */
  it("PUT /services/{serviceId} is clickable and appears right", () => {
    cy.contains(
      ".opblock-summary-description",
      "Edit a service"
    )
      .click(); // Clicks on the POST /clients summary to expand it
    cy.get("#operations-services-editService").should("have.class", "is-open"); // Confirms the section is expanded
    cy.contains("FR-9 The professional must be able to edit his service's information")
    .should("exist"); // Verifies that expected text appears in the expanded section
  });
  /**
   * Verifies if the tryout functionality for POST /clients works and returns a valid response
   */
  it("PUT /services/{serviceId} tryout works and returns 200", () => {
    // Load the JSON data from the fixture
    cy.fixture("service").then((service) => {
      // Expand the POST /clients section
      cy.contains(
        ".opblock-summary-description",
        "Edit a service"
      ).click();

      // Enable the tryout functionality
      cy.get("#operations-services-editService .btn.try-out__btn")
        .click()
        .should("contain.text", "Cancel");

        cy.get('input[placeholder="serviceId - The service\'s id"]')
        .type('1'); 

      // Insert the entire JSON as a string
      cy.get(".body-param .body-param__text")
        .clear()
        .type(JSON.stringify(service, null, 2), { parseSpecialCharSequences: false });

      // Execute the POST request
      cy.get(".btn.execute.opblock-control__btn").click();

      cy.get("#operations-services-editService .responses-table.live-responses-table")
      .find(".col.response-col_status")
      .should("exist")
      .and("include.text", "200");
    });
  });
  
    
  });
  