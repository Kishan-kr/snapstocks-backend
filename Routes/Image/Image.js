const router = require('express').Router()
const PostImage = require('./PostImage')
const GetUserImages = require('./GetUserImages')
const GetImageById = require('./GetImageById')
const GetImages = require('./GetImages')
const DeleteImage = require('./DeleteImage')
const UpdateImage = require('./UpdateImage')
const LikeImage = require('./LikeImage')
const DownloadImage = require('./DownloadImage')
const CountImages = require('./CountImages')

router.use(PostImage);
router.use(GetUserImages);
router.use(GetImageById);
router.use(GetImages);
router.use(DeleteImage);
router.use(UpdateImage);
router.use(LikeImage);
router.use(DownloadImage);
router.use(CountImages);

module.exports = router;