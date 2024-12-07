
// -------------------------------- TESTS: PUT /appointments/{appointmentId} ------------------------------ //

describe("Servease app: PUT /appointments/{appointmentId}", () =>{

    /**
     * Opens SwaggerHub UI before each test
     */
    beforeEach(()=> {
        cy.visit("http://localhost:8080/docs/");
    });


    /**
     * Checks if PUT /appointments/{appointmentId} element exists
     */
    it("PUT /appointments/{appointmentId}: Exists", () => {

        // Check that the main div of the route exists
        cy.get("#operations-appointments-editServiceAppointment")
        .should("exist")
        .within(() => {

            // Check if 'POST' method is shown in the summary
            cy.get(".opblock-summary-method")
            .should("exist")
            .should("contain.text", "PUT");

            // Check if the path element exists and has the correct 'data-path' attribute
            cy.get(".opblock-summary-path")
            .should("exist")
            .should("have.attr", "data-path", "/appointments/{appointmentId}");

            // Verify description
            cy.get(".opblock-summary-description")
            cy.contains("Edit an appointment")
            .should("exist");
        });
    });

    
    /**
     * Checks if PUT /appointments/{appointmentId} element is clickable
     */
    it("PUT /appointments/{appointmentId}: Is clickable", () => {
        
        cy.get("#operations-appointments-editServiceAppointment")
        .click()
        .should("have.class", "is-open")
        .within(() => {
            // Verifies that expected text appears in the expanded section
            cy.contains("FR-10 The professional must be able to manage his appointment applications, FR-7 The client must be able to cancel his appointment")
            .should("exist");
        });
    });


    /**
     * Checks if a valid request PUT /appointments/{appointmentId} can be made
     */
    it("PUT /appointments/{appointmentId}: Sends a valid request", () => {

        cy.get("#operations-appointments-editServiceAppointment").within(()=>{
        
            // Expand the operation
            cy.get(".opblock-summary")
            .click();

            // Checks if 'Try it out' button exists and clicks it
            cy.get(".try-out__btn")
            .should('exist')
            .should('have.text', 'Try it out ')

            cy.get(".try-out__btn")
            .click()
            .should('have.text', 'Cancel');


            // Load data from the fixture
            cy.fixture("Appointment.json").then((appointment) => {

                const {appointmentId} = appointment;

                // Update the path parameter (serviceId)
                cy.get("td.col.parameters-col_description")
                .find("input")
                .type(`${appointmentId}`)
                .should("have.value", `${appointmentId}`);

                // Fill the textarea with a valid JSON body
                cy.get("textarea.body-param__text")
                .clear()
                .type(JSON.stringify(appointment, null, 2));

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