const jwt = require('jsonwebtoken');

async function verifyToken(req, res, next) {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    return res.status(401).json({
      status_code: 401,
      type: "error",
      message: "[Header] Bạn chưa gán quyền truy cập",
    });
  }

  const token = authorizationHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, "jwt-secret-key");
    req.user = decoded; // Attach user payload (with roles) to the request object
    next();
  } catch (err) {
    console.error(err);

    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        status_code: 401,
        type: "error",
        message: "Token đã ngủm củ tỏi",
      });
    }

    return res.status(401).json({
      status_code: 401,
      type: "error",
      message: "Token không hợp lệ",
    });
  }
}

// Middleware to verify required roles
function verifyRole(requiredRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(403).json({
        status_code: 403,
        type: "error",
        message: "Người dùng chưa đăng nhập",
      });
    }

    const userRole = req.user.role;

    if (!requiredRoles.includes(userRole)) {
      return res.status(403).json({
        status_code: 403,
        type: "error",
        message: "Người dùng chưa được cấp quyền truy cập",
      });
    }

    next();
  };
}

module.exports = { verifyToken, verifyRole };
