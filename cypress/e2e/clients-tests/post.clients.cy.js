/// <reference types="cypress" />

// ------------------------------------------ TESTS: POST /clients ------------------------------------------ //

describe("Servease app: POST /clients", () => {
  /**
   * Opens SwaggerHub UI before each test
   */
  beforeEach(() => {
    cy.visit("http://localhost:8080/docs");
  });

  /**
   * Checks if POST /clients endpoint exists
   */
  it("Contains POST /clients", () => {
    cy.get("#operations-clients-createClient")
      .should("exist")
      .within(() => {
        // Verify endpoint description, method, and path are displayed correctly
        cy.contains(
          ".opblock-summary-description",
          "Create a personal account - client"
        ).should("exist");
        cy.contains(".opblock-summary-method", "POST").should("exist");
        cy.contains(".opblock-summary-path", "/clients").should("exist");
      });
  });

  /**
   * Checks if POST /clients endpoint is clickable and displays additional details
   */
  it("POST /clients is clickable and appears right", () => {
    cy.contains(
      ".opblock-summary-description",
      "Create a personal account - client"
    )
      .click(); // Clicks on the POST /clients summary to expand it
    cy.get("#operations-clients-createClient").should("have.class", "is-open"); // Confirms the section is expanded
    cy.contains("A personal account is created").should("exist"); // Verifies that expected text appears in the expanded section
  });

  /**
   * Verifies if the tryout functionality for POST /clients works and returns a valid response
   */
  it("POST /clients tryout works and returns 200", () => {
    // Load the JSON data from the fixture
    cy.fixture("newClient").then((newClient) => {
      // Expand the POST /clients section
      cy.contains(
        ".opblock-summary-description",
        "Create a personal account - client"
      ).click();

      // Enable the tryout functionality
      cy.get("#operations-clients-createClient .btn.try-out__btn")
        .click()
        .should("contain.text", "Cancel");

      // Insert the entire JSON as a string
      cy.get(".body-param .body-param__text")
        .clear()
        .type(JSON.stringify(newClient, null, 2), { parseSpecialCharSequences: false });

      // Execute the POST request
      cy.get(".btn.execute.opblock-control__btn").click();

      cy.get("#operations-clients-createClient .responses-table.live-responses-table")
      .find(".col.response-col_status")
      .should("exist")
      .and("include.text", "200");
    });
  });
});
