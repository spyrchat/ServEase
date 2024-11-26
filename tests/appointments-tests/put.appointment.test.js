const http = require("http");
const test = require("ava");
const got = require("got");
const app = require("../../index.js");


// ------------------------------- TESTS: PUT /appointments/{appointmentId} ------------------------------- //

/**
 * Opens server, before tests.
 */
test.before(async (t) => {
    // Create server
    t.context.server = http.createServer(app);
    const server = t.context.server.listen();
    const { port } = server.address();
    t.context.got = got.extend({
        responseType: "json",
        prefixUrl: `http://localhost:${port}`,
    }); 
});


/**
 * Closes server, after tests.
 */
test.after.always(async (t) => {
    // Close the server
    t.context.server.close();
});




/**
 * Tests successful modification of an appointment  [HAPPY PATH].
 */
test("editServiceAppointment - Successful appointment modification", async (t) => {

    try{ 
        // Suppose appointment with the following id exist
        const appointmentId = 1;

        // Prepare the request body
        let requestBody = {
            appointmentId: appointmentId,
            clientId: 1,
            serviceId: 1,
            serviceDetails: "Need to fix my fridge",
            status: "Confirmed",    // new status (changed)
            timeSlot: [{
              availability: true,
              date: "2024-12-20",
              startingTime: "15:00:00",
            }],
        };
    
        // POST request to create a new rating for serviceId = 1
        const appointmentResponse = await t.context.got.put(`appointments/${appointmentId}`, { json: requestBody });

        t.is(appointmentResponse.statusCode, 200);
        
        t.deepEqual(
            appointmentResponse.body,
            {
                appointmentId: appointmentId,
                clientId: requestBody.clientId,
                serviceDetails: requestBody.serviceDetails,
                serviceId: requestBody.serviceId,
                status: requestBody.status,
                timeSlot: requestBody.timeSlot
            },
            "Response body should reflect the updated appointment details"
        );

    } catch (error) {
        t.fail(`Test encountered an unexpected error: ${error.message}`);
    }
});




/**
 * Tests unsuccessful modification of an appointment - appointment with appointmentId does NOT exist [UNHAPPY PATH].
 */
test("editServiceAppointment - Appointment doesn't exist", async (t) => {

    // Suppose appointment with the following id do NOT exist
    const invalidAppointmentId = 999;

    // Prepare the request body
    let requestBody = {
        appointmentId: invalidAppointmentId,
        clientId: 1,
        serviceId: 1,
        serviceDetails: "Need to fix my fridge",
        status: "Confirmed",    // new status (changed)
        timeSlot: [{
            availability: true,
            date: "2024-12-20",
            startingTime: "15:00:00",
        }],
    };

    try{ 
        const appointmentResponse = await t.context.got.put(`appointments/${invalidAppointmentId}`, { json: requestBody });
        t.fail("Expected editServiceAppointment to throw an error");

    } catch (error) {
        t.is(error.response.statusCode, 404);
        t.is(error.response.body.message, `No appointment found with appointmentId: ${invalidAppointmentId}`);
    }
});






/**
 * Tests unsuccessful modification of an appointment - Attempt to modify appointmentId [UNHAPPY PATH].
 */
test("editServiceAppointment - Attempt to modify appointmentId should fail", async (t) => {
    try {
        const appointmentId = 1;

        const requestBody = {
        appointmentId: 2,   // Trying to change appointmentId
        clientId: 1,
        serviceId: 1,
        serviceDetails: "Updated details",
        status: "Confirmed",
        timeSlot: [
            {
            availability: true,
            date: "2024-12-21",
            startingTime: "14:00:00",
            },
        ],
      };
  
      const appointmentResponse = await t.context.got.put(`appointments/${appointmentId}`, {json: requestBody,});
      t.fail("Request should not succeed if attempting to modify appointmentId.");

    } catch (error) {
        t.is(error.response.statusCode, 400, "Should return 400 Bad Request");
        t.is(error.response.body.message, "The following fields cannot be updated: appointmentId.");
    }
});


/**
 * Tests unsuccessful modification of an appointment - Attempt to modify clientId [UNHAPPY PATH].
 */
test("editServiceAppointment - Attempt to modify clientId should fail", async (t) => {
    try {
        const appointmentId = 1;

        const requestBody = {
        appointmentId: 1,
        clientId: 10, // Trying to change clientId
        serviceId: 1,
        serviceDetails: "Updated details",
        status: "Confirmed",
        timeSlot: [
            {
            availability: true,
            date: "2024-12-21",
            startingTime: "14:00:00",
            },
        ],
      };
  
      const appointmentResponse = await t.context.got.put(`appointments/${appointmentId}`, {json: requestBody,});
      t.fail("Request should not succeed if attempting to modify clientId.");

    } catch (error) {
        t.is(error.response.statusCode, 400, "Should return 400 Bad Request");
        t.is(error.response.body.message, "The following fields cannot be updated: clientId.");
    }
});

/**
 * Tests unsuccessful modification of an appointment - Attempt to modify serviceId [UNHAPPY PATH].
 */
test("editServiceAppointment - Attempt to modify serviceId should fail", async (t) => {
    try {
        const appointmentId = 1;

        const requestBody = {
        appointmentId: 1,
        clientId: 1, 
        serviceId: 3,  // Trying to change serviceId
        serviceDetails: "Updated details",
        status: "Confirmed",
        timeSlot: [
            {
            availability: true,
            date: "2024-12-21",
            startingTime: "14:00:00",
            },
        ],
      };
  
      const appointmentResponse = await t.context.got.put(`appointments/${appointmentId}`, {json: requestBody,});
      t.fail("Request should not succeed if attempting to modify serviceId.");

    } catch (error) {
        t.is(error.response.statusCode, 400, "Should return 400 Bad Request");
        t.is(error.response.body.message, "The following fields cannot be updated: serviceId.");
    }
});



/**
 * Tests unsuccessful modification of an appointment - Attempt to modify clientId, serviceId and appointmentId [UNHAPPY PATH].
 */
test("editServiceAppointment - Attempt to modify clientId, serviceId and appointmentId", async (t) => {
    try {
        const appointmentId = 1;

        const requestBody = {
        appointmentId: 2,  // Trying to change appointmentId
        clientId: 10, // Trying to change clientId
        serviceId: 15,  // Trying to change serviceId
        serviceDetails: "Updated details",
        status: "Confirmed",
        timeSlot: [
            {
            availability: true,
            date: "2024-12-21",
            startingTime: "14:00:00",
            },
        ],
      };
  
      const appointmentResponse = await t.context.got.put(`appointments/${appointmentId}`, {json: requestBody,});
      t.fail("Request should not succeed if attempting to modify non updatable fields.");

    } catch (error) {
        t.is(error.response.statusCode, 400, "Should return 400 Bad Request");
        t.is(error.response.body.message, "The following fields cannot be updated: appointmentId, clientId, serviceId.");
    }
});
  






