const router = require('express').Router()

// import routes 
const GetFolloweesImages = require('./GetFolloweesImages')
const Follow = require('./Follow')
const Unfollow = require('./Unfollow')
const GetFollowings = require('./GetFollowings')

// combine all routes 
router.use(GetFolloweesImages);
router.use(Follow);
router.use(Unfollow);
router.use(GetFollowings);

module.exports = router;