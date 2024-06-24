const jwt = require('jsonwebtoken');
const { connection } = require('../configuration/dbConfig');

async function verifyToken(req, res, next) {
  const authorizationHeader = req.headers.authorization;

  //kiểm tra có token không
  if (!authorizationHeader) {
    return res.status(401).json({status_code: 401, type:"error", message:"[Unauthorized] Bạn không có quyền truy cập"});
  }

  // tách token khỏi header
  const token = authorizationHeader.split(' ')[1];

  try {
    //kiểm tra token
    const decoded = await jwt.verify(token, 'jwt-secret-key');

    // Kiểm tra xem token có trong danh sách đen không
    const rows = connection.query(
      'SELECT * FROM blacklisted_tokens WHERE token = ?',
      token
    );
    if (rows.length > 0) {
      return res.status(401).json({status_code: 401, type:"error", message:"Token đã bị vô hiệu hóa"});
    }

    // gắn biến đã decode vào payload
    req.user = decoded;
    next();
  } catch (err) {
    console.error(err);

    // Check token đã hết hạn chưa
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({status_code: 401, type:"error", message:"Token đã hết hạn"});
    }

    return res.status(401).json({status_code: 401, type:"error", message:"Token không hợp lệ"});
  }
}

module.exports = verifyToken;