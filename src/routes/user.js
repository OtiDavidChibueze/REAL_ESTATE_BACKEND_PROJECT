// User Routes
const { Router } = require('express')
const router = new Router()
const User_Controller = require('../controller/user.js')
const Authorization = require('../middleware/authorization.js')
const { upload } = require('../util/multer.js')
const SchemaValidationHelper = require('../validation/schemaValidationHelper.js')
const {
    userInputs,
    validateInput,
    validateUpdateInput,
    validateYourInput,
    validateResetInput,
} = require('../validation/schema/user.js')

// Get
router.get('/:id/get/a/user', Authorization, User_Controller.getAUserById)
router.get(
    '/search/for/users',
    Authorization,
    User_Controller.search_for_users_with_username_or_role
)
router.get('/getProfile', Authorization, User_Controller.getProfile)
router.get('/all/admins', Authorization, User_Controller.getAllAdmins)
router.get('/all/agents', Authorization, User_Controller.getAllAgents)

// Post
router.post(
    '/signUp',
    SchemaValidationHelper.validate(userInputs),
    User_Controller.registerUser
)
router.post('/signIn', User_Controller.signIn)
router.post('/logOut', User_Controller.logOut)
router.post(
    '/upload/profile/picture',
    Authorization,
    upload.single('image'),
    User_Controller.uploadYourProfilePicture
)
router.post('/forgotten/password', User_Controller.forgottenPassword)

// Put
router.put(
    '/update/your/profile',
    Authorization,
    SchemaValidationHelper.validate(validateYourInput),
    User_Controller.updateYourProfile
)
router.put(
    '/:id/update',
    Authorization,
    SchemaValidationHelper.validate(validateUpdateInput),
    User_Controller.updateUserById
)
router.put(
    '/update/your/profile/picture',
    Authorization,
    upload.single('image'),
    User_Controller.updateYourProfilePicture
)
router.put(
    '/change/password',
    Authorization,
    SchemaValidationHelper.validate(validateInput),
    User_Controller.changePassword
)
router.put(
    '/reset/:id/password',
    SchemaValidationHelper.validate(validateResetInput),
    User_Controller.resetPassword
)

// Delete
router.delete(
    '/delete/your/account',
    Authorization,
    User_Controller.deleteYourAccount
)
router.delete('/:id/delete', Authorization, User_Controller.deleteAUserById)

module.exports = router
