const router = require('express').Router()
const PostUser = require('./PostUser')
const GetUser = require('./GetUser')
const LoginUser = require('./LoginUser')
const UpdateUser = require('./UpdateUser')

// combine different routes to single route
router.use(PostUser);
router.use(GetUser);
router.use(LoginUser);
router.use(UpdateUser);

// export router object 
module.exports = router;