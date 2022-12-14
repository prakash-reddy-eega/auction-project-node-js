const router = require('express').Router()
const auctionsController = require('../constroller/auctionsController')

const {loginPageFeildValidation,signupPageValidations,addNewAuction,updateAuctionValidation,biddingFeildsValidation, paramValidation} = require('../validations/feildValidations')
const {auctioneerJwtValidation, adminJwtValidation} = require('../validations/jwtTokenValidations')


//auctioneer dashboard route
router.get('/auctioneer-dashboard',auctioneerJwtValidation, auctionsController.auctioneerDashboard)

//admin dashboard route
router.get('/admin-dashboard',adminJwtValidation, auctionsController.adminDashboard)

// (admin) new auction page to get auction details from user
router.get('/add-new-auction',adminJwtValidation, auctionsController.getNewAuctionDetailsPage)

//insert new auction data into DB (admin)
router.post('/insert-auction-db',addNewAuction,adminJwtValidation, auctionsController.insertNewActionIntoDb)

//display available auctions for admin
router.get('/admin-view-auctions',adminJwtValidation, auctionsController.displayAdminAuctions)

//display specific auction details with Object id (admin type)
router.get('/admin-auctions/auction_id/:auction_id',paramValidation,adminJwtValidation, auctionsController.displayAdminSpecificAuction)

//update existing auction details route
router.post('/update-auction-details',updateAuctionValidation, adminJwtValidation, auctionsController.updateAuctionDetails)

//get closed Auctions route (admin)
router.get('/admin-view-closed-auctions', adminJwtValidation, auctionsController.displayClosedAuctions)

//display available routes for auctoneer
router.get('/auctioneer-available-auctions', auctioneerJwtValidation, auctionsController.displayAuctioneerAvlAuctions)

//closing auction route
router.get('/close-auction/:auction_id',paramValidation, adminJwtValidation, auctionsController.closeAuction)

module.exports = router