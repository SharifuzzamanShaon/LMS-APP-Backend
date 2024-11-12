function error(msg = 'Something error occured', status = 500) {
  const e = new Error(msg)
  e.status = status
  return e;
}
function authorizationError() {
  const e = new Error();
  e.message = "unauthorized accesss";
  e.status = 401;
  return e;
}

module.exports = { error, authorizationError };

/**
 * function error(msg = 'Something error occured', status = 500) {
    const e = new Error(msg)
    e.status = status
    return e;
}
module.exports = error
 */
