'use strict';


/**
 * Create a rating
 * FR-6 The client must be able to rate a service
 *
 * body Rating  (optional)
 * serviceId Integer The service's id
 * returns Rating
 **/
exports.createRating = function(body,serviceId) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "date" : "2000-01-23",
  "clientId" : 6,
  "review" : "review",
  "stars" : 1,
  "serviceId" : 0
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Get the ratings of a service
 * FR-5 The client must be able to access a service's information, FR-9 The professional must be able to edit his service's information
 *
 * serviceId Integer The service's id
 * returns List
 **/
exports.getServiceRatings = function(serviceId) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = [ {
  "date" : "2000-01-23",
  "clientId" : 6,
  "review" : "review",
  "stars" : 1,
  "serviceId" : 0
}, {
  "date" : "2000-01-23",
  "clientId" : 6,
  "review" : "review",
  "stars" : 1,
  "serviceId" : 0
} ];
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

