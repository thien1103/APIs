const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const authorizationHeader = req.headers.authorization;

  // Check if the Authorization header is present
  if (!authorizationHeader) {
    return res.status(401).json({ Error: '[Unauthorized] Bạn không có quyền truy cập' });
  }

  // Extract the token from the Authorization header
  const token = authorizationHeader.split(' ')[1];

  // Verify the token
  jwt.verify(token, 'jwt-secret-key', (err, decoded) => {
    if (err) {
      console.error(err);

      // Check if the error is due to an expired token
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ Error: 'Token đã hết hạn' });
      }

      return res.status(401).json({ Error: 'Token không hợp lệ' });
    }

    // Attach the decoded payload to the request object
    req.user = decoded;
    next();
  });
}

module.exports = verifyToken;