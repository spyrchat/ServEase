/// <reference types="cypress" />

// ------------------------------------------ TESTS: DELETE /services/{serviceId} ------------------------------------------ //

describe("Servease app: DELETE /services/{serviceId}", () => {
    /**
     * Opens SwaggerHub UI before each test
     */
    beforeEach(() => {
      cy.visit("http://localhost:8080/docs");
    });
  
    /**
     * Checks if DELETE /services/{serviceId} endpoint exists
     */
    it("Contains DELETE /services/{serviceId}", () => {
      cy.get("#operations-services-deleteService")
        .should("exist")
        .within(() => {
          // Verify endpoint description, method, and path are displayed correctly
          cy.contains(".opblock-summary-description", "Delete a service").should(
            "exist"
          );
          cy.contains(".opblock-summary-method", "DELETE").should("exist");
          cy.contains(".opblock-summary-path", "/services").should("exist");
          cy.contains(".opblock-summary-path", "/{serviceId}").should("exist");
        });
    });

    it("Checks if `serviceId` input is disabled initially and becomes enabled after clicking 'Try it out'", () => {
        cy.get("#operations-services-deleteService")
          .should("exist")
          .within(() => {
            // Open the DELETE /services/{serviceId} section
            cy.get(".opblock-summary").click();
    
            // Verify the `serviceId` input box is initially disabled
            cy.get("input[placeholder='serviceId - ID of the service to delete']")
              .should("exist")
              .and("be.disabled");
    
            // Click the 'Try it out' button
            cy.contains("button", "Try it out").should("exist").click();
    
            // Verify the `serviceId` input box becomes enabled
            cy.get("input[placeholder='serviceId - ID of the service to delete']")
              .should("exist")
              .and("not.be.disabled");
          });
      });

    it ("Deletes a service by id", () => {
        cy.get("#operations-services-deleteService")
          .should("exist")
          .within(() => {
            // Open the DELETE /services/{serviceId} section
            cy.get(".opblock-summary").click();
            
            //Try it out button
            cy.contains("button", "Try it out").click();
    
            // Type the serviceId
            cy.get("input[placeholder='serviceId - ID of the service to delete']")
            .type("1");
            // Execute the DELETE request
            cy.get(".btn.execute.opblock-control__btn").click();

            cy.get(".responses-table.live-responses-table"
            )
                .find(".col.response-col_status")
                .should("exist")
                .and("include.text", "200");
          });
    })
})