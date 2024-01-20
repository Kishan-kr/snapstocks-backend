const router = require('express').Router()

// import routes 
const CreateCollection = require('./CreateCollection');
const UpdateCollection = require('./UpdateCollection');
const GetCollectionById = require('./GetCollectionById');
const GetCollections = require('./GetCollections');
const DeleteCollection = require('./DeleteCollection');
const EditCollection = require('./EditCollection');
const GetImagesOfCollection = require('./GetImagesOfCollection');
const SearchCollections = require('./SearchCollections');
const CountSearchedCollections = require('./CountSearchedCollections');


// combine all collection routes 
router.use(CreateCollection);
router.use(UpdateCollection);
router.use(GetCollectionById);
router.use(GetCollections);
router.use(DeleteCollection);
router.use(EditCollection);
router.use(GetImagesOfCollection);
router.use(SearchCollections);
router.use(CountSearchedCollections);

module.exports = router;