const Users = require("../models/User");
const bcrypt = require('bcrypt');
const create_token = require("../utils/createJWT_Token");
const jwt = require("jsonwebtoken");
const MAX_AGE = 60 * 60 * 24; // Token expiration time (1 day)

// Get User
const get_user = async (req, res) => {
    const token = req.cookies.user_auth;
    // console.log(req.cookies.user_auth)
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRECT_KEY);
        // console.log(decoded);
         // You should have the decoded payload here, e.g., { username: "someUser" }
        // Proceed with the logic (e.g., fetch user from DB)
        const user = await Users.findOne({ username: decoded.user_id });
        res.status(200).json({ user });
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }



};


// Create User
const create_user = async (req, res) => {
    const { username, password } = req.body;
    
    try {
        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new Users({
            username,
            password: hashedPassword
        });

        // Save the user
        const user = await newUser.save();
        // console.log(user);

        // Generate token and set cookie
        const token = create_token(user.username, MAX_AGE);
        res.cookie("user_auth", token, {
            httpOnly: true,
            maxAge: MAX_AGE * 1000,
            sameSite: "Lax", // or "None" if testing on HTTPS
            path: "/" // ensure it's available to all routes
          });
        res.status(201).json({ message: "User created successfully", user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Authenticate User
const authenticate_user = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await Users.findOne({ username });
        if (!user) return res.status(404).json({ message: "Username not registered" });

        const validate = await bcrypt.compare(password, user.password);
        if (!validate) return res.status(401).json({ message: "Wrong credentials" });

        // Generate token and set cookie
        const token = create_token(user.username, MAX_AGE);
        res.cookie("user_auth", token, {
            httpOnly: true,
            maxAge: MAX_AGE * 1000,
            sameSite: "Lax", // or "None" if testing on HTTPS
            path: "/" // ensure it's available to all routes
          });
        res.status(200).json({ message: "Success" });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

// Logout User
const logout_user = (req, res) => {
    res.cookie("user_auth", "", { maxAge: 1 });
    res.redirect("/");
};

module.exports = {
    get_user,
    create_user,
    authenticate_user,
    logout_user
};
