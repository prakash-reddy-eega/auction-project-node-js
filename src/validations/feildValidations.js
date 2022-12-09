const {
    check,
    validationResult
} = require('express-validator')

//login page feild validation with backend
const loginPageFeildValidation = [
    check("username")
    .notEmpty()
    .withMessage("username should be not emplty string")
    .isString(),
    check("password")
    .notEmpty()
    .withMessage("password should be not emplty string")
    .isString(),
    (req, res, next) => {
        try {
            validationResult(req).throw()
            next()
        } catch (error) {
            res.status(401).json({
                message: error.array()
            })
        }
    }
]

//sign up page feilds validations
const signupPageValidations = [
    check("name")
    .notEmpty()
    .withMessage("name should be not emplty string")
    .isString(),
    check("username")
    .notEmpty()
    .withMessage("username should be not emplty string")
    .isString(),
    check("email_id")
    .notEmpty()
    .withMessage("email should be not emplty")
    .isEmail()
    .withMessage("email should be in proper email format"),
    check("password")
    .notEmpty()
    .withMessage("password should be not emplty string")
    .isString(),
    (req, res, next) => {
        try {
            validationResult(req).throw()
            next()
        } catch (error) {
            res.status(401).json({
                message: error.array()
            })
        }
    }
]

//add new auction validation
const addNewAuction = [
    check('admin_username')
    .isString()
    .withMessage('admin username should be string')
    .notEmpty()
    .withMessage('admin username should be not empty'),
    check('auction_name')
    .isString()
    .withMessage('auction name should be string')
    .notEmpty()
    .withMessage('auction name should be not empty'),
    check('auction_type')
    .isString()
    .withMessage('auction type should be string')
    .notEmpty()
    .withMessage('auction type should be not empty'),
    check('min_amount')
    .isInt()
    .withMessage('min amonut should be integer')
    .notEmpty()
    .withMessage('min amount should be not empty'),
    check('max_amount')
    .isInt()
    .withMessage('max amonut should be integer')
    .notEmpty()
    .withMessage('max amount should be not empty'),
    (req, res, next) => {
        try {
            validationResult(req).throw()
            next()
        } catch (error) {
            res.status(400).send({
                message: error.array()
            })
        }
    }
]

//update aucton validation
const updateAuctionValidation = [
    check('auction_id')
    .isMongoId()
    .withMessage('auction id should be an mongo oject id'),
    check('auction_name')
    .isString()
    .withMessage('auction name should be string')
    .notEmpty()
    .withMessage('auction name should be not empty'),
    check('auction_type')
    .isString()
    .withMessage('auction type should be string')
    .notEmpty()
    .withMessage('auction type should be not empty'),
    check('min_amount')
    .isInt()
    .withMessage('min amonut should be integer')
    .notEmpty()
    .withMessage('min amount should be not empty'),
    check('max_amount')
    .isInt()
    .withMessage('max amonut should be integer')
    .notEmpty()
    .withMessage('max amount should be not empty'),
    check('auction_status')
    .isString()
    .withMessage('auction status should be string')
    .notEmpty()
    .withMessage('auction status should be not empty'),
    (req, res, next) => {
        try {
            validationResult(req).throw()
            next()
        } catch (error) {
            res.status(400).send({
                message: error
            })
        }
    }
]

const biddingFeildsValidation = [
    check('auctioneer_name')
    .isString()
    .withMessage('auctioneer name should be string')
    .notEmpty()
    .withMessage('auctioneer name should be not empty'),
    check('auction_id')
    .isMongoId()
    .withMessage('auction id should be an mongo object id'),
    check('bid_amount')
    .isInt()
    .withMessage('bid amount should be an number')
    .notEmpty()
    .withMessage('bid amount should be not empty'),
    (req, res, next) => {
        try {
            validationResult(req).throw()
            next()
        } catch (error) {
            res.status(400).send(error.array())
        }

    }
]

const paramValidation = [
    check('auction_id')
    .isMongoId()
    .withMessage('request param should be an mongo object id'),
    (req, res, next) => {
        try {
            validationResult(req).throw()
            next()
        } catch (error) {
            res.status(400).send(error.array())
        }
    }
]

module.exports = {
    loginPageFeildValidation,
    signupPageValidations,
    addNewAuction,
    updateAuctionValidation,
    biddingFeildsValidation,
    paramValidation
}