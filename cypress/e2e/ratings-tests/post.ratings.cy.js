
// -------------------------------- TESTS: POST /service/{serviceId}/ratings ------------------------------ //

describe("Servease app: POST /service/{serviceId}/ratings", () =>{

    /**
     * Opens SwaggerHub UI before each test
     */
    beforeEach(()=> {
        cy.visit("http://localhost:8080/docs/");
    });


    /**
     * Checks if POST /service/{serviceId}/ratings element exists
     */
    it("POST /service/{serviceId}/ratings: Exists", () => {

        // Check if 'POST' method is shown in the summary
        cy.get("#operations-ratings-createRating .opblock-summary-method")
        .contains("POST")
        .should("exist");

        // Check if the path element exists and has the correct 'data-path' attribute
        cy.get("#operations-ratings-createRating .opblock-summary-path")
        .should("exist")
        .should("have.attr", "data-path", "/service/{serviceId}/ratings");
    });

    
    /**
     * Checks if POST /service/{serviceId}/ratings element is clickable
     */
    it("POST /service/{serviceId}/ratings: Is clickable", () => {

        cy.get("#operations-ratings-createRating .opblock-summary")
        .click();

        // Verify the section is expanded by checking the 'is-open' class
        cy.get("#operations-ratings-createRating")
        .should("have.class", "is-open");
    });


    /**
     * Checks if a valid request POST /service/{serviceId}/ratings can be made
     */
    it("POST /service/{serviceId}/ratings: Sends a valid request", () => {

        cy.get("#operations-ratings-createRating .opblock-summary")
        .click();

        // Checks if 'Try it out' button exists
        cy.get("#operations-ratings-createRating .try-out__btn")
        .should('exist')
        .should('have.text', 'Try it out ');

        // Checks if button is clicked
        cy.get("#operations-ratings-createRating .try-out__btn")
        .click()
        .should('have.text', 'Cancel');

        const clientId = 1;
        const serviceId = 1;

        // Update the path parameter serviceId
        cy.get("#operations-ratings-createRating td.col.parameters-col_description")
        .find("input")  // Select the input field
        .type(`${serviceId}`)  // Type a value into the input field
        .should('have.value', `${serviceId}`);

        // Fill the textarea with a valid JSON body
        cy.get("#operations-ratings-createRating  textarea.body-param__text")
        .clear() // Clear existing content
        .type(`{"date": "2022-08-05", 
                "clientId": ${clientId}, 
                "review": "Very professional, I would recommend.", 
                "stars": 4, 
                "serviceId": ${serviceId}
                }`);

        // Click the 'Execute' button
        cy.get("#operations-ratings-createRating button.btn.execute.opblock-control__btn")
        .click();
        
        // Verify the response status
        cy.get("#operations-ratings-createRating .responses-table.live-responses-table")
        .find(".col.response-col_status")
        .should("exist")
        .and("include.text", "200");
    });
    
});