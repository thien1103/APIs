const jwt = require('jsonwebtoken');

function verifyUser(req, res, next) {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ Error: "You are not Authenticated" });
        } else {
            jwt.verify(token, "jwt-secret-key", (err, decoded) => {
                if (err) {
                    if (err.name === 'TokenExpiredError') {
                        return res.status(401).json({ Error: "Token has expired" });
                    } else {
                        return res.status(401).json({ Error: "Token is invalid" });
                    }
                } else {
                    req.name = decoded.name;
                    req.phoneNumber = decoded.phoneNumber;
                    req.userId = decoded.userId;
                    next();
                }
            });
        }
    } catch (error) {
        console.error('Error checking token:', error);
        return res.status(500).json({ Error: "Internal server error" });
    }
}

module.exports = verifyUser;