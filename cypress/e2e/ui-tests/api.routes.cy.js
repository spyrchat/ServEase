
// ------------------------------------ TESTS: API Routes ----------------------------------------- //

describe("Servease app: API Routes", () =>{

    /**
     * Opens SwaggerHub UI before each test
     */
    beforeEach(()=> {
        cy.visit("http://localhost:8080/docs/");
    });


    /**
     * Checks if all the section "services" exists and is clickable
     */
    it("API Route 'services': Exists and is clickable", () => {
        // Check that the 'services' section exists
        cy.get("#operations-tag-services")
        .should("exist")
        .should("have.attr", "data-is-open", "true")   // The section is expanded (open) in the begining
        .within(()=>{
            // Checks if section label is 'services'
            cy.get("span")
            .should("contain.text", "services");

            // Check that the arrow button is facing down
            cy.get("button.expand-operation")
            .find("use")
            .should("have.attr", "href", "#large-arrow-down");
        })
        .click() // Click to close the section
        .should("have.attr", "data-is-open", "false")  // Verify the section is closed
        .within(()=>{
            // Check that the arrow button is facing to the right
            cy.get("button.expand-operation")
            .find("use")
            .should("have.attr", "href", "#large-arrow");
        });
    });

    
    /**
     * Checks if all the section "clients" exists and is clickable
     */
    it("API Route 'clients': Exists and is clickable", () => {
        // Check that the 'clients' section exists
        cy.get("#operations-tag-clients")
        .should("exist")
        .should("have.attr", "data-is-open", "true")   // The section is expanded (open) in the begining
        .within(()=>{
            // Checks if section label is 'clients'
            cy.get("span")
            .should("contain.text", "clients");

            // Check that the arrow button is facing down
            cy.get("button.expand-operation")
            .find("use")
            .should("have.attr", "href", "#large-arrow-down");
        })
        .click() // Click to close the section
        .should("have.attr", "data-is-open", "false")  // Verify the section is closed
        .within(()=>{
            // Check that the arrow button is facing to the right
            cy.get("button.expand-operation")
            .find("use")
            .should("have.attr", "href", "#large-arrow");
        });
    });

    /**
     * Checks if all the section "appointments" exists and is clickable
     */
    it("API Route 'appointments': Exists and is clickable", () => {
        // Check that the 'appointments' section exists
        cy.get("#operations-tag-appointments")
        .should("exist")
        .should("have.attr", "data-is-open", "true")   // The section is expanded (open) in the begining
        .within(()=>{
            // Checks if section label is 'appointments'
            cy.get("span")
            .should("contain.text", "appointments");

            // Check that the arrow button is facing down
            cy.get("button.expand-operation")
            .find("use")
            .should("have.attr", "href", "#large-arrow-down");
        })
        .click() // Click to close the section
        .should("have.attr", "data-is-open", "false")  // Verify the section is closed
        .within(()=>{
            // Check that the arrow button is facing to the right
            cy.get("button.expand-operation")
            .find("use")
            .should("have.attr", "href", "#large-arrow");
        });
    });




    /**
     * Checks if all the section "ratings" exists and is clickable
     */
    it("API Route 'ratings': Exists and is clickable", () => {
        // Check that the 'ratings' section exists
        cy.get("#operations-tag-ratings")
        .should("exist")
        .should("have.attr", "data-is-open", "true")   // The section is expanded (open) in the begining
        .within(()=>{
            // Checks if section label is 'ratings'
            cy.get("span")
            .should("contain.text", "ratings");

            // Check that the arrow button is facing down
            cy.get("button.expand-operation")
            .find("use")
            .should("have.attr", "href", "#large-arrow-down");
        })
        .click() // Click to close the section
        .should("have.attr", "data-is-open", "false")  // Verify the section is closed
        .within(()=>{
            // Check that the arrow button is facing to the right
            cy.get("button.expand-operation")
            .find("use")
            .should("have.attr", "href", "#large-arrow");
        });
    });


});
