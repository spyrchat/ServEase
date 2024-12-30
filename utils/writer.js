class ResponsePayload {
  constructor(code, payload) {
    this.code = code;
    this.payload = payload;
  }
}

exports.respondWithCode = (code, payload) => new ResponsePayload(code, payload);

exports.writeJson = (response, arg1, arg2) => {
  if (arg1 instanceof ResponsePayload) {
    return exports.writeJson(response, arg1.payload, arg1.code);
  }

  let code = arg2 && Number.isInteger(arg2) ? arg2 : (arg1 && Number.isInteger(arg1) ? arg1 : 200);
  const payload = arg1 ? (typeof arg1 === 'object' ? JSON.stringify(arg1, null, 2) : arg1) : null;

  response.writeHead(code, { 'Content-Type': 'application/json' });
  response.end(payload);
};
