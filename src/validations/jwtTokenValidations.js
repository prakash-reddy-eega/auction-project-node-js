const jwt = require('jsonwebtoken')
const {LocalStorage} = require('node-localstorage')
var localStorage = new LocalStorage('./scratch'); 



//auctoneer jwt validation with node localhost
// const auctioneerJwtValidation = (req, res, next) => {
//     const auctioneerDetails = localStorage.getItem('auctioneerDetails')
//     if(auctioneerDetails == null){
//          res.redirect('/login')
//     }else{
//         const parsedData = JSON.parse(auctioneerDetails)
//         const jwToken = parsedData['jwToken']
//         jwt.verify(jwToken, "my_jwt_token", (err, payload) => {
//             if(err){
//                 res.redirect('/login')
//             }else{
//                 next()
//             }
//         })
//     }
// }


//auctoneer jwt validation with node localhost
const adminJwtValidation = (req, response, next) => {
    let jwtToken;
    const authHeader = req.headers.authorization
    if (authHeader !== undefined) {
        jwtToken = authHeader.split(" ")[1];
      if (jwtToken === undefined) {
        response.status(401);
        response.send("Invalid JWT Token");
      } else {
        jwt.verify(jwtToken, "my_jwt_token", async (error, payload) => {
          if (error) {
            response.status(401);
            response.send("Invalid JWT Token");
          } else {
            next();
          }
        });
      }
    }else{
        response.status(401);
        response.send("Require Header For This Api");
    }  
}

module.exports = {adminJwtValidation}