const router = require('express').Router()
const PostUser = require('./PostUser')

// combine different routes to single route
router.use(PostUser);

// export router object 
module.exports = router;