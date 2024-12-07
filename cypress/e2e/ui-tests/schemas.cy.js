// ------------------------------------------ TESTS: Schemas ------------------------------------------ //

describe("Servease app: Schemas Section UI Tests", () => {
  /**
   * Opens SwaggerHub UI
   */
  beforeEach(() => {
    cy.visit("http://localhost:8080/docs/");
  });

  /**
   * Checks if schemas section exists and is clickable
   */
  it("Schemas section: Exists and is clickable", () => {
    // Check the existence of the models section
    cy.get("section.models").should("exist").should("have.class", "is-open");

    // Check if the models section has the title "Schemas"
    cy.get("section.models h4 span").should("contain.text", "Schemas");

    // Check if the models section is clickable
    cy.get("section.models h4").click();

    cy.get("section.models").should("not.have.class", "is-open");

    // Retoggle
    cy.get("section.models h4").click();

    cy.get("section.models").should("have.class", "is-open");
  });

  /**
   * Checks each model-container
   */
  it('Schemas section: Each "model-container" exists, is clickable, and has the correct title', () => {
    const modelContainers = [
      { id: "model-NewService", title: "NewService" },
      { id: "model-Service", title: "Service" },
      { id: "model-NewClient", title: "NewClient" },
      { id: "model-Client", title: "Client" },
      { id: "model-PersonalInformation", title: "PersonalInformation" },
      { id: "model-NewAppointment", title: "NewAppointment" }, 
      { id: "model-Appointment", title: "Appointment" }, 
      { id: "model-TimeSlot", title: "TimeSlot" }, 
      { id: "model-Rating", title: "Rating" }, 
      { id: "model-Error", title: "Error" }
    ];

    modelContainers.forEach((container) => {
      // Check if the model-container exists
      cy.get(`#${container.id}`).should("exist");

      // Initially ensure the table is not visible
      cy.get(`#${container.id} table.model`).should("not.exist");

      // Check if the model-container has the correct title
      cy.get(`#${container.id} .model-title`).should(
        "contain.text",
        container.title
      );

      // Check if the model-container is clickable
      cy.get(`#${container.id} span.model-box`).first().click();

      // Check that table is visible
      cy.get(`#${container.id} table.model`).should("exist");
    });
  });
});
