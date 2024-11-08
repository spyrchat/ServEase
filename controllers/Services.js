'use strict';

var utils = require('../utils/writer.js');
var Services = require('../service/ServicesService');

module.exports.createService = function createService (req, res, next, body) {
  Services.createService(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.deleteService = function deleteService (req, res, next, serviceId) {
  Services.deleteService(serviceId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.editService = function editService (req, res, next, body, serviceId) {
  Services.editService(body, serviceId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getService = function getService (req, res, next, serviceId) {
  Services.getService(serviceId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.searchServices = function searchServices (req, res, next, search, typeFilter, locationFilter, ratingFilter) {
  Services.searchServices(search, typeFilter, locationFilter, ratingFilter)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
