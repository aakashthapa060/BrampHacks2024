
const { Schema, model} = require('mongoose');

const userSchema = new Schema({
    username: {type: String, required: true,lowercase: true,unique:true},
    password: {type:String, required: true}
})

const Users = model("Users", userSchema)

module.exports = Users;