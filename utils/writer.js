var ResponsePayload = function (code, payload) {
  // Constructor for creating a ResponsePayload object
  this.code = code;
  this.payload = payload;
};

exports.respondWithCode = function (code, payload) {
  // Utility function to create and return a ResponsePayload object
  return new ResponsePayload(code, payload);
};

var writeJson = exports.writeJson = function (response, arg1, arg2) {
  // Main function to write a JSON response
  // Handles special case where arg1 is an instance of ResponsePayload
  if (arg1 && arg1 instanceof ResponsePayload) {
    writeJson(response, arg1.payload, arg1.code);
    return;
  }

  // Determine the response code and payload
  const { code, payload } = determineResponseComponents(arg1, arg2);

  // Send the response
  sendResponse(response, code, payload);
};

function determineResponseComponents(arg1, arg2) {
  // Helper function to determine the response code and payload
  // Default response code is 200
  let code = arg2 && Number.isInteger(arg2) ? arg2 : arg1 && Number.isInteger(arg1) ? arg1 : 200;

  // Use arg1 as the payload if it is not an instance of ResponsePayload
  let payload = arg1 && !(arg1 instanceof ResponsePayload) ? arg1 : null;

  return { code, payload };
}

function sendResponse(response, code, payload) {
  // Helper function to send the response
  // If the payload is an object, convert it to a JSON string
  if (typeof payload === 'object') {
    payload = JSON.stringify(payload, null, 2);
  }

  // Write the response headers and end the response
  response.writeHead(code, { 'Content-Type': 'application/json' });
  response.end(payload);
}
