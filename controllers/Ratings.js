'use strict';

var utils = require('../utils/writer.js');
var Ratings = require('../service/RatingsService');

module.exports.createRating = function createRating (req, res, next, body, serviceId) {
  Ratings.createRating(body, serviceId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getServiceRatings = function getServiceRatings (req, res, next, serviceId) {
  Ratings.getServiceRatings(serviceId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
