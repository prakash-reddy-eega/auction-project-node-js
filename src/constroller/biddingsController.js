const auctionsServices = require('../services/auctions.services')
const biddingsServices = require('../services/biddingServices')

//showing specific bid details to bid (auctioneer type)
const viewSpecifcAuctionToBid = async (req, res) => {
    try {
        const auctionId = req.params.auction_id
        const auctionDetails = await auctionsServices.getSpecificAuctionDetailForAdminType(auctionId)
        const biddingDetails = await biddingsServices.getBiddingDetails(auctionId)
        res.status(200).render('pages/auctionBid', {
            "auctionDetails":auctionDetails, "biddingDetails": biddingDetails
        })
    } catch (error) {
        console.log(error)
    }
}

//get bid details from request route and inserting it into db
const getBiddingDetails = async (req, res) => {
    try {
        const bidDetails = req.body
        const result = await biddingsServices.insertBiddingIntoDb(bidDetails)
        res.status(result['status']).send(result['message'])
    } catch (error) {
        console.log(error)
    }

}

//showing Auctioneer bidding history
const showAuctioneerBiddings = async (req, res) => {
    try {
        const biddingDetails = await biddingsServices.getSpecificBiddingDetails()
        res.status(200).render('pages/auctioneerBidDetails', {biddingDetails})
    } catch (error) {
        console.log(error)
    }
}

//showing ongoing specific bid details with auction id
const showingClosedBidDetailsToAuctioneer = async (req, res) => {
    try {
        const auctionId = req.params.auction_id
        const biddingDetails = await biddingsServices.getSpecificClosedBidDetails(auctionId)
        const auctionDetails = await auctionsServices.getAuctionDetails(auctionId)
        res.status(200).render('pages/biddingHistory', {'biddingDetails':biddingDetails, 'auctionDetails': auctionDetails})

    } catch (error) {
        console.log(error)
    }
}

module.exports = {viewSpecifcAuctionToBid, getBiddingDetails, showAuctioneerBiddings, showingClosedBidDetailsToAuctioneer}