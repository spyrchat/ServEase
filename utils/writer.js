var ResponsePayload = function (code, payload) {
  this.code = code;
  this.payload = payload;
};

exports.respondWithCode = function (code, payload) {
  return new ResponsePayload(code, payload);
};

var writeJson = exports.writeJson = function (response, arg1, arg2) {
  if (arg1 && arg1 instanceof ResponsePayload) {
    writeJson(response, arg1.payload, arg1.code);
    return;
  }

  const { code, payload } = determineResponseComponents(arg1, arg2);
  sendResponse(response, code, payload);
};

function determineResponseComponents(arg1, arg2) {
  let code = arg2 && Number.isInteger(arg2) ? arg2 : arg1 && Number.isInteger(arg1) ? arg1 : 200;
  let payload = arg1 && !(arg1 instanceof ResponsePayload) ? arg1 : null;

  return { code, payload };
}

function sendResponse(response, code, payload) {
  if (typeof payload === 'object') {
    payload = JSON.stringify(payload, null, 2);
  }
  response.writeHead(code, { 'Content-Type': 'application/json' });
  response.end(payload);
}
