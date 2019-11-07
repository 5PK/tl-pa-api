export function success(body) {
  return buildResponse(200, body);
}

export function created(body) {
  return buildResponse(201, body);
}

export function failure(body) {
  return buildResponse(500, body);
}

export function notFound(body) {
  return buildResponse(400, body);
}

export function webtokenerror(body) {
  return buildResponse(403, body);
}

export function unauthorized(body) {
  return buildResponse(404, body);
}

function buildResponse(statusCode, body) {
  return {
    statusCode: statusCode,
    body: body
  };
}
