
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
    // Verify the POST method and endpoint are present
    cy.get("#operations-appointments-createAppointment .opblock-summary-method")
      .contains("POST")
      .should("exist");

    cy.get("#operations-appointments-createAppointment .opblock-summary-path")
      .should("exist")
      .should("have.attr", "data-path", "/appointments");
  });

  /**
   * Checks if POST /appointments element is clickable
   */
  it("POST /appointments: Is clickable", () => {
    // Ensure the POST /appointments section can be expanded
    cy.get(
      "#operations-appointments-createAppointment .opblock-summary"
    ).click();
    cy.get("#operations-appointments-createAppointment").should(
      "have.class",
      "is-open"
    );
  });

  /**
   * Checks if "Try it out" button is clickable 
   */
  it("POST /appointments: 'Try it out' button is clickable", () => {
    cy.get(
      "#operations-appointments-createAppointment .opblock-summary"
    ).click();
    cy.get("#operations-appointments-createAppointment .try-out__btn").click();
    cy.get("#operations-appointments-createAppointment .try-out__btn").should(
      "contain.text",
      "Cancel"
    ); // Assuming the button changes text after clicking
  });

  /**
   * Makes a POST /appointments request
   */
  it("POST /appointments: Sends a valid request", () => {
    cy.get(
      "#operations-appointments-createAppointment .opblock-summary"
    ).click();
    cy.get("#operations-appointments-createAppointment .try-out__btn").click();

    const clientId = 1;
    const serviceId = 1;

    cy.get("#operations-appointments-createAppointment textarea")
      .clear()
      .type(`
        clientId: ${clientId},
        serviceId: ${serviceId},
        serviceDetails: "Need to fix my car",
        status: "Confirmation Pending",
        timeSlot:
          {
            availability: true,
            date: "2024-12-20",
            startingTime: "15:00:00",
          },`,
        { parseSpecialCharSequences: false }
      );
    cy.get("#operations-appointments-createAppointment .btn.execute").click();
    cy.get("#operations-appointments-createAppointment .responses-wrapper")
      .contains("200")
      .should("exist");
  });
});
