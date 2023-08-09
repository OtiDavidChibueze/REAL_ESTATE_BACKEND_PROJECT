// User Controller
import User_Service from '../service/user.js';
import Response_Helper from '../util/responseHelper.js'
import logger from '../config/logger.js'

class User_Controller {

    static async registerUser(req, res) {

        try {
            const data = req.body;

            const result = await User_Service.registerUser(data);

            if (result.statusCode == 409) return Response_Helper.errorResponse(res, result.statusCode, result.message);

            logger.info(`User_Controller_registerUser -> Info : user created successfully : ${JSON.stringify(result.data)}`);

            return Response_Helper.successResponse(res, result.statusCode, result.message, result.data);
        } catch (err) {
            logger.error(`User_Controller_registerUser -> Error : ${err.message}`);
            return Response_Helper.errorResponse(res, 500, 'Oops something went wrong!');
        }
    }

    static async signIn(req, res) {

        try {
            const result = await User_Service.signIn(req.body, req.user);

            if (result.statusCode == 409) return Response_Helper.errorResponse(res, result.statusCode, result.message);

            logger.info(`User_Controller_signIn -> Info : user created successfully : ${JSON.stringify(result.data)}`);

            return Response_Helper.successResponse(res, result.statusCode, result.message, result.data);
        } catch (err) {
            logger.error(`User_Controller_signIn -> Error : ${err.message}`);
            return Response_Helper.errorResponse(res, 500, 'Oops something went wrong!');
        }
    }

    static async updateYourProfile(req, res) {

        try {
            const result = await User_Service.updateYourProfile(req.body, req.user, req.file);

            if (result.statusCode == 409) return Response_Helper.errorResponse(res, result.statusCode, result.message);

            logger.info(`User_Controller_updateYourProfile -> Info : successfully updated your Profile : ${JSON.stringify(result.data)}`);

            return Response_Helper.successResponse(res, result.statusCode, result.message, result.data);
        } catch (err) {
            logger.error(`User_Controller_updateYourProfile -> Error : ${err.message}`);
            return Response_Helper.errorResponse(res, 500, 'Oops something went wrong!');
        }
    }

    static async deleteYourAccount(req, res) {

        try {
            const data = req.user;

            const result = await User_Service.deleteYourAccount(data);

            if (result.statusCode == 409) return Response_Helper.errorResponse(res, result.statusCode, result.message);

            logger.info(`User_Controller_deleteYourAccount -> Info : ${JSON.stringify(result.message)}`);

            return Response_Helper.successResponse(res, result.statusCode, result.message);
        } catch (err) {
            logger.error(`User_Controller_deleteYourAccount -> Error : ${err.message}`);
            return Response_Helper.errorResponse(res, 500, 'Oops something went wrong!');
        }
    }

    static async search_for_users_with_username_or_role(req, res) {
        try {
            const result = await User_Service.search_for_users_with_username_or_role(req);

            if (result.statusCode == 409) return Response_Helper.errorResponse(res, result.statusCode, result.message);

            logger.info(`User_Controller_search_for_users_with_username_or_role -> Info : fetched your search  : ${JSON.stringify(result.data)}`)

            return Response_Helper.successResponse(res, result.statusCode, result.message, result.data);

        } catch (error) {
            logger.error(`User_Controller_deleteYourAccount -> Error : ${error.message}`);
            return Response_Helper.errorResponse(res, 500, 'Oops something went wrong!');
        }
    }

    static async uploadYourProfilePicture(req, res) {

        try {
            const result = await User_Service.uploadYourProfilePicture(req.params, req.user, req.file)

            if (result.statusCode == 409) return Response_Helper.errorResponse(res, result.statusCode, result.message);

            logger.info(`User_Controller_uploadYourProfilePicture -> Info : profile picture uploaded : ${JSON.stringify(result.data)}`)

            return Response_Helper.successResponse(res, result.statusCode, result.message, result.data);


        } catch (err) {
            logger.error(`User_Controller_uploadYourProfilePicture -> Error : ${err.message}`);
            return Response_Helper.errorResponse(res, 500, 'Oops something went wrong!');
        }

    }

    static async updateYourProfilePicture(req, res) {

        try {
            const result = await User_Service.updateYourProfilePicture(req.user, req.file)

            if (result.statusCode == 409) return Response_Helper.errorResponse(res, result.statusCode, result.message);

            logger.info(`User_Controller_updateYourProfilePicture -> Info : profile pic updated  : ${JSON.stringify(result.data)}`)

            return Response_Helper.successResponse(res, result.statusCode, result.message, result.data);


        } catch (err) {
            logger.error(`User_Controller_updateYourProfilePicture -> Error : ${err.message}`);
            return Response_Helper.errorResponse(res, 500, 'Oops something went wrong!');
        }

    }
}

export default User_Controller;