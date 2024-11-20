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
      // Validate 'clientId'
      if (
        body.clientId === undefined ||
        body.clientId === null ||
        typeof body.clientId !== "number" ||
        !Number.isInteger(body.clientId) ||
        body.clientId <= 0
      ) {
        return reject(
          respondWithCode(400, {
            message: "'clientId' must be a positive integer.",
          })
        );
      }

      // Validate 'serviceId'
      if (
        body.serviceId === undefined ||
        body.serviceId === null ||
        typeof body.serviceId !== "number" ||
        !Number.isInteger(body.serviceId) ||
        body.serviceId <= 0
      ) {
        return reject(
          respondWithCode(400, {
            message: "'serviceId' must be a positive integer.",
          })
        );
      }

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

      // Validate 'timeSlot' if provided
      if (body.timeSlot !== undefined) {
        if (!Array.isArray(body.timeSlot) || body.timeSlot.length === 0) {
          return reject(
            respondWithCode(400, {
              message: "'timeSlot' must be a non-empty array.",
            })
          );
        }
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
      // Validate appointmentId
      if (
        appointmentId === undefined ||
        appointmentId === null ||
        typeof appointmentId !== "number" ||
        !Number.isInteger(appointmentId) ||
        appointmentId <= 0
      ) {
        return reject(
          respondWithCode(400, {
            message: "Invalid 'appointmentId'. It must be a positive integer.",
          })
        );
      }

      // Validate that body is provided
      if (!body) {
        return reject(
          respondWithCode(400, {
            message: "Invalid appointment data. 'body' is required.",
          })
        );
      }

      // Validate 'timeSlot' if provided
      if (body.timeSlot !== undefined) {
        if (!Array.isArray(body.timeSlot) || body.timeSlot.length === 0) {
          return reject(
            respondWithCode(400, {
              message: "'timeSlot' must be a non-empty array.",
            })
          );
        }
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
      // Validate appointmentId
      if (
        appointmentId === undefined ||
        appointmentId === null ||
        typeof appointmentId !== "number" ||
        !Number.isInteger(appointmentId) ||
        appointmentId <= 0
      ) {
        return reject(
          respondWithCode(400, {
            message: "Invalid 'appointmentId'. It must be a positive integer.",
          })
        );
      }

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
      // Validate 'clientId'
      if (
        body.clientId === undefined ||
        body.clientId === null ||
        typeof body.clientId !== "number" ||
        !Number.isInteger(body.clientId) ||
        body.clientId <= 0
      ) {
        return reject(
          respondWithCode(400, {
            message: "'clientId' must be a positive integer.",
          })
        );
      }

      // Optionally, check if client exists
      const client = getClientById(clientId);

      if (!client) {
        return reject(
          respondWithCode(404, {
            message: `No client found with clientId: ${clientId}`,
          })
        );
      }

      // Validate 'serviceId'
      if (
        body.serviceId === undefined ||
        body.serviceId === null ||
        typeof body.serviceId !== "number" ||
        !Number.isInteger(body.serviceId) ||
        body.serviceId <= 0
      ) {
        return reject(
          respondWithCode(400, {
            message: "'serviceId' must be a positive integer.",
          })
        );
      }

      // Optionally, check if service exists
      const service = getServiceById(serviceId);
      if (!service) {
        return reject(
          respondWithCode(404, {
            message: `No service found with serviceId: ${serviceId}`,
          })
        );
      }

      // Search for appointments based on provided filters
      const results = searchAppointments(clientId, serviceId); // Implement this function

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
