
module.exports = findApi;

/**
 * Looks for apikey inside readers and query
 *
 * @param {Object} headers  headers object
 * @param {Object} query    querystring object
 * @return {String}         the extracted api key
 * @api private
 */
function findApi (headers, query) {
  if (!headers) headers = {};
  if (!query) query = {};

  return headers['x-apikey']
  || headers['x-api-key']
  || headers['x-api']
  || headers['apikey']
  || headers['api']
  || query['api-key']
  || query['apikey']
  || query['api']
}
