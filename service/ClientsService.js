"use strict";

const { respondWithCode } = require("../utils/writer");

/**
 * Create a personal account - client
 * A personal account is created
 *
 * body NewClient  (optional)
 * returns Client
 **/
exports.createClient = function (body) {
  return new Promise(function (resolve, reject) {
    try {
      // Check if body exists and has the required properties
      if (
        body.userType !== "client" 
      ) {
        return reject(
          respondWithCode(400, {
            message:
              "Invalid client data. 'userType' must be 'client'.",
          })
        );
      }

      const personalInfo = body.personalInfo;

      // Required fields
      const requiredFields = [
        "address",
        "city",
        "country",
        "email",
        "country",
        "firstName",
        "lastName",
        "password",
        "phone",
        "postalCode"
      ];

      // Validate required fields
      const missingFields = requiredFields.filter(
        (field) => !personalInfo[field]
      );

      if (missingFields.length > 0) {
        return reject(
          respondWithCode(422, {
            message: `Missing required fields: ${missingFields.join(", ")}`,
          })
        );
      }

      // Email must contain '@'
      if (!personalInfo.email.includes("@")) {
        return reject(
          respondWithCode(422, {
            message: "Invalid email format.",
          })
        );
      }

      // Phone number must not exceed 10 characters
      if (personalInfo.phone.length > 10) {
        return reject(
          respondWithCode(400, {
            message: "Phone number cannot exceed 10 characters.",
          })
        );
      }

      // Add clientId
      const newClient = {
        clientId: Math.floor(Math.random() * 1000) + 1,
        ...body,
      };

      // Do not include password in the response
      if (newClient.personalInfo) {
        delete newClient.personalInfo.password;
      }

      // Return the created client
      resolve(newClient);
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
 * Delete a client
 * Delete a client by client id.
 *
 * clientId String ID of the client to delete
 * no response value expected for this operation
 **/
exports.deleteClient = function (clientId) {
  return new Promise(function (resolve, reject) {
    resolve();
  });
};

/**
 * Edit a client
 * FR-4 The client must be able to edit his personal information
 *
 * body Client  (optional)
 * clientId Integer The client's id
 * returns Client
 **/
exports.editClient = function (body, clientId) {
  return new Promise(function (resolve, reject) {
    var examples = {};
    examples["application/json"] = "";
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
};

/**
 * Get a client
 * FR-4 The client must be able to edit his personal information
 *
 * clientId Integer The client's id
 * returns Client
 **/
exports.getClient = function (clientId) {
  return new Promise(function (resolve, reject) {
    var examples = {};
    examples["application/json"] = "";
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
};
