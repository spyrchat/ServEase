// Constructor function to create a ResponsePayload object
// Represents an HTTP response payload with a code and payload data
var ResponsePayload = function(code, payload) {
  this.code = code;        // HTTP status code
  this.payload = payload;  // Response data
}

// Function to create a new ResponsePayload object
// @param {number} code - HTTP status code
// @param {any} payload - Response payload (can be an object, string, etc.)
// @returns {ResponsePayload} - A new ResponsePayload instance
exports.respondWithCode = function(code, payload) {
  return new ResponsePayload(code, payload);
}

// Function to write a JSON response to the HTTP response object
// @param {Object} response - HTTP response object
// @param {any} arg1 - Either the response payload or a ResponsePayload instance
// @param {number} [arg2] - Optional HTTP status code
var writeJson = exports.writeJson = function(response, arg1, arg2) {
  var code;    // Variable to hold the HTTP status code
  var payload; // Variable to hold the response payload

  // Check if arg1 is a ResponsePayload instance
  if(arg1 && arg1 instanceof ResponsePayload) {
    // If arg1 is a ResponsePayload, extract its payload and code
    writeJson(response, arg1.payload, arg1.code);
    return;
  }

  // Determine the HTTP status code (code) from arg2 or arg1
  if(arg2 && Number.isInteger(arg2)) {
    code = arg2;
  } else {
    if(arg1 && Number.isInteger(arg1)) {
      code = arg1;
    }
  }

  // Assign the payload based on the provided arguments
  if(code && arg1) {
    payload = arg1;
  } else if(arg1) {
    payload = arg1;
  }

  // If no HTTP status code is provided, default to 200 (OK)
  if(!code) {
    code = 200;
  }

  // If the payload is an object, convert it to a pretty-printed JSON string
  if(typeof payload === 'object') {
    payload = JSON.stringify(payload, null, 2);
  }

  // Set the HTTP response header to indicate JSON content
  response.writeHead(code, {'Content-Type': 'application/json'});
  // Write the response payload to the HTTP response and end the connection
  response.end(payload);
}
