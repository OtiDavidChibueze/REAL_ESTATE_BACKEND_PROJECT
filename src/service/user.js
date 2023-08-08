// User Service
import User_Model from '../model/user.js';
import Helper_Function from '../util/helperFunction.js';
import Response_Helper from '../util/responseHelper.js';
import Token from '../util/token.js'
import InvalidTokenModel from '../model/invalidTokens.js';
import logger from '../config/logger.js'




class User_Service {

    static async registerUser(data) {
        try {
            // getting the details from the data
            const { username, email, password } = data;

            // checking if the already exists 
            const userExists = await User_Model.findOne({ email: email });
            // if the user already exists 
            if (userExists) return {
                statusCode: 406,
                message: 'email already exists  , user already registered'
            }

            // hash the user password
            const hashPassword = Helper_Function.hashPassword(password);

            // create a new user and save the changes
            const newUser = await new User_Model({
                username,
                email,
                password: hashPassword
            }).save();

            // return a success message
            return {
                statusCode: 201,
                message: 'User created successfully',
                data: { user: newUser }
            }
        } catch (err) {
            logger.error(`User_Service_registerUser -> Error : ${err.message}`);
        }
    }

    static async signIn(data) {
        try {
            // getting the details from the data;
            const { email, password } = data;

            // checking if the user exists 
            const user = await User_Model.findOne({ email: email });

            // if the user doesn't exists or the password is incorrect
            if (!user) return {
                statusCode: 404,
                message: 'incorrect email'
            }

            // checking if the password is the same 
            const oldPassword = Helper_Function.comparePassword(password, user.password);
            // if the password is incorrect
            if (!oldPassword) return {
                statusCode: 404,
                message: 'incorrect password'
            }

            // if the password and email are correct..  generate a login in token for the user
            const generateToken = Token.generateToken(user);

            // checking if the invalid ...
            const invalidToken = await InvalidTokenModel.findOne({ generateToken })
            // if yes ....
            if (invalidToken) return {
                statusCode: 403,
                message: 'invalid token , pls login'
            };

            // send a success response after logging in
            return {
                statusCode: 200,
                message: 'logged in',
                data: { user: user.email, accessToken: generateToken }
            }


        } catch (err) {
            logger.error(`User_Service_signIn -> Error : ${err.message}`);
        }
    }

    static async updateYourProfile(data, req) {

        try {
            // getting the details from the data
            const { username, email } = data;

            // getting the logged in user _id
            const { _id } = req.user;

            // looking for the current user and update his profile
            const currentUser = await User_Model.findByIdAndUpdate(_id, data, { new: true });

            if (currentUser.id !== _id) return {
                statusCode: 401,
                message: 'Unauthorized to update this profile'
            }

            // sending back the updated user to the client side
            return {
                statusCode: 200,
                message: 'successfully Updated your Profile ',
                data: { updated: currentUser },
            }
        } catch (err) {
            logger.error(`User_Service_updateYourProfile -> Error : ${err.message}`);
        }
    }

    static async deleteYourAccount(data) {

        try {
            // getting the logged in user _id
            const { _id } = data;

            // looking for the current user and update his profile
            const currentUser = await User_Model.findByIdAndDelete(_id);

            if (currentUser.id !== _id) return {
                statusCode: 401,
                message: 'Unauthorized to delete this account'
            }

            // sending back the updated user to the client side
            return {
                statusCode: 200,
                message: 'successfully deleted your account ',
            }
        } catch (err) {
            logger.error(`User_Service_deleteYourAccount -> Error : ${err.message}`);
        }
    }

    static async getAllAdmins() {
        const admins = await User_Model.find({ role: 'admin' });

        const counts = admins.length;

        if (!admins) return {
            statusCode: 200,
            message: { admins: [], counts: 0 }
        }

        return {
            statusCode: 200,
            message: 'fetched all admins',
            data: { admins, counts }
        }
    }

    static async search_for_users_with_username_or_role(req) {

        try {
            const options = {
                page: req.query.page ? parseInt(req.query.page) : 1,
                limit: req.query.page ? parseInt(req.query.limit) : 20,
                sort: { 'createdAt': -1 }
            };

            const username = req.query.username;
            const role = req.query.role;

            const query = {};

            if (username) {
                query.username = { $regex: username, $options: 'i' }
            } else if (role) {
                query.role = { $regex: role }
            } else {
                query;
            }

            const result = await User_Model.paginate(query, options);

            const baseUrl = req.baseUrl
            const hasNextPage = result.hasNextPage ? `${baseUrl}?page=${result.nextPage}` : null
            const hasPrevPage = result.hasPrevPage ? `${baseUrl}?page=${result.prevPage}` : null

            return {
                statusCode: 200,
                message: 'fetched successfully',
                data: { user: result, hasNextPage, hasPrevPage }
            }
        } catch (err) {
            logger.error(`User_Service_getAllUsers -> Error : ${err.message}`);
        }
    }




}

export default User_Service;