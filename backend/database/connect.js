const mongoose = require("mongoose");

const connect = async (url) => {
    try{
        await mongoose.connect(url);
        console.log("Database Connected");
    } catch (e) {
        console.log(e)
    }
}

module.exports = connect;