// User Routes
const { Router } = require('express')
const router = new Router()
const User_Controller = require('../controller/user.js')
const Authorization = require('../middleware/authorization.js')
const { upload } = require('../util/multer.js')

// get
router.get(
    '/search/for/users',
    Authorization,
    User_Controller.search_for_users_with_username_or_role
)

// post
router.post('/signUp', User_Controller.registerUser)
router.post('/signIn', User_Controller.signIn)
router.post(
    '/:id/upload/profile/picture',
    Authorization,
    upload.single('image'),
    User_Controller.uploadYourProfilePicture
)
router.post(
    '/:id/add/to/favorites',
    Authorization,
    User_Controller.addToFavorites
)
router.post(
    '/:id/remove/from/favorites',
    Authorization,
    User_Controller.removeFromFavorites
)

// put
router.put(
    '/update/your/profile',
    Authorization,
    User_Controller.updateYourProfile
)
router.put(
    '/update/your/profile/picture',
    Authorization,
    upload.single('image'),
    User_Controller.updateYourProfilePicture
)

// delete
router.delete(
    '/delete/your/account',
    Authorization,
    User_Controller.deleteYourAccount
)

//TODO remember to create : forgot password, reset password , get a user by id, update a user by id, delete a user by id

module.exports = router
