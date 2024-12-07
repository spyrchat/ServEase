// ------------------------------------------ TESTS: GET /appointment/{appointmentId} ------------------------------------------ //

describe("Servease app: GET /appointments/{appointmentId}", () => {
  
  /**
   * Opens SwaggerHub UI
   */
  beforeEach(() => {
    cy.visit("http://localhost:8080/docs/");
  });

  /**
   * Checks if GET /appointments/{appointmentId} element exists
   */
  it("GET /appointments/{appointmentId}: Exists", () => {
    cy.get("#operations-appointments-getAppointment")
      .should("exist") // Ensure the main div exists
      .within(() => {
        // Verify method and path
        cy.contains(".opblock-summary-method", "GET").should("exist");

        cy.contains(".opblock-summary-path", "/appointments")
          .should("exist")
          .should("have.attr", "data-path", "/appointments/{appointmentId}");

        // Verify description
        cy.contains(
          ".opblock-summary-description",
          "Get an appointment by Id"
        ).should("exist");
      });
  });


  /**
   * Checks if GET /appointments/{appointmentId} element is clickable
   */
  it("GET /appointments/{appointmentId}: Is clickable", () => {
    // Ensure the GET /appointments/{appointmentId} section can be expanded
    cy.get("#operations-appointments-getAppointment")
      .click()
      .should("have.class", "is-open")
      .within(() => {
        // Verifies that expected text appears in the expanded section
        cy.contains(
          "No matching FR"
        ).should("exist");
      });
  });

  /**
   * Checks if "Try it out" button is clickable
   */
  it("GET /appointments/{appointmentId}: 'Try it out' button is clickable", () => {
    cy.get("#operations-appointments-getAppointment").click();

    cy.get("#operations-appointments-getAppointment .try-out__btn")
      .should("contain.text", "Try it out")
      .click()
      .should("contain.text", "Cancel");
  });

  /**
   * Makes a GET /appointments/{appointmentId} request
   */
  it("GET /appointments/{appointmentId}: Send a valid request", () => {
    cy.get("#operations-appointments-getAppointment .opblock-summary").click();
    cy.get("#operations-appointments-getAppointment .try-out__btn").click();

    cy.get(
      '#operations-appointments-getAppointment tr[data-param-name="appointmentId"]'
    )
      .should("exist")
      .find("input")
      .clear()
      .type("1");
    
    cy.get("#operations-appointments-getAppointment .btn.execute").click();
    
    cy.get("#operations-appointments-getAppointment .responses-table.live-responses-table")
      .find(".col.response-col_status")
      .should("exist")
      .and("include.text", "200");
  });
});
