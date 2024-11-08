'use strict';


/**
 * Create a personal account - client
 * A personal account is created
 *
 * body NewClient  (optional)
 * returns Client
 **/
exports.createClient = function(body) {
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
 * Delete a client
 * Delete a client by client id.
 *
 * clientId String ID of the client to delete
 * no response value expected for this operation
 **/
exports.deleteClient = function(clientId) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Edit a client
 * FR-4 The client must be able to edit his personal information
 *
 * body Client  (optional)
 * clientId Integer The client's id
 * returns Client
 **/
exports.editClient = function(body,clientId) {
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
 * Get a client
 * FR-4 The client must be able to edit his personal information
 *
 * clientId Integer The client's id
 * returns Client
 **/
exports.getClient = function(clientId) {
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

