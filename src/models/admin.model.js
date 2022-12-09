const mongoose = require('mongoose')
const adminSchema =new mongoose.Schema({
    name: String,
    username: String,
    password: String,
    email_id: String
},{versionKey: false})

module.exports = mongoose.model("admin",adminSchema,"admin")