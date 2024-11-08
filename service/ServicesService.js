'use strict';


/**
 * Create a professional account - service
 * A professional account is created
 *
 * body NewService  (optional)
 * returns Service
 **/
exports.createService = function(body) {
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
 * Delete a service.
 * Delete a service by service id.
 *
 * serviceId String ID of the service to delete
 * no response value expected for this operation
 **/
exports.deleteService = function(serviceId) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Edit a service
 * FR-9 The professional must be able to edit his service's information
 *
 * body Service  (optional)
 * serviceId Integer The service's id
 * returns Service
 **/
exports.editService = function(body,serviceId) {
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
 * Get a service
 * FR-5 The client must be able to access a service's information, FR-9 The professional must be able to edit his service's information
 *
 * serviceId Integer The service's id
 * returns Service
 **/
exports.getService = function(serviceId) {
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
 * Search for services by name and filters
 * FR-1 The guest must be able to search for services, FR-2 The guest must be able to filter his search for services
 *
 * search String Name of the service to search for (optional)
 * typeFilter String Type of service to search by (optional)
 * locationFilter String Name of the city that the service is located in (optional)
 * ratingFilter Integer Minimum rating of the service to search for. (optional)
 * returns List
 **/
exports.searchServices = function(search,typeFilter,locationFilter,ratingFilter) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = [ "", "" ];
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

