const jwt = require('jsonwebtoken')
const {LocalStorage} = require('node-localstorage')
var localStorage = new LocalStorage('./scratch'); 



//auctoneer jwt validation with node localhost
const auctioneerJwtValidation = (req, res, next) => {
    const auctioneerDetails = localStorage.getItem('auctioneerDetails')
    if(auctioneerDetails == null){
         res.redirect('/login')
    }else{
        const parsedData = JSON.parse(auctioneerDetails)
        const jwToken = parsedData['jwToken']
        jwt.verify(jwToken, "my_jwt_token", (err, payload) => {
            if(err){
                res.redirect('/login')
            }else{
                next()
            }
        })
    }
}


//auctoneer jwt validation with node localhost
const adminJwtValidation = (req, res, next) => {
    const adminDetails = localStorage.getItem('adminDetails')
    if(adminDetails == null){
         res.redirect('/login')
    }else{
        const parsedData = JSON.parse(adminDetails)
        const jwToken = parsedData['jwToken']
        jwt.verify(jwToken, "my_jwt_token", (err, payload) => {
            if(err){
                res.redirect('/login')
            }else{
                next()
            }
        })
    }
}

module.exports = {auctioneerJwtValidation,adminJwtValidation}