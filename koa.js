/**
 * Simple API Key authentication middleware
 */
module.exports = apikey;

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

/**
 * Looks for apikey inside readers and query
 * @api private
 */
function findApi (headers, query) {
  return headers['x-apikey']
  || headers['x-api-key']
  || headers['x-api']
  || headers['apikey']
  || headers['api']
  || query['api-key']
  || query['apikey']
  || query['api']
}

/**
 * Taken from [basic-auth](https://www.npmjs.org/package/basic-auth)
 *
 * modified to accept empty passwords
 */

/**
 * Parse the Authorization header field of `req`.
 *
 * @param {Request} req
 * @return {Object} with .name and .pass
 * @api public
 */
function auth (req) {
  req = req.req || req;

  var auth = req.headers.authorization;
  if (!auth) return;

  // malformed
  var parts = auth.split(' ');
  if ('basic' != parts[0].toLowerCase()) return;
  if (!parts[1]) return;
  auth = parts[1];

  // credentials
  auth = new Buffer(auth, 'base64').toString();
  auth = auth.match(/^([^:]+):?(.*)$/); // password can be empty
  if (!auth) return;

  return { name: auth[1], pass: auth[2] };
};
