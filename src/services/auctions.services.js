const {
    Admin,
    Auction,
    Bidding
} = require('../models/index')
const jwt = require('jsonwebtoken')
const {
    LocalStorage
} = require('node-localstorage');
var localStorage = new LocalStorage('./scratch');

//adding new auction data into auctions collections
const addNewAuctionIntoDb = (auctionDetails) => {
    try {
        return new Promise((resolve, reject) => {
            let response = {
                message: '',
                status: ''
            }
            Auction.insertMany([auctionDetails], (err) => {
                if (err) {
                    response['status'] = 400
                    response['message'] = "issue in inserting data into auctions collection DB"
                    resolve(response)
                } else {
                    response['status'] = 200
                    response['message'] = "Successfully data inserted into DB"
                    resolve(response)
                }
            })

        })
    } catch (error) {
        console.log(error)
    }
}

//getting all available auctions details for admin dashboard
const getAuctionsForAdminDashboard = async () => {
    try {
        const loginUser = JSON.parse(localStorage.getItem('adminDetails'))
        const username = loginUser['username'].trim()
        const adminDetails = await Admin.findOne({'username': username})
        const adminId = adminDetails['_id']
        const auctionData = await Auction.find({'admin_id': adminId})
        const filteredDAta = auctionData.filter( eachObj => eachObj['auction_status'] != "closed")
        return filteredDAta
    } catch (error) {
        console.log(error)
    }

}

//get specific auction details for admin type with object id
const getSpecificAuctionDetailForAdminType = async objctId => {
    try {
        const auctionDetails = await Auction.find({
            '_id': objctId
        })
        return auctionDetails[0]
    } catch (error) {

    }
}

//updating auction details in db with specific id
const updateAuctionDetailsInDb =async auctionDetails => {
    const {auction_id, auction_name, auction_type, min_amount, max_amount, auction_status} = auctionDetails
    try {
        const dbAuctionDetila = await Auction.findOne({'_id': auction_id})
        if(dbAuctionDetila['auction_status'] == "closed"){
            return {'message': 'This Auction has been closed, You can not edit this', "status": 400}
        }else if(dbAuctionDetila['auction_status'] == "running"){
            return {'message': 'This Auction has been running, You can not edit this', "status": 400}
        }
        await Auction.updateOne({"_id": auction_id},{
            "auction_name":auction_name,
            "auction_type":auction_type,
            "min_amount": min_amount,
            "max_amount": max_amount,
            "auction_status": auction_status
        })
        return {'message': 'Successfully Updated Auction Details', "status": 200}
    } catch (error) {
        console.log(error)
        return {'message': 'Issue In Updating Auction Details', "status": 400}
    }
}

//getting unique bid details with auction id
const getClosedAuctionsWithWinner = async closedAuctionsIds => {
    try {
        const dataArr = []
        for(let eachId of closedAuctionsIds){
            const obj = await Bidding.findOne({'auction_id': eachId}).sort({'bid_amount': -1}).limit(1)
            dataArr.push(obj)
        }
        return dataArr
    } catch (error) {
        console.log(error)
    }
}

//get closed auction details from db for admin
const getClosedAuctions = async() =>{
    try {
        const loginUser = JSON.parse(localStorage.getItem('adminDetails'))
        const username = loginUser['username'].trim()
        const adminDetails = await Admin.findOne({'username': username})
        const adminId = adminDetails['_id']
        const auctionData = await Auction.find({'admin_id': adminId})
        // const closedAuctions = await Auction.find({'auction_status': 'closed'})
        const closedAuctions = auctionData.filter( eachObj => eachObj['auction_status'] == 'closed')
        if(closedAuctions.length == 0){
            return []
        }else{
            const closedAuctionsIds = closedAuctions.map( eachObj => eachObj['_id'])
            const closedAuctionsWithWinner = await getClosedAuctionsWithWinner(closedAuctionsIds) 
            return closedAuctionsWithWinner
        }
        
    } catch (error) {
        console.log(error)
    }
} 

//get available auctions for auctioneer
const getAvlbAuctionsAuctioneer = async() => {
    try {
        const auctionData = await Auction.find()
        const filteredDAta = auctionData.filter( eachObj => eachObj['auction_status'] != "closed")
        return filteredDAta
    } catch (error) {
        console.log(error)
    }
}

//changing specific auction status to "closed"
const changeAuctionStatus = async(auction_id) => {
    try {
        await Auction.updateOne({'_id': auction_id},{'auction_status': 'closed'})
        return({'status':200, 'message': 'Auction was closed Successfully'})
    } catch (error) {
        console.log(error)
        return ({'status':400, 'messaage': 'issue in Closing Auction With Db'})
    }
}

//getting auction details with auction object id
const getAuctionDetails = async id => {
    const auctionDetails = await Auction.find({'_id': id})
    return auctionDetails[0]
}

module.exports = { addNewAuctionIntoDb, getAuctionsForAdminDashboard, getSpecificAuctionDetailForAdminType,
     updateAuctionDetailsInDb, getClosedAuctions, getAvlbAuctionsAuctioneer, changeAuctionStatus, getAuctionDetails}