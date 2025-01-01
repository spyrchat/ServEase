'use strict';

// Importing utility functions and the ClientsService for handling client-related logic
var utils = require('../utils/writer.js');
var Clients = require('../service/ClientsService');

// Function to handle creating a new client
module.exports.createClient = function createClient (req, res, next, body) {
  // Call the service method to create a client, passing the request body
  Clients.createClient(body)
    .then(function (response) {
      // If successful, respond with the data returned by the service
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      // If there's an error, respond with the error message
      utils.writeJson(res, response);
    });
};

// Function to handle deleting a client by their clientId
module.exports.deleteClient = function deleteClient (req, res, next, clientId) {
  // Call the service method to delete the client by clientId
  Clients.deleteClient(clientId)
    .then(function (response) {
      // If successful, respond with the result of the deletion
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      // If there's an error, respond with the error message
      utils.writeJson(res, response);
    });
};

// Function to handle editing an existing client based on their clientId
module.exports.editClient = function editClient (req, res, next, body, clientId) {
  // Call the service method to edit the client, passing the updated data and the clientId
  Clients.editClient(body, clientId)
    .then(function (response) {
      // If successful, respond with the updated client information
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      // If there's an error, respond with the error message
      utils.writeJson(res, response);
    });
};

// Function to retrieve details of a specific client by their clientId
module.exports.getClient = function getClient (req, res, next, clientId) {
  // Call the service method to get the client details by clientId
  Clients.getClient(clientId)
    .then(function (response) {
      // If successful, respond with the client details
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      // If there's an error, respond with the error message
      utils.writeJson(res, response);
    });
};
