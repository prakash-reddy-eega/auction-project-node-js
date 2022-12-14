const router = require('express').Router()
const routes = require('./routes');

router.get('/', (req, res) => {
    res.redirect('/user/login')
})

//all user APIs
router.use('/user', routes.User)

//all auctions APIs
router.use('/auction', routes.Auction)

//all bidding APIs
router.use('/bidding', routes.Bidding)

module.exports = router
