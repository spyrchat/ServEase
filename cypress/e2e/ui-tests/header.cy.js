// ------------------------------------------ UI Tests: Swagger UI Basic Elements ------------------------------------------ //

describe("Swagger UI: Basic Elements Test", () => {
  /**
   * Open the Swagger UI documentation page before each test
   */
  beforeEach(() => {
    cy.visit("http://localhost:8080/docs/");

    // Ensure the main Swagger UI container loads within 10 seconds
    cy.get("#swagger-ui", { timeout: 10000 }).should("exist");
  });

  /**
   * Check if the upper bar exists
   */
  it("Checks if the upper bar exists", () => {
    cy.get("#swagger-ui .topbar").should("exist").and("be.visible"); // Verifies the upper bar is present and visible
  });

  /**
   * Check if the search bar exists
   */
  it("Checks if the search bar exists", () => {
    cy.get("#swagger-ui input[type='text']").should("exist").and("be.visible"); // Verifies the search bar is present and visible
  });

  /**
   * Check if the title 'Servease' exists
   */
  it("Checks if the title 'Servease' exists", () => {
    cy.get("#swagger-ui")
      .contains("ServEase")
      .should("exist")
      .and("be.visible"); // Verifies the title 'Servease' is present and visible
  });
});
