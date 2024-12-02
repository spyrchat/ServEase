// ------------------------------------------ TESTS: GET /appointments ------------------------------------------ //

describe("Servease app: GET /appointments", () => {
  /**
   * Opens SwaggerHub UI
   */

  beforeEach(() => {
    cy.visit("http://localhost:8080/docs/");
  });

  /**
   * Checks if GET /appointments element exists
   */
  it("GET /appointments: Exists", () => {
    // Verify the GET method and endpoint are present
    cy.get(
      "#operations-appointments-getClientAppointments .opblock-summary-method"
    )
      .contains("GET")
      .should("exist");

    cy.get(
      "#operations-appointments-getClientAppointments .opblock-summary-path"
    )
      .should("exist")
      .should("have.attr", "data-path", "/appointments");
  });

  /**
   * Checks if GET /appointments element is clickable
   */
  it("GET /appointments: Is clickable", () => {
    // Ensure the GET /appointments section can be expanded
    cy.get(
      "#operations-appointments-getClientAppointments .opblock-summary"
    ).click();
    cy.get("#operations-appointments-getClientAppointments").should(
      "have.class",
      "is-open"
    );
  });

  /**
   * Checks if "Try it out" button is clickable
   */
  it("GET /appointments: 'Try it out' button is clickable", () => {
    cy.get("#operations-appointments-getAppointment .opblock-summary").click();
    cy.get("#operations-appointments-getAppointment .try-out__btn").click();
    cy.get("#operations-appointments-getAppointment .try-out__btn").should(
      "contain.text",
      "Cancel"
    ); // Assuming the button changes text after clicking
  });

  /**
   * Makes a GET /appointments/{appointmentId} request
   */
  it("GET /appointments: Send a valid request", () => {
    cy.get(
      "#operations-appointments-getClientAppointments .opblock-summary"
    ).click();
    cy.get(
      "#operations-appointments-getClientAppointments .try-out__btn"
    ).click();
    cy.get(
      "#operations-appointments-getClientAppointments .btn.execute"
    ).click();
    cy.get("#operations-appointments-getClientAppointments .responses-wrapper")
      .contains("200")
      .should("exist");
  });

  /**
   *
   */
  it("GET /appointments: Try it out with clientId and serviceId", () => {
    const clientId = 2;
    const serviceId = 2;

    cy.get(
      "#operations-appointments-getClientAppointments .opblock-summary"
    ).click();
    cy.get(
      "#operations-appointments-getClientAppointments .try-out__btn"
    ).click();

    // Enter clientId and serviceId in the appropriate input fields
    // Find the <tr> with data-param-name="clientId" and type into its input field
    cy.get(
      '#operations-appointments-getClientAppointments tr[data-param-name="clientId"]'
    )
      .should("exist")
      .find("input")
      .clear()
      .type(clientId);

    // Find the <tr> with data-param-name="serviceId" and type into its input field
    cy.get(
      '#operations-appointments-getClientAppointments tr[data-param-name="serviceId"]'
    )
      .should("exist")
      .find("input")
      .clear()
      .type(serviceId);

    // Execute the request
    cy.get(
      "#operations-appointments-getClientAppointments .btn.execute"
    ).click();

    // Verify the response contains a 200 status code
    cy.get("#operations-appointments-getClientAppointments .responses-wrapper")
      .contains("200")
      .should("exist");
  });
});
