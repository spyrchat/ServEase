'use strict';

const { respondWithCode } = require("../utils/writer");


/**
 * Create a personal account - client
 * A personal account is created
 *
 * body NewClient  (optional)
 * returns Client
 **/
exports.createClient = function(body) {
  return new Promise(function(resolve, reject) {
    // Check if required fields are present
    if (body.userType !== 'client') {
      return reject(respondWithCode(422, {message:"Invalid input: 'userType' must be 'client'"}) );
    }
    // Validate each field in personalInfo array
    const personalInfo = body.personalInfo[0];
    const requiredFields = ['address', 'city', 'country', 'email', 'firstName', 'lastName', 'password', 'phone', 'postalCode'];
    const missingFields = requiredFields.filter(field => !personalInfo[field]);

    if (missingFields.length > 0) {
      return reject(respondWithCode(422, {message:`Missing required fields: ${missingFields.join(', ')}`}) );
    }
    // Check field constraints
    if (personalInfo.phone.length > 10) {
      return reject(respondWithCode(422, {message:"Phone number must not exceed 10 characters."}) );
    }

    if (personalInfo.password.length < 8) {
      return reject(respondWithCode(422, {message:"Password must be at least 8 characters long."}) );
    }

    if (!personalInfo.email.includes('@')) {
      return reject(respondWithCode(422, {message:"Email must contain an '@' symbol."}) );
    }

    // Simulate client creation by creating a client object with an ID
    const newClient = {
      clientId: Math.floor(Math.random() * 1000) + 1, // Simulate a generated client ID
      userType: body.userType,
      personalInfo: body.personalInfo
    };

    // Resolve the promise with the complete new client object
    resolve(
      newClient
    );

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

