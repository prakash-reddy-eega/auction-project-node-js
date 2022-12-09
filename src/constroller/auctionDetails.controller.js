const auctiondDetailsServices = require('../services/auctionDetails.services')

//login page controller
const loginRoute = (req, res) => {
    try {
        res.status(200).render('pages/login')
    } catch (error) {
        console.log(error)
    }

}

//sign up page controller
const signUpRoute = (req, res) => {
    try {
        res.status(200).render('pages/signUp')
    } catch (error) {
        console.log(error)
    }

}

//validate user login with DB
const validateUserLogin = async (req, res) => {
    try {
        const userDetails = req.body
        const result = await auctiondDetailsServices.checkUserInDb(userDetails)
        res.status(result['status'])
        res.send({
            message: result['message']
        })
    } catch (error) {
        console.log(error)
    }

}
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

//add new auctioneer to db
const addNewAuctioneer = async (req, res) => {
    try {
        const userDetails = req.body
        const result = await auctiondDetailsServices.addNewAuctioneerToDb(userDetails)
        res.status(result['status']).send({
            message: result['message']
        })
    } catch (error) {
        console.log(error)
    }
}

//add new admin to db
const addNewAdmin = async (req, res) => {
    try {
        const userDetails = req.body
        const result = await auctiondDetailsServices.addNewAdminToDb(userDetails)
        res.status(result['status']).send({
            message: result['message']
        })
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
        const adminOdjId = await auctiondDetailsServices.getAdminObjId(admin_username)
        auctionDetails['admin_id'] = adminOdjId
        auctionDetails['auction_status'] = 'open'
        delete auctionDetails['admin_username']

        //passing details to add data into db
        const result = await auctiondDetailsServices.addNewAuctionIntoDb(auctionDetails)
        res.status(result['status']).send(result['message'])

    } catch (error) {
        console.log(error)
    }
}

//display available auctions(admin)
const displayAdminAuctions = async (req, res) => {
    try {
        const auctionsData = await auctiondDetailsServices.getAuctionsForAdminDashboard()
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
        const auctionDetails = await auctiondDetailsServices.getSpecificAuctionDetailForAdminType(auctionId)
        const biddingDetails = await auctiondDetailsServices.getBiddingDetails(auctionId)
        res.status(200).render('pages/adminViewSpecificAuction', {
            'auctionDetails': auctionDetails, 'biddingDetails':biddingDetails
        })
    } catch (error) {
        console.log(error)
    }

}

//admin-logout
const adminLogout = (req, res) => {
    try {
        const result = auctiondDetailsServices.removeLoginDetailsFromLocalSrg()
        res.status(result['status']).send({'message':'Logout Done'})
    } catch (error) {
        console.log(error)
    }

}

//updating auction details contoller
const updateAuctionDetails = async (req, res) => {
    try {
        const auctionDetails = req.body
        const result = await auctiondDetailsServices.updateAuctionDetailsInDb(auctionDetails)
        res.status(result['status']).send(result['message'])
    } catch (error) {
        console.log(error)
    }
}

//displying closed auctions
const displayClosedAuctions = async (req, res) => {
    try {
        const closedAuctions = await auctiondDetailsServices.getClosedAuctions()
        res.status(200).render('pages/adminClosedAuctions', {closedAuctions})
    } catch (error) {
        console.log(error)
    }

}

//auctioneer logout
const auctioneerLogout = (req, res) => {
    try {
        const result = auctiondDetailsServices.removeAuctionerLoginDetailsFromLocalSrg()
        res.status(result['status']).send({'message': 'Logout Done'})
    } catch (error) {
        console.log(error)
    }
}

//displying available auctions for auctioneer
const displayAuctioneerAvlAuctions = async (req, res) => {
    try {
        const auctionsData = await auctiondDetailsServices.getAvlbAuctionsAuctioneer()
        res.status(200).render('pages/auctioneerDisplayAvlAuctions', {
            auctionsData
        })
    } catch (error) {
        console.log(error)
    }
}

//showing specific bid details to bid (auctioneer type)
const viewSpecifcAuctionToBid = async (req, res) => {
    try {
        const auctionId = req.params.auction_id
        const auctionDetails = await auctiondDetailsServices.getSpecificAuctionDetailForAdminType(auctionId)
        const biddingDetails = await auctiondDetailsServices.getBiddingDetails(auctionId)
        res.status(200).render('pages/auctionBid', {
            "auctionDetails":auctionDetails, "biddingDetails": biddingDetails
        })
    } catch (error) {
        console.log(error)
    }
}

//get bid details from request route
const getBiddingDetails = async (req, res) => {
    try {
        const bidDetails = req.body
        const result = await auctiondDetailsServices.insertBiddingIntoDb(bidDetails)
        res.status(result['status']).send(result['message'])
    } catch (error) {
        console.log(error)
    }

}

//closing auction
const closeAuction = async(req, res) => {
    try {
        const auctionId = req.params.auction_id
        const result = await auctiondDetailsServices.changeAuctionStatus(auctionId)
        res.status(result['status']).send(result['message'])
    } catch (error) {
        console.log(error)
    }
}

//showing Auctioneer bidding history
const showAuctioneerBiddings = async (req, res) => {
    try {
        const biddingDetails = await auctiondDetailsServices.getSpecificBiddingDetails()
        res.status(200).render('pages/auctioneerBidDetails', {biddingDetails})
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    loginRoute,
    signUpRoute,
    validateUserLogin,
    auctioneerDashboard,
    adminDashboard,
    addNewAuctioneer,
    addNewAdmin,
    getNewAuctionDetailsPage,
    insertNewActionIntoDb,
    displayAdminAuctions,
    displayAdminSpecificAuction,
    adminLogout,
    updateAuctionDetails,
    displayClosedAuctions,
    auctioneerLogout,
    displayAuctioneerAvlAuctions,
    viewSpecifcAuctionToBid,
    getBiddingDetails,
    closeAuction,
    showAuctioneerBiddings
}