function success(msg, data) {
  return buildResponse(200, msg, data);
}

function created(body) {
  return buildResponse(201, body, msg);
}

function failure(msg, data) {
  return buildResponse(500, msg, data);
}

function notFound(body) {
  return buildResponse(400, body, msg);
}

function webtokenerror(body) {
  return buildResponse(403, body, msg);
}

function unauthorized(msg, data) {
  return buildResponse(404, msg, data);
}

function buildResponse(statusCode, msg, data) {
  return {
    statusCode: statusCode,
    msg: msg,
    data: data
  };
}

exports.success = success;
exports.created = created;
exports.failure = failure;
exports.notFound = notFound;
exports.webtokenerror = webtokenerror;
exports.unauthorized = unauthorized;
