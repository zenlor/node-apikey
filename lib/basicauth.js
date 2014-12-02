/**
 * Taken from [basic-auth](https://www.npmjs.org/package/basic-auth)
 *
 * modified to accept empty passwords
 */
module.exports = basicauth;
/**
 * Parse the Authorization header field of `req`.
 *
 * @param {Request} req   express request or koa context
 * @return {Object}       an object with name and pass fields
 * @api public
 */
function basicauth (req) {
  req = req.req || req;

  var auth = req.headers.authorization;
  if (!auth) return null;

  // malformed
  var parts = auth.split(' ');
  if ('basic' !== parts[0].toLowerCase()) return null;
  if (!parts[1]) return null;
  auth = parts[1];

  // credentials
  auth = new Buffer(auth, 'base64').toString();
  auth = auth.match(/^([^:]+):?(.*)$/); // password can be empty
  if (!auth) return null;

  return { name: auth[1], pass: auth[2] };
}

