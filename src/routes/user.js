// User Routes
import { Router } from 'express';
const router = new Router();
import User_Controller from '../controller/user.js';
import Authorization from '../middleware/authorization.js'

// get
router.get('/search/for/users', Authorization, User_Controller.search_for_users_with_username_or_role);

// post
router.post('/signUp', User_Controller.registerUser)
router.post('/signIn', User_Controller.signIn)

// put
router.put('/update/your/profile', Authorization, User_Controller.updateYourProfile)

// delete
router.delete('/delete/your/account', Authorization, User_Controller.deleteYourAccount)

//TODO
// forgot password
// reset password
// get a user by id
// update a user by id
// delete a user by id



export default router;