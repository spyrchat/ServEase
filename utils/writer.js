class ResponsePayload {
  constructor(code, payload) {
    this.code = code;
    this.payload = payload;
  }
}

exports.respondWithCode = (code, payload) => new ResponsePayload(code, payload);

exports.writeJson = (response, arg1, arg2) => {
  let code = 200; // Default to 200 if no code provided
  let payload;

  if (arg1 && arg1 instanceof ResponsePayload) {
    return exports.writeJson(response, arg1.payload, arg1.code);
  }

  if (arg2 && Number.isInteger(arg2)) {
    code = arg2;
  } else if (arg1 && Number.isInteger(arg1)) {
    code = arg1;
  }

  if (arg1) {
    payload = typeof arg1 === 'object' ? JSON.stringify(arg1, null, 2) : arg1;
  } else {
    payload = null;
  }

  response.writeHead(code, { 'Content-Type': 'application/json' });
  response.end(payload);
};