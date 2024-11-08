'use strict';

var utils = require('../utils/writer.js');
var Appointments = require('../service/AppointmentsService');

module.exports.createAppointment = function createAppointment (req, res, next, body) {
  Appointments.createAppointment(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.editServiceAppointment = function editServiceAppointment (req, res, next, body, appointmentId) {
  Appointments.editServiceAppointment(body, appointmentId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getAppointment = function getAppointment (req, res, next, appointmentId) {
  Appointments.getAppointment(appointmentId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getClientAppointments = function getClientAppointments (req, res, next, clientId, serviceId) {
  Appointments.getClientAppointments(clientId, serviceId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
