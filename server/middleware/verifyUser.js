const jwt = require('jsonwebtoken');

function verifyUser(req, res, next) {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.json({ Error: "You are not Authenticated" });
        } else {
            jwt.verify(token, "jwt-secret-key", (err, decoded) => {
                if (err) {
                    return res.json({ Error: "Token expired or invalid" });
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
        return res.json({ Error: "Internal server error" });
    }
}

module.exports = verifyUser;