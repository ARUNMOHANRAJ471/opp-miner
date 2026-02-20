const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,PATCH,DELETE,OPTIONS,PUT',
  'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-User-Role',
};

/**
 * Wraps a Vercel serverless handler with CORS headers and OPTIONS preflight support.
 * @param {function} handler
 * @returns {function}
 */
export function withCors(handler) {
  return function (req, res) {
    // Set CORS headers on every response
    Object.entries(CORS_HEADERS).forEach(([key, value]) => {
      res.setHeader(key, value);
    });

    // Respond to OPTIONS preflight immediately
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }

    return handler(req, res);
  };
}

