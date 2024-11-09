const Users = require("../models/User");
const bcrypt = require('bcrypt');

const get_user = async(req,res) => {
    try {
        const user = await Users.findOne({ username: req.params.username });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const create_user = async(req,res) => {
    const {username,password} = req.body;
    
    try {
        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new Users({
            username,
            password: hashedPassword
        });

        // Save the user
        await newUser.save();
        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    get_user,
    create_user
}