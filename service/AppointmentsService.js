"use strict";

const { respondWithCode } = require("../utils/writer");

let clients = [{ clientId: 1 }, { clientId: 2 }, { clientId: 3 }];

let services = [{ serviceId: 1 }, { serviceId: 2 }, { serviceId: 3 }];

let appointments = [
  {
    appointmentId: 1,
    clientId: 1,
    serviceId: 1,
    serviceDetails: "Need to fix my fridge",
    status: "Confirmation Pending",
    timeSlot: [
      {
        availability: true,
        date: "2024-12-20",
        startingTime: "15:00:00",
      },
    ],
  },
  {
    appointmentId: 2,
    clientId: 3,
    serviceId: 2,
    serviceDetails: "Need to check my health, I am sick",
    status: "Confirmation Pending",
    timeSlot: [
      {
        availability: true,
        date: "2024-12-20",
        startingTime: "18:00:00",
      },
    ],
  },
  {
    appointmentId: 3,
    clientId: 2,
    serviceId: 2,
    serviceDetails: "Need to check my son's health",
    status: "Confirmation Pending",
    timeSlot: [
      {
        availability: true,
        date: "2024-12-20",
        startingTime: "19:00:00",
      },
    ],
  },
];

/**
 * Create an appointment
 * FR-3 The client must be able to apply for an appointment at a service
 *
 * body NewAppointment  (optional)
 * returns Appointment
 **/
exports.createAppointment = function (body) {
  return new Promise(function (resolve, reject) {
    try {

      // Check if client exists
      const client = clients.find(
        (client) => client.clientId === body.clientId
      );

      // If no client found
      if (!client) {
        return reject(
          respondWithCode(404, {
            message: `No client found with clientId: ${body.clientId}`,
          })
        );
      }

      // Check if service exists
      const service = services.find(
        (service) => service.serviceId === body.serviceId
      );

      // If no service found
      if (!service) {
        return reject(
          respondWithCode(404, {
            message: `No service found with serviceId: ${body.serviceId}`,
          })
        );
      }

      // Simulate new appointment creation
      const newAppointment = {
        appointmentId: Math.floor(Math.random() * 1000) + 1,
        ...body,
      };

      // Return the created appointment
      resolve(newAppointment);
    } catch (error) {
      reject(
        respondWithCode(500, {
          message: "Internal Server Error",
        })
      );
    }
  });
};

/**
 * Edit an appointment
 * FR-10 The professional must be able to manage his appointment applications, FR-7 The client must be able to cancel his appointment
 *
 * body Appointment  (optional)
 * appointmentId Integer The appointment's id
 * returns Appointment
 **/
exports.editServiceAppointment = function (body, appointmentId) {
  return new Promise(function (resolve, reject) {
    try {
      // Validate that body is provided
      if (!body) {
        return reject(
          respondWithCode(400, {
            message: "Invalid appointment data. 'body' is required.",
          })
        );
      }

      // Fetch the existing appointment
      const appointment = appointments.find(
        (appointment) => appointment.appointmentId === appointmentId
      );

      // If no appointment found
      if (!appointment) {
        return reject(
          respondWithCode(404, {
            message: `No appointment found with appointmentId: ${appointmentId}`,
          })
        );
      }

      // Updatable fields
      const updatableFields = ["serviceDetails", "status", "timeSlot"];

      // Update fields if provided
      for (const field of updatableFields) {
        if (body[field] !== undefined) {
          appointment[field] = body[field];
        }
      }

      // Simulate appointment update
      const appointmentResponse = { ...appointment };

      // Return the updated appointment
      resolve(appointmentResponse);
    } catch (error) {
      reject(
        respondWithCode(500, {
          message: "Internal Server Error",
        })
      );
    }
  });
};

/**
 * Get an appointment by Id
 * No matching FR
 *
 * appointmentId Integer The appointment's id
 * returns Appointment
 **/
exports.getAppointment = function (appointmentId) {
  return new Promise(function (resolve, reject) {
    try {
      // Find appointment by appointment id
      const appointment = appointments.find(
        (appointment) => appointment.appointmentId === appointmentId
      );

      // If appointment not found
      if (!appointment) {
        return reject(
          respondWithCode(404, {
            message: `No appointment found with appointmentId: ${appointmentId}`,
          })
        );
      }

      // Return appointment
      resolve(appointment);
    } catch (error) {
      reject(
        respondWithCode(500, {
          message: "Internal Server Error",
        })
      );
    }
  });
};

/**
 * Get the appointments of a client or a service
 * FR-8 The client must be able to view his appointments, FR-10 The professional must be able to manage his appointment applications
 *
 * clientId Integer The client's id (optional)
 * serviceId Integer The service's id (optional)
 * returns List
 **/
exports.getClientAppointments = function (clientId, serviceId) {
  return new Promise(function (resolve, reject) {
    try {
      var results = appointments;

      // Search for appointments based on provided filters
      if (clientId !== null || clientId !== undefined) {
        results = results.find(
          (appointment) => appointment.clientId === clientId
        );
      }
      if (serviceId !== null || serviceId !== undefined) {
        results = results.find(
          (appointment) => appointment.serviceId === serviceId
        );
      }

      if (results.length > 0) {
        resolve(results);
      } else {
        resolve([]);
      }
    } catch (error) {
      reject(
        respondWithCode(500, {
          message: "Internal Server Error",
        })
      );
    }
  });
};
