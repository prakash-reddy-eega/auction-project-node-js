const {
    Auctioneer,
    Admin,
} = require('../models/index')
const jwt = require('jsonwebtoken')
const {
    LocalStorage
} = require('node-localstorage');
var localStorage = new LocalStorage('./scratch');
const bcrypt = require('bcrypt')

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
                    const decryptedPassword =  await bcrypt.compare(userDetails['password'], dbUseerDetails[0]['password'])
                    if (decryptedPassword) {
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
                    const decryptedPassword =  await bcrypt.compare(userDetails['password'], dbUseerDetails[0]['password'])
                    if (decryptedPassword) {
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
                const password = userDetails['password']
                const hashedPassword = await bcrypt.hash(password, 10)
                userDetails['password'] = hashedPassword
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
                const password = userDetails['password']
                const hashedPassword = await bcrypt.hash(password, 10)
                userDetails['password'] = hashedPassword
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

//removing admin login details from local Staorage
const removeLoginDetailsFromLocalSrg = () => {
    try {
        const adminDetails = localStorage.getItem('adminDetails')
        if(adminDetails != null){
            localStorage.removeItem('adminDetails')
            return {status: 200}
        }else{
            return {status: 200}
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
        }else{
            return {status: 200}
        }
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


module.exports = {checkUserInDb, addNewAuctioneerToDb, addNewAdminToDb, removeLoginDetailsFromLocalSrg, removeAuctionerLoginDetailsFromLocalSrg, getAdminObjId}
