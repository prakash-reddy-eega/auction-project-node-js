const router = require('express').Router()
const auctonDetailsController = require('../constroller/auctionDetails.controller')
const {loginPageFeildValidation,signupPageValidations,addNewAuction,updateAuctionValidation,biddingFeildsValidation, paramValidation} = require('../validations/feildValidations')
const {auctioneerJwtValidation, adminJwtValidation} = require('../validations/jwtTokenValidations')

//test route
router.get('/', (req, res) => {
    res.status(200).redirect('/login')
})

//login route
router.get('/login', auctonDetailsController.loginRoute)

//sign up route
router.get('/signup', auctonDetailsController.signUpRoute)

//validate user login credentials with db
router.post('/validate-user-login',loginPageFeildValidation, auctonDetailsController.validateUserLogin)

//auctioneer dashboard route
router.get('/auctioneer-dashboard',auctioneerJwtValidation, auctonDetailsController.auctioneerDashboard)

//admin dashboard route
router.get('/admin-dashboard',adminJwtValidation, auctonDetailsController.adminDashboard)

//adding auctioneer signup details into db
router.post('/add-auctioneer',signupPageValidations, auctonDetailsController.addNewAuctioneer)

//adding admin signup details into db
router.post('/add-admin',signupPageValidations, auctonDetailsController.addNewAdmin)

// (admin) new auction page to get auction details from user
router.get('/add-new-auction',adminJwtValidation, auctonDetailsController.getNewAuctionDetailsPage)

//insert new auction data into DB (admin)
router.post('/insert-auction-db',addNewAuction,adminJwtValidation, auctonDetailsController.insertNewActionIntoDb)

//display available auctions for admin
router.get('/admin-view-auctions',adminJwtValidation, auctonDetailsController.displayAdminAuctions)

//display specific auction details with Object id (admin type)
router.get('/admin-auctions/auction_id/:auction_id',paramValidation,adminJwtValidation, auctonDetailsController.displayAdminSpecificAuction)

//admin logout route
router.get('/admin-logout', auctonDetailsController.adminLogout)

//update existing auction details route
router.post('/update-auction-details',updateAuctionValidation, adminJwtValidation, auctonDetailsController.updateAuctionDetails)

//get closed Auctions route
router.get('/admin-view-closed-auctions', adminJwtValidation, auctonDetailsController.displayClosedAuctions)

// auctioneer logout route
router.get('/auctioneer-logout', auctonDetailsController.auctioneerLogout)

//display available routes for auctoneer
router.get('/auctioneer-available-auctions', auctioneerJwtValidation, auctonDetailsController.displayAuctioneerAvlAuctions)

//display specific auction details with auction id (auctioneer type)
router.get('/auctioneer-auctions/auction_bid/:auction_id',paramValidation, auctioneerJwtValidation, auctonDetailsController.viewSpecifcAuctionToBid)

//make bidding route
router.post('/make-bidding', biddingFeildsValidation, auctioneerJwtValidation, auctonDetailsController.getBiddingDetails)

//closing auction route
router.get('/close-auction/:auction_id',paramValidation, adminJwtValidation, auctonDetailsController.closeAuction)

//show user biddings (auctioneer type)
router.get('/auctioneer-my-biddings', auctioneerJwtValidation, auctonDetailsController.showAuctioneerBiddings)

//showing closed specific auction bid details to auctioneer
router.get('/auctioneer-auctions/auction_bid_details/:auction_id', paramValidation, auctioneerJwtValidation, auctonDetailsController.showingClosedBidDetailsToAuctioneer)

module.exports = router