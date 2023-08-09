const router = require('express').Router()
const PostImage = require('./PostImage')
const GetUserImages = require('./GetUserImages')
const DeleteImage = require('./DeleteImage')
const UpdateImage = require('./UpdateImage')
const LikeImage = require('./LikeImage')
const DownloadImage = require('./DownloadImage')
const ViewImage = require('./ViewImage')

router.use(PostImage);
router.use(GetUserImages);
router.use(DeleteImage);
router.use(UpdateImage);
router.use(LikeImage);
router.use(DownloadImage);
router.use(ViewImage);

module.exports = router;