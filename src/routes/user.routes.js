const router = require('express').Router()
const userController = require('../constroller/user.controller')

const {loginPageFeildValidation,signupPageValidations} = require('../validations/feildValidations')

//login route
router.get('/login', userController.loginRoute)

//sign up route
router.get('/signup', userController.signUpRoute)

//validate user login credentials with db
router.post('/validate-user-login',loginPageFeildValidation, userController.validateUserLogin)

//adding auctioneer signup details into db
router.post('/add-auctioneer',signupPageValidations, userController.addNewAuctioneer)

//adding admin signup details into db
router.post('/add-admin',signupPageValidations, userController.addNewAdmin)

//admin logout route
router.get('/admin-logout', userController.adminLogout)

// auctioneer logout route
router.get('/auctioneer-logout', userController.auctioneerLogout)

module.exports = router
