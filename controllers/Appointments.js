'use strict';

// Importing utility functions and the AppointmentsService for handling appointment logic
var utils = require('../utils/writer.js');
var Appointments = require('../service/AppointmentsService');

// Function to handle creating a new appointment
module.exports.createAppointment = function createAppointment (__, res, _, body) {
  // Call the service method to create an appointment and pass the request body
  Appointments.createAppointment(body)
    .then(function (response) {
      // If successful, respond with the data returned by the service
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      // If there's an error, respond with the error message
      utils.writeJson(res, response);
    });
};

// Function to handle editing an existing service appointment
module.exports.editServiceAppointment = function editServiceAppointment (__, res, _, body, appointmentId) {
  // Call the service method to edit the appointment, passing the updated data and the appointment ID
  Appointments.editServiceAppointment(body, appointmentId)
    .then(function (response) {
      // If successful, respond with the updated data
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      // If there's an error, respond with the error message
      utils.writeJson(res, response);
    });
};

// Function to retrieve details of a specific appointment by its ID
module.exports.getAppointment = function getAppointment (__, res, _, appointmentId) {
  // Call the service method to get the appointment details by ID
  Appointments.getAppointment(appointmentId)
    .then(function (response) {
      // If successful, respond with the appointment details
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      // If there's an error, respond with the error message
      utils.writeJson(res, response);
    });
};

// Function to retrieve all appointments for a specific client and service
module.exports.getClientAppointments = function getClientAppointments (__, res, _, clientId, serviceId) {
  // Call the service method to get appointments for the client and service
  Appointments.getClientAppointments(clientId, serviceId)
    .then(function (response) {
      // If successful, respond with the list of appointments
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      // If there's an error, respond with the error message
      utils.writeJson(res, response);
    });
};
