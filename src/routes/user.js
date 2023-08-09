// User Routes
import { Router } from 'express';
const router = new Router();
import User_Controller from '../controller/user.js';
import Authorization from '../middleware/authorization.js'
import upload from '../util/multer.js';

// get
router.get('/search/for/users', Authorization, User_Controller.search_for_users_with_username_or_role);

// post
router.post('/signUp', User_Controller.registerUser)
router.post('/signIn', User_Controller.signIn)
router.post('/:id/upload/profile/picture', Authorization, upload.single('image'), User_Controller.uploadYourProfilePicture)

// put
router.put('/update/your/profile', Authorization, User_Controller.updateYourProfile)
router.put('/:id/update/profile/picture', Authorization, upload.single('image'), User_Controller.updateYourProfilePicture)

// delete
router.delete('/delete/your/account', Authorization, User_Controller.deleteYourAccount)

//TODO
// forgot password
// reset password
// get a user by id
// update a user by id
// delete a user by id



export default router;