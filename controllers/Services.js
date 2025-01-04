'use strict';

// Import utility module for writing JSON responses
var utils = require('../utils/writer.js');
// Import Services service module for handling service-related business logic
var Services = require('../service/ServicesService');

// Function to create a new service
module.exports.createService = function createService(_, res, __, body) {
  // Call the createService method in the Services service with the provided body
  Services.createService(body)
    .then(function (response) {
      // If the operation is successful, write the response as JSON
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      // If an error occurs, write the error response as JSON
      utils.writeJson(res, response);
    });
};

// Function to delete an existing service
module.exports.deleteService = function deleteService(_, res, __, serviceId) {
  // Call the deleteService method in the Services service with the provided serviceId
  Services.deleteService(serviceId)
    .then(function (response) {
      // If the operation is successful, write the response as JSON
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      // If an error occurs, write the error response as JSON
      utils.writeJson(res, response);
    });
};

// Function to edit an existing service
module.exports.editService = function editService(_, res, __, body, serviceId) {
  // Call the editService method in the Services service with the provided body and serviceId
  Services.editService(body, serviceId)
    .then(function (response) {
      // If the operation is successful, write the response as JSON
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      // If an error occurs, write the error response as JSON
      utils.writeJson(res, response);
    });
};

// Function to retrieve details of a specific service
module.exports.getService = function getService(_, res, __, serviceId) {
  // Call the getService method in the Services service with the provided serviceId
  Services.getService(serviceId)
    .then(function (response) {
      // If the operation is successful, write the response as JSON
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      // If an error occurs, write the error response as JSON
      utils.writeJson(res, response);
    });
};

// Function to search for services based on various filters
module.exports.searchServices = function searchServices(_, res, __, search, typeFilter, locationFilter, ratingFilter) {
  // Call the searchServices method in the Services service with the provided search and filters
  Services.searchServices(search, typeFilter, locationFilter, ratingFilter)
    .then(function (response) {
      // If the operation is successful, write the response as JSON
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      // If an error occurs, write the error response as JSON
      utils.writeJson(res, response);
    });
};
