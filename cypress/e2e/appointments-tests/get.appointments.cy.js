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
    cy.get("#operations-appointments-getClientAppointments")
      .should("exist")
      .within(() => {
        // Verify method and data-path
        cy.contains(".opblock-summary-method", "GET")
          .should("exist");

        cy.contains(".opblock-summary-path", "/appointments")
          .should("exist")
          .should("have.attr", "data-path", "/appointments");

        // Verify endpoint description, method, and path are displayed correctly
        cy.contains(
          ".opblock-summary-description",
          "Get the appointments of a client or a service"
        ).should("exist");
      });
  });


  /**
   * Checks if GET /appointments element is clickable
   */
  it("GET /appointments: Is clickable", () => {
    // Ensure the POST /appointments section can be expanded
    cy.get("#operations-appointments-getClientAppointments")
      .click()
      .should("have.class", "is-open")
      .within(() => {
        // Verifies that expected text appears in the expanded section
        cy.contains(
          "FR-8 The client must be able to view his appointments, FR-10 The professional must be able to manage his appointment applications"
        ).should("exist");
      });
  });

  /**
   * Checks if "Try it out" button is clickable
   */
  it("GET /appointments: 'Try it out' button is clickable", () => {
    cy.get("#operations-appointments-getClientAppointments").click();

    cy.get("#operations-appointments-getClientAppointments .try-out__btn")
      .should("contain.text", "Try it out")
      .click()
      .should("contain.text", "Cancel");
  });

  /**
   * Makes a GET /appointments request without parameters
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
    cy.get("#operations-appointments-getClientAppointments .responses-table.live-responses-table")
      .find(".col.response-col_status")
      .should("exist")
      .and("include.text", "200");
  });

  /**
   * Makes a GET /appointments request with parameters
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
    cy.get("#operations-appointments-getClientAppointments .responses-table.live-responses-table")
      .find(".col.response-col_status")
      .should("exist")
      .and("include.text", "200");
  });
});
