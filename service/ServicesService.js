"use strict";
const { respondWithCode } = require("../utils/writer");
let services = [
  {
    serviceId: 1,
    userType: "service",
    serviceType: "Plumbing",
    description: "Expert plumbing services.",
    city: "Los Angeles",
    address: "456 Elm Street",
    country: "USA",
    postalCode: 90001,
    email: "plumbing.services@example.com",
    phone: "9876543210",
    rating: 4.5,
    serviceImg: "binaryImageData",
    availableTimeSlots: [
      {
        availability: true,
        date: "2023-12-01",
        startingTime: "09:00:00",
      },
    ],
  },
  {
    serviceId: 2,
    userType: "service",
    serviceType: "Electrician",
    description: "Professional electrical services for homes and offices.",
    city: "New York",
    address: "123 Maple Avenue",
    country: "USA",
    postalCode: 10001,
    email: "electrician.pro@example.com",
    phone: "1234567890",
    rating: 4.7,
    serviceImg: "binaryImageData",
    availableTimeSlots: [
      {
        availability: true,
        date: "2023-12-02",
        startingTime: "10:00:00",
      },
    ],
  },
  {
    serviceId: 3,
    userType: "service",
    serviceType: "Cleaning",
    description: "Reliable and affordable cleaning services.",
    city: "Chicago",
    address: "789 Oak Lane",
    country: "USA",
    postalCode: 60601,
    email: "cleaning.services@example.com",
    phone: "1122334455",
    rating: 4.3,
    serviceImg: "binaryImageData",
    availableTimeSlots: [
      {
        availability: true,
        date: "2023-12-03",
        startingTime: "11:00:00",
      },
    ],
  },
];

/**
 * Create a professional account - service
 * A professional account is created
 *
 * body NewService  (optional)
 * returns Service
 **/
exports.createService = function (body) {
  return new Promise(function (resolve, reject) {
    try {
      if (!body || body.userType !== "service") {
        return reject(
          respondWithCode(400, {
            message:
              "Invalid service data. 'userType' must be 'service' is required.",
          })
        );
      }

      // Check if body exists and has the required properties
      const requiredFields = [
        "userType",
        "serviceType",
        "description",
        "city",
        "address",
        "country",
        "postalCode",
        "email",
        "phone",
        "rating",
        "serviceImg",
        "availableTimeSlots",
      ];

      // Validate required fields
      for (const field of requiredFields) {
        if (
          body[field] === undefined ||
          body[field] === null ||
          body[field] === ""
        ) {
          return reject(
            respondWithCode(400, {
              message: `Invalid service data. '${field}' is required.`,
            })
          );
        }
      }

      // Validate 'description' length (maximum 300 characters)
      if (body.description.length > 300) {
        return reject(
          respondWithCode(400, {
            message: "Description cannot exceed 300 characters.",
          })
        );
      }

      // Validate 'phone' length (maximum 10 characters)
      if (body.phone.length > 10) {
        return reject(
          respondWithCode(400, {
            message: "Phone number cannot exceed 10 characters.",
          })
        );
      }

      // Validate 'email' format (must contain '@')
      if (!body.email.includes("@")) {
        return reject(
          respondWithCode(400, {
            message: "Invalid email format.",
          })
        );
      }

      // Validate 'rating' is a number between 1 and 5
      if (
        typeof body.rating !== "number" ||
        body.rating < 1 ||
        body.rating > 5
      ) {
        return reject(
          respondWithCode(400, {
            message: "Rating must be a number between 1 and 5.",
          })
        );
      }

      const newService = {
        serviceId: Math.floor(Math.random() * 1000) + 1,
        ...body,
      };

      // Return the created service
      resolve(newService);
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
 * Get a service
 * FR-5 The client must be able to access a service's information, FR-9 The professional must be able to edit his service's information
 *
 * serviceId Integer The service's id
 * returns Service
 **/
exports.getService = function (serviceId) {
  return new Promise(function (resolve, reject) {
    try {
      // Validate that serviceId is provided and is a valid integer
      if (
        serviceId === undefined ||
        serviceId === null ||
        isNaN(serviceId) ||
        parseInt(serviceId) <= 0
      ) {
        return reject(
          respondWithCode(400, {
            message: "Invalid 'serviceId'. It must be a positive integer.",
          })
        );
      }

      const service = services.find(
        (service) => service.serviceId === serviceId
      );

      if (!service) {
        return reject(
          respondWithCode(404, {
            message: `No service found with serviceId: ${id}.`,
          })
        );
      }

      const serviceResponse = { ...service };

      // Return the service data
      resolve(serviceResponse);
    } catch (error) {
      reject(
        respondWithCode(500, {
          message: "Internal Server Error",
        })
      );
    }
  });
};

/*** Edit a service
 * FR-9 The professional must be able to edit his service's information
 *
 * body Service  (optional)
 * serviceId Integer The service's id
 * returns Service
 **/
exports.editService = function (body, serviceId) {
  return new Promise(function (resolve, reject) {
    try {
      // Validate that serviceId is provided and is a valid integer
      if (serviceId <= 0) {
        return reject(
          respondWithCode(400, {
            message: "'serviceId' must be a positive integer.",
          })
        );
      }
      if (serviceId !== body.serviceId) {
        return reject(
          respondWithCode(400, {
            message: "'serviceId' in path must match serviceId in body.",
          })
        );
      }

      // Check if body exists and has the required properties
      const requiredFields = [
        "userType",
        "serviceType",
        "description",
        "city",
        "address",
        "country",
        "postalCode",
        "email",
        "phone",
        "rating",
        "serviceImg",
        "availableTimeSlots",
      ];

      // Validate required fields
      const missingFields = requiredFields.filter((field) => !body[field]);

      if (missingFields.length > 0) {
        return reject(
          respondWithCode(422, {
            message: `Missing required fields: ${missingFields.join(", ")}`,
          })
        );
      }

      const service = services.find(
        (service) => service.serviceId === serviceId
      );

      // Service not found
      if (!service) {
        return reject(
          respondWithCode(404, {
            message: `No service found with serviceId: ${serviceId}`,
          })
        );
      }

      // List of fields that can be updated
      const updatableFields = [
        "serviceType",
        "description",
        "city",
        "address",
        "country",
        "postalCode",
        "availableTimeSlots",
        "phone",
        "serviceImg",
      ];

      // Validate and update each field
      for (const field of updatableFields) {
        if (body[field] !== undefined) {
          switch (field) {
            case "description":
              if (body.description.length > 300) {
                return reject(
                  respondWithCode(400, {
                    message: "Description cannot exceed 300 characters.",
                  })
                );
              }
              break;
            case "phone":
              if (body.phone.length > 10) {
                return reject(
                  respondWithCode(400, {
                    message: "Phone number cannot exceed 10 characters.",
                  })
                );
              }
              break;
          }
          // Update the field
          service[field] = body[field];
        }
      }

      // Return the updated service
      resolve(service);
    } catch (error) {
      reject(respondWithCode(500, {message: "Internal Server Error",}));
    }
  });
};

/**
 * Delete a service.
 * Delete a service by service id.
 *
 * serviceId Integer ID of the service to delete
 * no response value expected for this operation
 **/
exports.deleteService = function (serviceId) {
  return new Promise(function (resolve, reject) {
    try {
      // Validate that serviceId is provided and is a valid integer
      if (serviceId <= 0) {
        return reject(
          respondWithCode(400, {
            message: "'serviceId' must be a positive integer.",
          })
        );
      }
      const service = services.find(
        (service) => service.serviceId === serviceId
      );

      if (service) {
        // Successful deletion
        resolve();
      } else {
        // Service not found
        return reject(
          respondWithCode(404, {
            message: `No service found with serviceId: ${serviceId}`,
          })
        );
      }
    } catch (error) {
      reject(respondWithCode(500, {message: "Internal Server Error",}));
    }
  });
};

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

exports.searchServices = function (
  search,
  typeFilter,
  locationFilter,
  ratingFilter
) {
  return new Promise(function (resolve, reject) {
    try {
      const filters = {};

      // Validate and assign 'search' filter
      if (search !== undefined) {
        if (typeof search !== "string" || search.trim() === "") {
          {
            return reject(
              respondWithCode(400, {
                message: `Invalid 'search'. It must be a non-empty string.`,
              })
            );
          }
        }
        filters.search = search.trim();
      }

      // Validate and assign 'typeFilter'
      if (typeFilter !== undefined) {
        if (typeof typeFilter !== "string" || typeFilter.trim() === "") {
          return reject(
            respondWithCode(400, {
              message: `Invalid 'typeFilter'. It must be a non-empty string.`,
            })
          );
        }

        filters.typeFilter = typeFilter.trim();
      }

      // Validate and assign 'locationFilter'
      if (locationFilter !== undefined) {
        if (
          typeof locationFilter !== "string" ||
          locationFilter.trim() === ""
        ) {
          return reject(
            respondWithCode(400, {
              message:
                "Invalid 'locationFilter'. It must be a non-empty string.",
            })
          );
        }
        filters.locationFilter = locationFilter.trim();
      }

      // Validate and assign 'ratingFilter'
      if (ratingFilter !== undefined) {
        if (
          typeof ratingFilter !== "number" ||
          !Number.isInteger(ratingFilter) ||
          ratingFilter < 1 ||
          ratingFilter > 5
        ) {
          return reject(
            respondWithCode(400, {
              message:
                "Invalid 'ratingFilter'. It must be an integer between 1 and 5.",
            })
          );
        }
        filters.ratingFilter = ratingFilter;
      }

      // Selecting random service objects for illustration purposes
      const results = services
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.random() % 2);

      if (results.length > 0) {
        // Found matching services
        resolve(results);
      } else {
        resolve([]);
      }
    } catch (error) {
      reject({
        statusCode: 500,
        message: "Internal Server Error",
      });
    }
  });
};
