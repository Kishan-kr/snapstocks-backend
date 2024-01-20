const router = require('express').Router()
const SignupUser = require('./SignupUser')
const GetUser = require('./GetUser')
const LoginUser = require('./LoginUser')
const UpdateUser = require('./UpdateUser')

// combine different routes to single route
router.use(SignupUser);
router.use(GetUser);
router.use(LoginUser);
router.use(UpdateUser);

// export router object 
module.exports = router;