'use strict';

var utils = require('../utils/writer.js');
var Clients = require('../service/ClientsService');

module.exports.createClient = function createClient (req, res, next, body) {
  Clients.createClient(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.deleteClient = function deleteClient (req, res, next, clientId) {
  Clients.deleteClient(clientId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.editClient = function editClient (req, res, next, body, clientId) {
  Clients.editClient(body, clientId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getClient = function getClient (req, res, next, clientId) {
  Clients.getClient(clientId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
