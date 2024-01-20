const authenticate = require('../../Middlewares/Authenticate');
const Image = require('../../Models/Image');
const User = require('../../Models/User');
const UserImageLike = require('../../Models/UserImageLike');
const router = require('express').Router();

//@description     Like an image
//@route           PUT /api/images/imageid/like?like=1 | 0
//@access          Protected
router.put('/:id/like', authenticate, async (req, res) => {
  const userId = req.user.id;
  const imageId = req.params.id;

  try {
    const image = await Image.findById(imageId);
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    if(Number(req.query.like) === 1) {
      // Increment likes count of image
      image.likes += 1;
      await image.save();
      
      // Create a new Like document
      const userImageLike = new UserImageLike({
        user: userId,
        image: image._id
      });
      await userImageLike.save();

      // Increment image like count of user 
      const userWhoLike = await User.findById(userId).select('imageLikeCount');
      userWhoLike.imageLikeCount += 1;
      await userWhoLike.save();

      return res.status(200).json({ message: 'Liked' });
    }
    else if(Number(req.query.like) === 0) {
      // Decrement likes count of image
      image.likes -= 1;
      await image.save();
      
      // Delete Liked document
      await UserImageLike.findOneAndDelete({
        user: userId,
        image: image._id
      });

      // Decrement image like count of user 
      const userWhoLike = await User.findById(userId).select('imageLikeCount');
      userWhoLike.imageLikeCount -= 1;
      await userWhoLike.save();
      
      return res.status(200).json({ message: 'Unliked' });
    }

  } catch (error) {
    console.error('Error liking image:', error);
    res.status(500).json({ error: 'Server error' });
  }

})

module.exports = router;