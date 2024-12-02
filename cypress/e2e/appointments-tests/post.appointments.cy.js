// ------------------------------------------ TESTS: POST /appointments ------------------------------------------ //

describe("Servease app: POST /appointments", () => {
  
  /**
   * Opens SwaggerHub UI
   */
  beforeEach(() => {
    cy.visit("http://localhost:8080/docs/");
  });

  /**
   * Checks if POST /appointments element exists
   */
  it("POST /appointments: Exists", () => {
    cy.get("#operations-appointments-createAppointment")
      .should("exist")
      .within(() => {
        // Verify method and data-path
        cy.contains(".opblock-summary-method", "POST")
          .should("exist");

        cy.contains(".opblock-summary-path", "/appointments")
          .should("exist")
          .should("have.attr", "data-path", "/appointments");

        // Verify endpoint description, method, and path are displayed correctly
        cy.contains(
          ".opblock-summary-description",
          "Create an appointment"
        ).should("exist");
      });
  });

  /**
   * Checks if POST /appointments element is clickable
   */
  it("POST /appointments: Is clickable", () => {
    // Ensure the POST /appointments section can be expanded
    cy.get("#operations-appointments-createAppointment")
      .click()
      .should("have.class", "is-open")
      .within(() => {
        // Verifies that expected text appears in the expanded section
        cy.contains(
          "FR-3 The client must be able to apply for an appointment at a service"
        ).should("exist");
      });
  });

  /**
   * Checks if "Try it out" button is clickable
   */
  it("POST /appointments: 'Try it out' button is clickable", () => {
    cy.get("#operations-appointments-createAppointment").click();

    cy.get("#operations-appointments-createAppointment .try-out__btn")
      .should("contain.text", "Try it out")
      .click()
      .should("contain.text", "Cancel");
  });

  /**
   * Makes a POST /appointments request
   */
  it("POST /appointments: Sends a valid request", () => {
    cy.fixture("newAppointment").then((newAppointment) => {
      cy.get("#operations-appointments-createAppointment").click();

      cy.get(
        "#operations-appointments-createAppointment .try-out__btn"
      ).click();

      cy.get("#operations-appointments-createAppointment textarea")
        .clear()
        .type(JSON.stringify(newAppointment, null, 2), {
          parseSpecialCharSequences: false,
        });

      cy.get("#operations-appointments-createAppointment .btn.execute").click();

      // Verify the response status
      cy.get(
        "#operations-appointments-createAppointment .responses-table.live-responses-table"
      )
        .find(".col.response-col_status")
        .should("exist")
        .and("include.text", "200");
    });
  });
});
