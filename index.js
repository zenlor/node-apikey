/**
 * Simple API Key authentication middleware
 */
module.exports = apikey;

/*
 * Modules
 */
var auth = require('./lib/basicauth');
var findApi = require('./lib/findapi');

/**
 * Auth Middleware
 *
 * @param {Function} fn   authentication function
 * @param {String} realm  realm string
 * @return {Function}     express middleware
 */
function apikey (fn, realm) {
  realm = realm || 'api key';

  return function (req, res, next) {
    var key = auth(req) || findApi(req.headers, req.query);
    if (! key)
      return unauthorized(res, realm);

    if (key.name)
      key = key.name;

    fn(key, function (err, result) {
      if (err)
        return next(err);

      if (result) {
        req.user = result;
        return next();
      }

      return unauthorized(res, realm);
    });
  };
}

/**
 * Respond with 401 "Unauthorized".
 *
 * @param {ServerResponse} res
 * @param {String} realm
 * @api private
 */

function unauthorized(res, realm) {
  res.statusCode = 401;
  res.setHeader('WWW-Authenticate', 'Basic realm="' + realm + '"');
  res.end('Unauthorized');
}

