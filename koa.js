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
 */
function apikey (fn, realm) {
  realm = realm || 'api key';

  return function *(next) {
    var key = auth(this.request) || findApi(this.request.headers, this.request.query);

    if (! key)
      return unauthorized(this, key, realm);

    if (!! key.name)
      key = key.name;

    var results = yield fn(key)
    if (! results) {
      return unauthorized(this, key, realm);
    } else {
      this.user = results;
      yield next;
    }
  }
}

/**
 * Respond with 401 "Unauthorized".
 *
 * @param {ServerResponse} res
 * @param {String} realm
 * @api private
 */

function unauthorized(ctx, key, realm) {
  ctx.set('WWW-Authenticate', 'Basic realm="' + realm + '"');
  ctx.throw(401, 'access_denied', { key: key });
};
