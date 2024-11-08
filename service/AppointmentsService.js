'use strict';


/**
 * Create an appointment
 * FR-3 The client must be able to apply for an appointment at a service
 *
 * body NewAppointment  (optional)
 * returns Appointment
 **/
exports.createAppointment = function(body) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = "";
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Edit an appointment
 * FR-10 The professional must be able to manage his appointment applications, FR-7 The client must be able to cancel his appointment
 *
 * body Appointment  (optional)
 * appointmentId Integer The appointment's id
 * returns Appointment
 **/
exports.editServiceAppointment = function(body,appointmentId) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = "";
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Get an appointment by Id
 * No matching FR
 *
 * appointmentId Integer The appointment's id
 * returns Appointment
 **/
exports.getAppointment = function(appointmentId) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = "";
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Get the appointments of a client or a service
 * FR-8 The client must be able to view his appointments, FR-10 The professional must be able to manage his appointment applications
 *
 * clientId Integer The client's id (optional)
 * serviceId Integer The service's id (optional)
 * returns List
 **/
exports.getClientAppointments = function(clientId,serviceId) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = [ "", "" ];
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

