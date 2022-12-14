const {
    Auctioneer,
    Admin,
    Auction,
    Bidding
} = require('../models/index')
const jwt = require('jsonwebtoken')
const {
    LocalStorage
} = require('node-localstorage');
const { find, findOne } = require('../models/auctioneer.model');
var localStorage = new LocalStorage('./scratch');



//check user login details with DB
const checkUserInDb = async (userDetails) => {
    try {
        //checking user in auctioneer collection
        if (userDetails['loginType'] == 'auctioneer') {
            const dbUseerDetails = await Auctioneer.find({
                "username": userDetails['username']
            })
            if (dbUseerDetails.length != 0) {
                if (dbUseerDetails[0]['username'] == userDetails['username']) {
                    if (dbUseerDetails[0]['password'] == userDetails['password']) {
                        const payload = {
                            username: dbUseerDetails[0]['username']
                        }
                        const jwToken = jwt.sign(payload, "my_jwt_token")
                        const data = {
                            username: dbUseerDetails[0]['username'],
                            jwToken: jwToken
                        }
                        const stringiedData = JSON.stringify(data)
                        localStorage.setItem('auctioneerDetails', stringiedData)
                        return {
                            "message": jwToken,
                            "status": 200
                        }
                    } else {
                        return {
                            "message": "Invalid Password",
                            "status": 400
                        }
                    }
                } else {
                    return {
                        "message": "Invalid Username",
                        "status": 400
                    }
                }
            } else {
                return {
                    "message": "Invalid User",
                    "status": 404
                }
            }
        }
        //checking user in admin collection
        if (userDetails['loginType'] == 'admin') {
            const dbUseerDetails = await Admin.find({
                "username": userDetails['username']
            })
            if (dbUseerDetails.length != 0) {
                if (dbUseerDetails[0]['username'] == userDetails['username']) {
                    if (dbUseerDetails[0]['password'] == userDetails['password']) {
                        const payload = {
                            username: dbUseerDetails[0]['username']
                        }
                        const jwToken = jwt.sign(payload, "my_jwt_token")
                        const data = {
                            username: dbUseerDetails[0]['username'],
                            jwToken: jwToken
                        }
                        const stringiedData = JSON.stringify(data)
                        localStorage.setItem('adminDetails', stringiedData)
                        return {
                            "message": jwToken,
                            "status": 200
                        }
                    } else {
                        return {
                            "message": "Invalid Password",
                            "status": 400
                        }
                    }
                } else {
                    return {
                        "message": "Invalid Username",
                        "status": 400
                    }
                }
            } else {
                return {
                    "message": "Invalid User",
                    "status": 404
                }
            }
        }
    } catch (error) {
        console.log(error)
    }

}

//verifing auctioneer existence in DB
const findIsAuctioneerAlreadyExists = async (username) => {
    const dbUseerDetails = await Auctioneer.find({
        "username": username
    })
    if (dbUseerDetails.length == 0) {
        return false
    } else {
        return true
    }
}

//add new auctioneer to auctioneer collection
const addNewAuctioneerToDb = (userDetails) => {
    try {
        return new Promise(async (resolve, reject) => {
            let response = {
                status: '',
                message: ''
            }
            const username = userDetails['username']
            const isUserAlreadyExists = await findIsAuctioneerAlreadyExists(username)

            if (isUserAlreadyExists) {
                response['status'] = 400
                response['message'] = "Username has been taken"
                resolve(response)
            } else {
                Auctioneer.insertMany([userDetails], err => {
                    if (err) {
                        response['status'] = 400
                        response['message'] = "issue in inserting data into DB"
                        resolve(response)
                    } else {
                        response['status'] = 200
                        response['message'] = "successfully data inserted into DB"
                        resolve(response)
                    }
                })
            }
        })

    } catch (error) {
        console.log(error)
    }
}

//verifing admin existence in DB
const findIsAdminAlreadyExists = async (username) => {
    const dbUseerDetails = await Admin.find({
        "username": username
    })
    if (dbUseerDetails.length == 0) {
        return false
    } else {
        return true
    }
}

//add new admin to auctioneer collection
const addNewAdminToDb = (userDetails) => {
    try {
        return new Promise(async (resolve, reject) => {
            let response = {
                status: '',
                message: ''
            }

            const username = userDetails['username']
            const isUserAlreadyExists = await findIsAdminAlreadyExists(username)
            if (isUserAlreadyExists) {
                response['status'] = 400
                response['message'] = "Username has been taken"
                console.log(error)
                resolve(response)
            } else {
                Admin.insertMany([userDetails], err => {
                    if (err) {
                        response['status'] = 400
                        response['message'] = "issue in inserting data into DB"
                        resolve(response)
                    } else {
                        response['status'] = 200
                        response['message'] = "successfully data inserted into DB"
                        resolve(response)
                    }
                })
            }
        })

    } catch (error) {
        console.log(error)
    }
}

//return admin Object Id
const getAdminObjId = async (username) => {
    const adminDetails = await Admin.find({
        'username': username
    })
    return adminDetails[0]['_id']
}

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

//removing admin login details from local Staorage
const removeLoginDetailsFromLocalSrg = () => {
    try {
        const adminDetails = localStorage.getItem('adminDetails')
        if(adminDetails != null){
            localStorage.removeItem('adminDetails')
            return {status: 200}
        }
    } catch (error) {
        console.log(error)
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

// closedAuctionsIds.map( async eachId =>  {
//     const obj = await Bidding.findOne({'auction_id': eachId}).sort({'bid_amount': -1})
//     return obj
// })

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

//removing auctioneer login details from local storage
const removeAuctionerLoginDetailsFromLocalSrg = () => {
    try {
        const auctioneerDetails = localStorage.getItem('auctioneerDetails')
        if(auctioneerDetails != null){
            localStorage.removeItem('auctioneerDetails')
            return {status: 200}
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

// validating login user bid with closed auction highest bid
const validateBidWithHighestClosedBid = async (id, eachAuc, isIncludeAuc) => {
    const bidDetails = await Bidding.find({'auction_id': id}).sort({'bid_amount': -1}).limit(1)
    const highestBid = bidDetails[0]['bid_amount']
    return eachAuc['bid_amount'] >= highestBid
    // console.log(eachAuc['bid_amount'] > highestBid)
    // console.log(eachAuc['bid_amount'] , highestBid)
    // if(eachAuc['bid_amount'] >= highestBid){
    //     console.log("iiii")
    //     userWonBids.push(eachAuc)
    // }
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
        // console.log(userWonBids)
        
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

module.exports = {
    checkUserInDb,
    addNewAuctioneerToDb,
    addNewAdminToDb,
    getAdminObjId,
    addNewAuctionIntoDb,
    getAuctionsForAdminDashboard,
    getSpecificAuctionDetailForAdminType,
    removeLoginDetailsFromLocalSrg,
    updateAuctionDetailsInDb,
    getClosedAuctions,
    removeAuctionerLoginDetailsFromLocalSrg,
    getAvlbAuctionsAuctioneer,
    insertBiddingIntoDb,
    getBiddingDetails,
    changeAuctionStatus,
    getSpecificBiddingDetails,
    getSpecificClosedBidDetails,
    getAuctionDetails
}