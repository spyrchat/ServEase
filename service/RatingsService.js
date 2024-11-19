"use strict";
const { respondWithCode } = require("../utils/writer");

// Example in-memory data store
let ratings = [
  {
    clientId: 1,
    serviceId: 1,
    stars: 4,
    date: "2022-08-05",
    review: "Very professional, I would recommend.",
  },
  {
    clientId: 2,
    serviceId: 1,
    stars: 5,
    date: "2021-06-13",
    review: "Very Good",
  },
  {
    clientId: 3,
    serviceId: 2,
    stars: 4,
    date: "2020-11-15",
    review: "Very professional.",
  },
];

let client = [{ clientId: 1 }, { clientId: 2 }, { clientId: 3 }];

let service = [{ serviceId: 1 }, { serviceId: 2 }, { serviceId: 3 }];

/**
 * Create a rating
 * FR-6 The client must be able to rate a service
 *
 * body Rating  (optional)
 * serviceId Integer The service's id
 * returns Rating
 **/
exports.createRating = function (body, serviceId) {
  return new Promise(function (resolve, reject) {
    try {
      // Validate 'serviceId'
      if (
        serviceId === undefined ||
        serviceId === null ||
        typeof serviceId !== "number" ||
        !Number.isInteger(serviceId) ||
        serviceId <= 0
      ) {
        return reject(
          respondWithCode(400, {
            message: "'serviceId' must be a positive integer.",
          })
        );
      }

      // Validate that 'clientId' is provided and is a valid integer
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

      // Validate 'stars'
      if (
        typeof body.stars !== "number" ||
        !Number.isInteger(body.stars) ||
        body.stars < 1 ||
        body.stars > 5
      ) {
        return reject(
          respondWithCode(400, {
            message: "'stars' must be an integer between 1 and 5.",
          })
        );
      }

      // Check if client exists
      const client = client.find((client) => client.clientId === body.clientId);

      if (!client) {
        return reject(
          respondWithCode(404, {
            message: "No client found with clientId: ${body.clientId}",
          })
        );
      }

      // Check if service exists
      const service = service.find(
        (service) => service.serviceId === serviceId
      );

      if (!service) {
        return reject(
          respondWithCode(404, {
            message: "No service found with serviceId: ${serviceId}",
          })
        );
      }

      // Create the created rating
      const newRating = {
        clientId: body.clientId,
        serviceId: serviceId,
        stars: body.stars,
        review: body.review ? body.review.trim() : undefined,
        date: new Date().toISOString().split("T")[0], // Default to today's date
      };

      // Return the created rating
      resolve(newRating);
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
 * Get the ratings of a service
 * FR-5 The client must be able to access a service's information, FR-9 The professional must be able to edit his service's information
 *
 * serviceId Integer The service's id
 * returns List
 **/
exports.getServiceRatings = function (serviceId) {
  return new Promise(function (resolve, reject) {
    try {
      // Validate 'serviceId'
      if (
        serviceId === undefined ||
        serviceId === null ||
        typeof serviceId !== "number" ||
        !Number.isInteger(serviceId) ||
        serviceId <= 0
      ) {
        return reject(
          respondWithCode(400, {
            message: "'serviceId' must be a positive integer.",
          })
        );
      }

      // Check if service exists
      const service = service.find(
        (service) => service.serviceId === serviceId
      );

      if (!service) {
        return reject(
          respondWithCode(404, {
            message: "No service found with serviceId: ${serviceId}",
          })
        );
      }

      // Retrieve ratings for the service
      const serviceRatings = ratings.find(
        (ratings) => ratings.serviceId === serviceId
      );

      // If service ratings exists
      if (serviceRatings && serviceRatings.length > 0) {
        resolve(serviceRatings);
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
