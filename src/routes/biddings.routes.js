const router = require('express').Router()
const biddingsController = require('../constroller/biddingsController')

const {biddingFeildsValidation, paramValidation} = require('../validations/feildValidations')
const {adminJwtValidation} = require('../validations/jwtTokenValidations')


//show user biddings (auctioneer type)
router.get('/auctioneer-my-biddings', biddingsController.showAuctioneerBiddings)

//make bid route
router.post('/make-bidding', biddingFeildsValidation,adminJwtValidation, biddingsController.getBiddingDetails)

//showing closed specific auction bid details to auctioneer
router.get('/auctioneer-auctions/auction_bid_details/:auction_id', paramValidation, biddingsController.showingClosedBidDetailsToAuctioneer)

//display specific auction details with auction id (auctioneer type)
router.get('/auctioneer-auctions/auction_bid/:auction_id',paramValidation, biddingsController.viewSpecifcAuctionToBid)

module.exports = router