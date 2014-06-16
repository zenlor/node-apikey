/**
 * Simple API Key authentication middleware
 */
module.exports = apikey;

/**
 * Auth Middleware
 */
function apikey (fn, realm) {
  realm = realm || 'api key';

  function apikey (req, res, next) {
    var key = findApi(req) || auth(req);

    if (! key)
      return unauthorized(res, realm);

    if (!! key.name)
      key = key.name;

    fn(key, function (err, doc) {
      if (!! err)
        return next(err);

      if (!! doc)
        return next();

      return unauthorized(res, realm);
    })
  }
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
};

/**
 * Looks for apikey inside readers and query
 * @api private
 */
function findApi (req) {
  return
     req.headers['x-apikey']
  || req.headers['apikey']
  || req.headers['x-api']
  || req.headers['api']
  || req.param('apikey') //FIXME: this only works using express.js
  || req.param('api')
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
  auth = auth.match(/^([^:]+):(.*)$/); // password can be empty
  if (!auth) return;

  return { name: auth[1], pass: auth[2] };
};
