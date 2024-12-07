
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

        // Check that the main div of the route exists
        cy.get("#operations-ratings-createRating")
        .should("exist")
        .within(() => {

            // Check if 'POST' method is shown in the summary
            cy.get(".opblock-summary-method")
            .contains("POST")
            .should("exist");

            // Check if the path element exists and has the correct 'data-path' attribute
            cy.get(".opblock-summary-path")
            .should("exist")
            .should("have.attr", "data-path", "/service/{serviceId}/ratings");

            // Verify description
            cy.get(".opblock-summary-description")
            cy.contains("Create a rating")
            .should("exist");
        });
    });

    
    /**
     * Checks if POST /service/{serviceId}/ratings element is clickable
     */
    it("POST /service/{serviceId}/ratings: Is clickable", () => {
        
        cy.get("#operations-ratings-createRating")
        .click()
        .should("have.class", "is-open")
        .within(() => {
            // Verifies that expected text appears in the expanded section
            cy.contains("FR-6 The client must be able to rate a service")
            .should("exist");
        });
    });


    /**
     * Checks if a valid request POST /service/{serviceId}/ratings can be made
     */
    it("POST /service/{serviceId}/ratings: Sends a valid request", () => {

        cy.get("#operations-ratings-createRating").within(()=>{
        
            // Expand the operation
            cy.get(".opblock-summary")
            .click();

            // Checks if 'Try it out' button exists and clicks it
            cy.get(".try-out__btn")
            .should('exist')
            .should('have.text', 'Try it out ')
            .click()
            .should('have.text', 'Cancel');


            // Load data from the fixture
            cy.fixture("rating.json").then((rating) => {

                const {serviceId} = rating;

                // Update the path parameter (serviceId)
                cy.get("td.col.parameters-col_description")
                .find("input")
                .type(`${serviceId}`)
                .should("have.value", `${serviceId}`);

                // Fill the textarea with a valid JSON body
                cy.get("textarea.body-param__text")
                .clear()
                .type(JSON.stringify(rating, null, 2));

                // Click the 'Execute' button
                cy.get("button.btn.execute.opblock-control__btn")
                .click();

                // Verify the response status
                cy.get(".responses-table.live-responses-table")
                .find(".col.response-col_status")
                .should("exist")
                .and("include.text", "200");
            });
        });
    });
});