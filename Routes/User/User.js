const router = require('express').Router()
const PostUser = require('./PostUser')
const GetUser = require('./GetUser')
const FetchUser = require('./FetchUser')
const UpdateUser = require('./UpdateUser')

// combine different routes to single route
router.use(PostUser);
router.use(GetUser);
router.use(FetchUser);
router.use(UpdateUser);

// export router object 
module.exports = router;