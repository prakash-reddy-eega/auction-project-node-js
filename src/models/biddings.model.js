const mongoose = require('mongoose')
const biddingsSchema = new mongoose.Schema({
    auction_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'auction',
        autopopulate: true
    },
    auctioneer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'auctioneer',
        autopopulate: true
    },
    bid_amount: Number
},{versionKey: false})

biddingsSchema.plugin(require('mongoose-autopopulate'))

module.exports = mongoose.model('biddings', biddingsSchema, 'biddings')