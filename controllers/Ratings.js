'use strict';

// Import utility module for writing JSON responses
var utils = require('../utils/writer.js');
// Import Ratings service module for handling rating-related business logic
var Ratings = require('../service/RatingsService');

// Function to create a new rating for a service
module.exports.createRating = function createRating (req, res, next, body, serviceId) {
  // Call the createRating method in the Ratings service with the provided body and serviceId
  Ratings.createRating(body, serviceId)
    .then(function (response) {
      // If the operation is successful, write the response as JSON
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      // If an error occurs, write the error response as JSON
      utils.writeJson(res, response);
    });
};

// Function to retrieve all ratings for a specific service
module.exports.getServiceRatings = function getServiceRatings (req, res, next, serviceId) {
  // Call the getServiceRatings method in the Ratings service with the provided serviceId
  Ratings.getServiceRatings(serviceId)
    .then(function (response) {
      // If the operation is successful, write the response as JSON
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      // If an error occurs, write the error response as JSON
      utils.writeJson(res, response);
    });
};
