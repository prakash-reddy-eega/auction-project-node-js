const mongoose = require('mongoose')
const auctionSchema = new mongoose.Schema({
    admin_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin',
        autopopulate: true
    },
    auction_name: String,
    auction_type: String,
    min_amount: Number,
    max_amount: Number,
    auction_status: String
},{versionKey: false})

auctionSchema.plugin(require('mongoose-autopopulate'))

module.exports = mongoose.model('auction', auctionSchema, 'auctions')