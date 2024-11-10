const jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticate = (req, res, next) => {
    const token = req.cookies.user_auth;
    if (!token) {
        return res.status(401).json({ message: "Not Authenticated" });
    }

    jwt.verify(token, process.env.JWT_SECRECT_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Token is invalid" });
        }
        req.user = decoded; // Store decoded user info for use in route
        next();
    });
};

module.exports = authenticate;
