const router = require('express').Router()
const auctionsController = require('../constroller/auctionsController')

const {addNewAuction,updateAuctionValidation, paramValidation} = require('../validations/feildValidations')
const {adminJwtValidation} = require('../validations/jwtTokenValidations')


//auctioneer dashboard route
router.get('/auctioneer-dashboard', auctionsController.auctioneerDashboard)

//admin dashboard route
router.get('/admin-dashboard', auctionsController.adminDashboard)

// (admin) new auction page to get auction details from user
router.get('/add-new-auction', auctionsController.getNewAuctionDetailsPage)

//insert new auction data into DB (admin)
router.post('/insert-auction-db',addNewAuction,adminJwtValidation, auctionsController.insertNewActionIntoDb)

//display available auctions for admin
router.get('/admin-view-auctions', auctionsController.displayAdminAuctions)

//display specific auction details with Object id (admin type)
router.get('/admin-auctions/auction_id/:auction_id',paramValidation, auctionsController.displayAdminSpecificAuction)

//update existing auction details route
router.post('/update-auction-details',updateAuctionValidation,adminJwtValidation, auctionsController.updateAuctionDetails)

//get closed Auctions route (admin)
router.get('/admin-view-closed-auctions', auctionsController.displayClosedAuctions)

//display available routes for auctoneer
router.get('/auctioneer-available-auctions', auctionsController.displayAuctioneerAvlAuctions)

//closing auction route
router.get('/close-auction/:auction_id',paramValidation,adminJwtValidation, auctionsController.closeAuction)

module.exports = router