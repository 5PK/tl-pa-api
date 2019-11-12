export function success(msg, data) {
  return buildResponse(200, msg, data);
}

export function created(body) {
  return buildResponse(201, body, msg);
}

export function failure(msg, data) {
  return buildResponse(500, msg, data);
}

export function notFound(body) {
  return buildResponse(400, body, msg);
}

export function webtokenerror(body) {
  return buildResponse(403, body, msg);
}

export function unauthorized(msg, data) {
  return buildResponse(404, msg, data);
}

function buildResponse(statusCode, msg, data) {
  return {
    statusCode: statusCode,
    msg: msg,
    data: data
  };
}
