const {
    Auctioneer,
    Auction,
    Bidding
} = require('../models/index')
const jwt = require('jsonwebtoken')
const {
    LocalStorage
} = require('node-localstorage');
var localStorage = new LocalStorage('./scratch');

//get bidding details of a specific auction
const getBiddingDetails = async id => {
    try {
        const bidDetails = await Bidding.find({'auction_id':id}).sort({'bid_amount': -1})
        if(bidDetails.length == 0){
            await Auction.updateOne({'_id': id},{'auction_status': 'open'})
        }
        return bidDetails
    } catch (error) {
        console.log(error)
    }  
}

//gettiing autioneer object id with username
const getAuctioneerId = async (name) =>{
    const auctioneerDetails = await Auctioneer.find({'username': name})
    return auctioneerDetails[0]['_id']
}

//getting auction details with auction object id
const getAuctionDetails = async id => {
    const auctionDetails = await Auction.find({'_id': id})
    return auctionDetails[0]
}

//getting highest Bid on specific auction with auction id
const getHighhestBidOnAuction = async auction_id => {
    try {
        const bidDetails = await Bidding.find({'auction_id': auction_id}).sort({'bid_amount': -1}).limit(1)
        const highestBid = bidDetails[0]['bid_amount']
        return highestBid
    } catch (error) {
        
    }
}

//inserting bidding values into db
const insertBiddingIntoDb = (biddingDetails) => {
    try {
        const {auctioneer_name, auction_id, bid_amount} = biddingDetails
        return new Promise(async (resolve, reject)=> {
            const auctioneer_id = await getAuctioneerId(auctioneer_name)
            const auctionDetails = await getAuctionDetails(auction_id)
            if(bid_amount < auctionDetails['min_amount']){
                resolve({status: 400, message: "bid is less than mentioned min amount"})
            }else if(bid_amount > auctionDetails['max_amount']){
                resolve({status: 400, message: "bid is greater than mentioned max amount"})
            }else if(auctionDetails['auction_status'] == 'closed'){
                resolve({status: 400, message: "bid is already closed"})
            }else if(auctionDetails['auction_status'] == 'running'){
                const higestBid = await getHighhestBidOnAuction(auction_id)
                if(bid_amount <= higestBid){
                    resolve({status: 401, message: "Your Bid Should Be More Than Previous Heighest Bid"})
                }else{
                    await Auction.updateOne({'_id':auction_id},{'auction_status': "running"})
                const data = {auction_id: auction_id, auctioneer_id: auctioneer_id, bid_amount: bid_amount}
                Bidding.insertMany([data], err => {
                    if(err){
                        resolve({status: 400, message: "Issue in inserting bidding details into DB"})
                    }else{
                        resolve({status: 200, message: "Successfully bidding details inserted in to Db"})
                    }
                })
                }
            }else{
                await Auction.updateOne({'_id':auction_id},{'auction_status': "running"})
            const data = {auction_id: auction_id, auctioneer_id: auctioneer_id, bid_amount: bid_amount}
            Bidding.insertMany([data], err => {
                if(err){
                    resolve({status: 400, message: "Issue in inserting bidding details into DB"})
                }else{
                    resolve({status: 200, message: "Successfully bidding details inserted in to Db"})
                }
            })
            }
        })
    } catch (error) {
        console.log(error)
    }  
}

// validating login user bid with closed auction highest bid
const validateBidWithHighestClosedBid = async (id, eachAuc, isIncludeAuc) => {
    const bidDetails = await Bidding.find({'auction_id': id}).sort({'bid_amount': -1}).limit(1)
    const highestBid = bidDetails[0]['bid_amount']
    return eachAuc['bid_amount'] >= highestBid
}

//getting login user bidding details
const getSpecificBiddingDetails = async () => {
    try {
        const loginUser = JSON.parse(localStorage.getItem('auctioneerDetails'))
        const username = loginUser['username'].trim()
        const auctioneerDetails = await Auctioneer.findOne({'username': username})
        const auctioneerId = auctioneerDetails['_id']
        const loginUserBids = await Bidding.find({'auctioneer_id': auctioneerId})
        const loginUserClosedBids = loginUserBids.filter( eachObj => eachObj['auction_id']['auction_status'] == 'closed')
        const userWonBids = []

        for(let eachAuc of loginUserClosedBids){
            const isIncludeAuc = userWonBids.includes(eachAuc)
            const isHighestBid = await validateBidWithHighestClosedBid(eachAuc['auction_id']['_id'], eachAuc, isIncludeAuc)
            if(isHighestBid && !isIncludeAuc){
                userWonBids.push(eachAuc)
            }
        }
        return userWonBids
    } catch (error) {
        console.log(error)
    }
}

//get bidding history of a specific auction with auction id
const getSpecificClosedBidDetails =  async (auctionId) => {
    try {
        const biddingDetails  = await Bidding.find({'auction_id': auctionId}).sort({'bid_amount': -1})
        return biddingDetails
    } catch (error) {
        console.log(error)
    }
    
}

module.exports = {getBiddingDetails, insertBiddingIntoDb, getSpecificBiddingDetails, getSpecificClosedBidDetails}