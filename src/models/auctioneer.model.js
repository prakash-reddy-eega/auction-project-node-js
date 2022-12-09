const mongoose = require('mongoose')
const auctioneerSchema =new mongoose.Schema({
    name: String,
    username: String,
    password: String,
    email_id: String 
},
{versionKey: false})

module.exports = mongoose.model("auctioneer",auctioneerSchema,"auctioneers")