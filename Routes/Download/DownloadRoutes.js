const router = require('express').Router()

// import all routes 
const GetDownloads = require('./GetDownloads');

// combine all routes 
router.use(GetDownloads);

module.exports = router;