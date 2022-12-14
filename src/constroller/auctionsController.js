const auctionsServices = require('../services/auctions.services')
const biddingsServices = require('../services/biddingServices')
const userServices = require('../services/user.services')

//auctioneer dashboard
const auctioneerDashboard = (req, res) => {
    try {
        res.status(200).render('common/auctioneerDashBoard')
    } catch (error) {
        console.log(error)
    }

}

//admin dashboard
const adminDashboard = (req, res) => {
    try {
        res.status(200).render('common/adminDashBoard')
    } catch (error) {
        console.log(error)
    }

}

//get auction details for creating new auction
const getNewAuctionDetailsPage = (req, res) => {
    try {
        res.status(200).render('pages/createAuction')
    } catch (error) {
        console.log(error)
    }
}

//insert new auction details into database
const insertNewActionIntoDb = async (req, res) => {
    try {
        const auctionDetails = req.body

        const {
            admin_username
        } = auctionDetails

        //get admin obj ID
        const adminOdjId = await userServices.getAdminObjId(admin_username)
        auctionDetails['admin_id'] = adminOdjId
        auctionDetails['auction_status'] = 'open'
        delete auctionDetails['admin_username']

        //passing details to add data into db
        const result = await auctionsServices.addNewAuctionIntoDb(auctionDetails)
        res.status(result['status']).send(result['message'])

    } catch (error) {
        console.log(error)
    }
}

//display available auctions(admin)
const displayAdminAuctions = async (req, res) => {
    try {
        const auctionsData = await auctionsServices.getAuctionsForAdminDashboard()
        res.status(200).render('pages/adminViewAuctions', {
            auctionsData
        })
    } catch (error) {
        console.log(error)
    }

}

//display specific auction details (admin type)
const displayAdminSpecificAuction = async (req, res) => {
    try {
        const auctionId = req.params.auction_id
        const auctionDetails = await auctionsServices.getSpecificAuctionDetailForAdminType(auctionId)
        const biddingDetails = await biddingsServices.getBiddingDetails(auctionId)
        res.status(200).render('pages/adminViewSpecificAuction', {
            'auctionDetails': auctionDetails, 'biddingDetails':biddingDetails
        })
    } catch (error) {
        console.log(error)
    }

}

//updating auction details contoller
const updateAuctionDetails = async (req, res) => {
    try {
        const auctionDetails = req.body
        const result = await auctionsServices.updateAuctionDetailsInDb(auctionDetails)
        res.status(result['status']).send(result['message'])
    } catch (error) {
        console.log(error)
    }
}

//displying closed auctions
const displayClosedAuctions = async (req, res) => {
    try {
        const closedAuctions = await auctionsServices.getClosedAuctions()
        res.status(200).render('pages/adminClosedAuctions', {closedAuctions})
    } catch (error) {
        console.log(error)
    }

}

//displying available auctions for auctioneer
const displayAuctioneerAvlAuctions = async (req, res) => {
    try {
        const auctionsData = await auctionsServices.getAvlbAuctionsAuctioneer()
        res.status(200).render('pages/auctioneerDisplayAvlAuctions', {
            auctionsData
        })
    } catch (error) {
        console.log(error)
    }
}

//closing auction
const closeAuction = async(req, res) => {
    try {
        const auctionId = req.params.auction_id
        const result = await auctionsServices.changeAuctionStatus(auctionId)
        res.status(result['status']).send(result['message'])
    } catch (error) {
        console.log(error)
    }
}

module.exports = {auctioneerDashboard, adminDashboard, getNewAuctionDetailsPage, insertNewActionIntoDb,
     displayAdminAuctions, displayAdminSpecificAuction, updateAuctionDetails, displayClosedAuctions,
     displayAuctioneerAvlAuctions, closeAuction
}