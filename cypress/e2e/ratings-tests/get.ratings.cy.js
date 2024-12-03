
// -------------------------------- TESTS: GET /service/{serviceId}/ratings ------------------------------ //

describe("Servease app: GET /service/{serviceId}/ratings", () =>{

    /**
     * Opens SwaggerHub UI before each test
     */
    beforeEach(()=> {
        cy.visit("http://localhost:8080/docs/");
    });


    /**
     * Checks if GET /service/{serviceId}/ratings element exists
     */
    it("GET /service/{serviceId}/ratings: Exists", () => {

        // Check that the main div of the route exists
        cy.get("#operations-ratings-getServiceRatings")
        .should("exist")
        .within(() => {

            // Check if 'GET' method is shown in the summary
            cy.get(".opblock-summary-method")
            .contains("GET")
            .should("exist");

            // Check if the path element exists and has the correct 'data-path' attribute
            cy.get(".opblock-summary-path")
            .should("exist")
            .should("have.attr", "data-path", "/service/{serviceId}/ratings");

            // Verify description
            cy.get(".opblock-summary-description")
            cy.contains("Get the ratings of a service")
            .should("exist");
        });
    });

    
    /**
     * Checks if GET /service/{serviceId}/ratings element is clickable
     */
    it("GET /service/{serviceId}/ratings: Is clickable", () => {
        cy.get("#operations-ratings-getServiceRatings")
        .click()
        .should("have.class", "is-open")
        .within(() => {
            // Verifies that expected text appears in the expanded section
            cy.contains("FR-5 The client must be able to access a service's information, FR-9 The professional must be able to edit his service's information")
            .should("exist");
        });
    });


    /**
     * Checks if a valid request GET /service/{serviceId}/ratings can be made
     */
    it("GET /service/{serviceId}/ratings: Sends a valid request", () => {

        cy.get("#operations-ratings-getServiceRatings").within(()=>{
        
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