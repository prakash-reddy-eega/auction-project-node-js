const userServices = require('../services/user.services')

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

const validateUserLogin = async (req, res) => {
    try {
        const userDetails = req.body
        const result = await userServices.checkUserInDb(userDetails)
        res.status(result['status'])
        res.send({
            message: result['message']
        })
    } catch (error) {
        console.log(error)
    }

}

//add new auctioneer to db
const addNewAuctioneer = async (req, res) => {
    try {
        const userDetails = req.body
        const result = await userServices.addNewAuctioneerToDb(userDetails)
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
        const result = await userServices.addNewAdminToDb(userDetails)
        res.status(result['status']).send({
            message: result['message']
        })
    } catch (error) {
        console.log(error)
    }
}

//admin-logout
const adminLogout = (req, res) => {
    try {
        const result = userServices.removeLoginDetailsFromLocalSrg()
        res.status(result['status']).send({'message':'Logout Done'})
    } catch (error) {
        console.log(error)
    }

}

//auctioneer logout
const auctioneerLogout = (req, res) => {
    try {
        const result = userServices.removeAuctionerLoginDetailsFromLocalSrg()
        res.status(result['status']).send({'message': 'Logout Done'})
    } catch (error) {
        console.log(error)
    }
}

module.exports = {loginRoute, signUpRoute, auctioneerLogout, addNewAuctioneer, addNewAdmin, adminLogout, auctioneerLogout, validateUserLogin}