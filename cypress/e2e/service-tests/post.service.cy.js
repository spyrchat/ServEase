/// <reference types="cypress" />

// ------------------------------------------ TESTS: POST /services ------------------------------------------ //

describe("Servease app: POST /services", () => {
  /**
   * Opens SwaggerHub UI before each test
   */
  beforeEach(() => {
    cy.visit("http://localhost:8080/docs");
  });

  /**
   * Checks if POST /services endpoint exists
   */
  it("Contains POST /services", () => {
    cy.get("#operations-services-createService")
      .should("exist")
      .within(() => {
        // Verify endpoint description, method, and path are displayed correctly
        cy.contains(
          ".opblock-summary-description",
          "Create a professional account - service"
        ).should("exist");
        cy.contains(".opblock-summary-method", "POST").should("exist");
        cy.contains(".opblock-summary-path", "/services").should("exist");
      });
  });

  /**
   * Checks if POST /services endpoint is clickable and displays additional details
   */
  it("POST /services is clickable and appears right", () => {
    cy.contains(
      ".opblock-summary-description",
      "Create a professional account - service"
    ).click(); // Clicks on the POST /services summary to expand it
    cy.get("#operations-services-createService").should(
      "have.class",
      "is-open"
    ); // Confirms the section is expanded
    cy.contains("A professional account is created").should("exist"); // Verifies that expected text appears in the expanded section
  });

  /**
   * Verifies if the tryout functionality for POST /services works and returns a valid response
   */
  it("POST /services tryout works and returns 200", () => {
    // Load the JSON data from the fixture
    cy.fixture("newService").then((newService) => {
      // Expand the POST /services section
      cy.contains(
        ".opblock-summary-description",
        "Create a professional account - service"
      ).click();

      // Enable the tryout functionality
      cy.get("#operations-services-createService .btn.try-out__btn")
        .click()
        .should("contain.text", "Cancel");

      // Insert the entire JSON as a string
      cy.get(".body-param .body-param__text")
        .clear()
        .type(JSON.stringify(newService, null, 2), {
          parseSpecialCharSequences: false,
        });

      // Execute the POST request
      cy.get(".btn.execute.opblock-control__btn").click();

      cy.get(
        "#operations-services-createService .responses-table.live-responses-table"
      )
        .find(".col.response-col_status")
        .should("exist")
        .and("include.text", "200");
    });
  });
});
