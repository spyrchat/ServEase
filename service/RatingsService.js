"use strict";
const { respondWithCode } = require("../utils/writer");

// Example in-memory data store
const ratings = [
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
  },
];

let clients = [{ clientId: 1 }, { clientId: 2 }, { clientId: 3 }];

let services = [{ serviceId: 1 }, { serviceId: 2 }, { serviceId: 3 }];

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
      // Check if client exists
      const client = clients.find((client) => client.clientId === body.clientId);

      if (!client) {
        return reject(
          respondWithCode(404, {
            message: `No client found with clientId: ${body.clientId}`,
          })
        );
      }

      // Check if service exists
      const service = services.find(
        (service) => service.serviceId === serviceId
      );

      if (!service) {
        return reject(
          respondWithCode(404, {
            message: `No service found with serviceId: ${serviceId}`,
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
      reject(respondWithCode(500, {message: "Internal Server Error",}));
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
      // Check if service exists
      const service = services.find(
        (service) => service.serviceId === serviceId
      );

      if (!service) {
        return reject(
          respondWithCode(404, {
            message: `No service found with serviceId: ${serviceId}`,
          })
        );
      }

      // Retrieve ratings for the service
      const serviceRatings = ratings.filter(
        (ratings) => ratings.serviceId === serviceId
      );

      // If service ratings exists
      if (serviceRatings && serviceRatings.length > 0) {
        resolve(serviceRatings);
      } else {
        resolve({
          message: "No ratings yet for this service.",
          data: []
      });
      }
    } catch (error) {
      reject(respondWithCode(500, {message: "Internal Server Error",}));
    }
  });
};
