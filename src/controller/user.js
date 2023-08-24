// User Controller
const User_Service = require('../service/user.js')
const Response_Helper = require('../util/responseHelper.js')
const logger = require('../config/logger.js')

module.exports = class User_Controller {
    /**
     * @description - User Controller Endpoints
     */

    /**
     * @description - get user by id controller
     * @param {object} req - the object request
     * @param {object} res - the object response
     * @returns - returns a success response
     */
    static async getAUserById(req, res) {
        try {
            const result = await User_Service.getAUserById(req.params)

            if (result.statusCode == 409)
                return Response_Helper.errorResponse(
                    res,
                    result.statusCode,
                    result.message
                )

            logger.info(
                `User_Controller_getAUserById -> Info : successfully fetched user : ${JSON.stringify(
                    result.data
                )}`
            )

            return Response_Helper.successResponse(
                res,
                result.statusCode,
                result.message,
                result.data
            )
        } catch (err) {
            logger.error(
                `User_Controller_getAUserById -> Error : ${err.message}`
            )
            return Response_Helper.errorResponse(
                res,
                500,
                'Oops something went wrong!'
            )
        }
    }

    /**
     * @description - get all admins controller
     * @param {object} req - the object request
     * @param {object} res - the object response
     * @returns - returns a success response
     */
    static async getAllAdmins(req, res) {
        try {
            const result = await User_Service.getAllAdmins(req.user)

            if (result.statusCode == 409)
                return Response_Helper.errorResponse(
                    res,
                    result.statusCode,
                    result.message
                )

            logger.info(
                `User_Controller_getAUserById -> Info : successfully fetched all admins : ${JSON.stringify(
                    result.data
                )}`
            )

            return Response_Helper.successResponse(
                res,
                result.statusCode,
                result.message,
                result.data
            )
        } catch (err) {
            logger.error(
                `User_Controller_getAllAdmins -> Error : ${err.message}`
            )
            return Response_Helper.errorResponse(
                res,
                500,
                'Oops something went wrong!'
            )
        }
    }

    /**
     * @description - get all agents controller
     * @param {object} req - the object request
     * @param {object} res - the object response
     * @returns - returns a success response
     */
    static async getAllAgents(req, res) {
        try {
            const result = await User_Service.getAllAgents(req.user)

            if (result.statusCode == 409)
                return Response_Helper.errorResponse(
                    res,
                    result.statusCode,
                    result.message
                )

            logger.info(
                `User_Controller_getAUserById -> Info : successfully fetched all agents : ${JSON.stringify(
                    result.data
                )}`
            )

            return Response_Helper.successResponse(
                res,
                result.statusCode,
                result.message,
                result.data
            )
        } catch (err) {
            logger.error(
                `User_Controller_getAllAgents -> Error : ${err.message}`
            )
            return Response_Helper.errorResponse(
                res,
                500,
                'Oops something went wrong!'
            )
        }
    }

    /**
     * @description - register a user controller
     * @param {object} req - the object request
     * @param {object} res - the object response
     * @returns - returns a success response
     */
    static async registerUser(req, res) {
        try {
            const result = await User_Service.registerUser(req.body)

            if (result.statusCode == 409)
                return Response_Helper.errorResponse(
                    res,
                    result.statusCode,
                    result.message
                )

            logger.info(
                `User_Controller_registerUser -> Info : user created successfully : ${JSON.stringify(
                    result.data
                )}`
            )

            return Response_Helper.successResponse(
                res,
                result.statusCode,
                result.message,
                result.data
            )
        } catch (err) {
            logger.error(
                `User_Controller_registerUser -> Error : ${err.message}`
            )
            return Response_Helper.errorResponse(
                res,
                500,
                'Oops something went wrong!'
            )
        }
    }

    /**
     * @description - login user controller
     * @param {object} req - the object request
     * @param {object} res - the object response
     * @returns - returns a success response
     */
    static async signIn(req, res) {
        try {
            const result = await User_Service.signIn(req.body, req.user)

            if (result.statusCode == 409)
                return Response_Helper.errorResponse(
                    res,
                    result.statusCode,
                    result.message
                )

            logger.info(
                `User_Controller_signIn -> Info : user successfully logged in : ${JSON.stringify(
                    result.data
                )}`
            )

            return Response_Helper.successResponse(
                res,
                result.statusCode,
                result.message,
                result.data
            )
        } catch (err) {
            logger.error(`User_Controller_signIn -> Error : ${err.message}`)
            return Response_Helper.errorResponse(
                res,
                500,
                'Oops something went wrong!'
            )
        }
    }

    /**
     * @description - update your profile controller
     * @param {object} req - the object request
     * @param {object} res - the object response
     * @returns - returns a success response
     */
    static async updateYourProfile(req, res) {
        try {
            const result = await User_Service.updateYourProfile(
                req.body,
                req.user
            )

            if (result.statusCode == 409)
                return Response_Helper.errorResponse(
                    res,
                    result.statusCode,
                    result.message
                )

            logger.info(
                `User_Controller_updateYourProfile -> Info : successfully updated your Profile : ${JSON.stringify(
                    result.data
                )}`
            )

            return Response_Helper.successResponse(
                res,
                result.statusCode,
                result.message,
                result.data
            )
        } catch (err) {
            logger.error(
                `User_Controller_updateYourProfile -> Error : ${err.message}`
            )
            return Response_Helper.errorResponse(
                res,
                500,
                'Oops something went wrong!'
            )
        }
    }

    /**
     * @description - delete your account controller
     * @param {object} req - the object request
     * @param {object} res - the object response
     * @returns - returns a success response
     */
    static async deleteYourAccount(req, res) {
        try {
            const data = req.user

            const result = await User_Service.deleteYourAccount(data)

            if (result.statusCode == 409)
                return Response_Helper.errorResponse(
                    res,
                    result.statusCode,
                    result.message
                )

            logger.info(
                `User_Controller_deleteYourAccount -> Info : ${JSON.stringify(
                    result.message
                )}`
            )

            return Response_Helper.successResponse(
                res,
                result.statusCode,
                result.message
            )
        } catch (err) {
            logger.error(
                `User_Controller_deleteYourAccount -> Error : ${err.message}`
            )
            return Response_Helper.errorResponse(
                res,
                500,
                'Oops something went wrong!'
            )
        }
    }

    /**
     * @description - search users by username or role controller
     * @param {object} req - the object request
     * @param {object} res - the object response
     * @returns - returns a success response
     */
    static async search_for_users_with_username_or_role(req, res) {
        try {
            const result =
                await User_Service.search_for_users_with_username_or_role(req)

            if (result.statusCode == 409)
                return Response_Helper.errorResponse(
                    res,
                    result.statusCode,
                    result.message
                )

            logger.info(
                `User_Controller_search_for_users_with_username_or_role -> Info : fetched your requests  : ${JSON.stringify(
                    result.data
                )}`
            )

            return Response_Helper.successResponse(
                res,
                result.statusCode,
                result.message,
                result.data
            )
        } catch (error) {
            logger.error(
                `User_Controller_search_for_users_with_username_or_role -> Error : ${error.message}`
            )
            return Response_Helper.errorResponse(
                res,
                500,
                'Oops something went wrong!'
            )
        }
    }

    /**
     * @description - upload your profile picture controller
     * @param {object} req - the object request
     * @param {object} res - the object response
     * @returns - returns a success response
     */
    static async uploadYourProfilePicture(req, res) {
        try {
            const result = await User_Service.uploadYourProfilePicture(
                req.user,
                req.file
            )

            if (result.statusCode == 409)
                return Response_Helper.errorResponse(
                    res,
                    result.statusCode,
                    result.message
                )

            logger.info(
                `User_Controller_uploadYourProfilePicture -> Info : profile picture successfully uploaded : ${JSON.stringify(
                    result.data
                )}`
            )

            return Response_Helper.successResponse(
                res,
                result.statusCode,
                result.message,
                result.data
            )
        } catch (err) {
            logger.error(
                `User_Controller_uploadYourProfilePicture -> Error : ${err.message}`
            )
            return Response_Helper.errorResponse(
                res,
                500,
                'Oops something went wrong!'
            )
        }
    }

    /**
     * @description - update your profile picture controller
     * @param {object} req - the object request
     * @param {object} res - the object response
     * @returns - returns a success response
     */
    static async updateYourProfilePicture(req, res) {
        try {
            const result = await User_Service.updateYourProfilePicture(
                req.user,
                req.file
            )
            if (result.statusCode == 409)
                return Response_Helper.errorResponse(
                    res,
                    result.statusCode,
                    result.message
                )

            logger.info(
                `User_Controller_updateYourProfilePicture -> Info : profile picture successfully updated : ${JSON.stringify(
                    result.data
                )}`
            )

            return Response_Helper.successResponse(
                res,
                result.statusCode,
                result.message,
                result.data
            )
        } catch (err) {
            logger.error(
                `User_Controller_updateYourProfilePicture -> Error : ${err.message}`
            )
            return Response_Helper.errorResponse(
                res,
                500,
                'Oops something went wrong!'
            )
        }
    }

    /**
     * @description - update user by id controller
     * @param {object} req - the object request
     * @param {object} res - the object response
     * @returns - returns a success response
     */
    static async updateUserById(req, res) {
        try {
            const result = await User_Service.updateUserById(
                req.body,
                req.user,
                req.params
            )

            if (result.statusCode == 409)
                return Response_Helper.errorResponse(
                    res,
                    result.statusCode,
                    result.message
                )

            logger.info(
                `User_Controller_updateUserById -> Info : user updated successfully : ${JSON.stringify(
                    result.data
                )}`
            )

            return Response_Helper.successResponse(
                res,
                result.statusCode,
                result.message,
                result.data
            )
        } catch (err) {
            logger.error(
                `User_Controller_updateUserById -> Error : ${err.message}`
            )
            return Response_Helper.errorResponse(
                res,
                500,
                'Oops something went wrong!'
            )
        }
    }

    /**
     * @description - get profile controller
     * @param {object} req - the object request
     * @param {object} res - the object response
     * @returns - returns a success response
     */
    static async getProfile(req, res) {
        try {
            const result = await User_Service.getProfile(req.user)

            if (result.statusCode == 409)
                return Response_Helper.errorResponse(
                    res,
                    result.statusCode,
                    result.message
                )

            logger.info(
                `User_Controller_updateUserById -> Info : successfully fetched your profile : ${JSON.stringify(
                    result.data
                )}`
            )

            return Response_Helper.successResponse(
                res,
                result.statusCode,
                result.message,
                result.data
            )
        } catch (err) {
            logger.error(`User_Controller_getProfile -> Error : ${err.message}`)
            return Response_Helper.errorResponse(
                res,
                500,
                'Oops something went wrong!'
            )
        }
    }

    /**
     * @description - get user count controller
     * @param {object} req - the object request
     * @param {object} res - the object response
     * @returns - returns a success response
     */
    static async getUsersCounts(req, res) {
        try {
            const result = await User_Service.getUsersCounts(req.user)

            if (result.statusCode == 409)
                return Response_Helper.errorResponse(
                    res,
                    result.statusCode,
                    result.message
                )

            logger.info(
                `User_Controller_getUsersCounts -> Info : successfully fetched all users count : ${JSON.stringify(
                    result.data
                )}`
            )

            return Response_Helper.successResponse(
                res,
                result.statusCode,
                result.message,
                result.data
            )
        } catch (err) {
            logger.error(
                `User_Controller_getUsersCounts -> Error : ${err.message}`
            )
            return Response_Helper.errorResponse(
                res,
                500,
                'Oops something went wrong!'
            )
        }
    }

    /**
     * @description - delete user by id controller
     * @param {object} req - the object request
     * @param {object} res - the object response
     * @returns - returns a success response
     */
    static async deleteAUserById(req, res) {
        try {
            const result = await User_Service.deleteAUserById(
                req.params,
                req.user
            )

            if (result.statusCode == 409)
                return Response_Helper.errorResponse(
                    res,
                    result.statusCode,
                    result.message
                )

            logger.info(
                `User_Controller_getUsersCounts -> Info : successfully deleted this account : ${JSON.stringify(
                    result.data
                )}`
            )

            return Response_Helper.successResponse(
                res,
                result.statusCode,
                result.message,
                result.data
            )
        } catch (err) {
            logger.error(
                `User_Controller_deleteAUserById -> Error : ${err.message}`
            )
            return Response_Helper.errorResponse(
                res,
                500,
                'Oops something went wrong!'
            )
        }
    }

    /**
     * @description - change password controller
     * @param {object} req - the object request
     * @param {object} res - the object response
     * @returns - returns a success response
     */
    static async changePassword(req, res) {
        try {
            const result = await User_Service.changePassword(req.body, req.user)

            if (result.statusCode == 409)
                return Response_Helper.errorResponse(
                    res,
                    result.statusCode,
                    result.message
                )

            logger.info(
                `User_Controller_changePassword -> Info : ${JSON.stringify(
                    result.message
                )}`
            )

            return Response_Helper.successResponse(
                res,
                result.statusCode,
                result.message
            )
        } catch (err) {
            logger.error(
                `User_Controller_changePassword -> Error : ${err.message}`
            )
            return Response_Helper.errorResponse(
                res,
                500,
                'Oops something went wrong!'
            )
        }
    }

    /**
     * @description - forgotten password controller
     * @param {object} req - the object request
     * @param {object} res - the object response
     * @returns - returns a success response
     */
    static async forgottenPassword(req, res) {
        try {
            const result = await User_Service.forgottenPassword(req.body)

            if (result.statusCode == 409)
                return Response_Helper.errorResponse(
                    res,
                    result.statusCode,
                    result.message
                )

            logger.info(
                `User_Controller_forgottenPassword -> Info :  ${JSON.stringify(
                    result.message
                )}`
            )

            return Response_Helper.successResponse(
                res,
                result.statusCode,
                result.message
            )
        } catch (err) {
            logger.error(
                `User_Controller_forgottenPassword -> Error : ${err.message}`
            )
            return Response_Helper.errorResponse(
                res,
                500,
                'Oops something went wrong!'
            )
        }
    }

    /**
     * @description - reset password controller
     * @param {object} req - the object request
     * @param {object} res - the object response
     * @returns - returns a success response
     */
    static async resetPassword(req, res) {
        try {
            const result = await User_Service.resetPassword(
                req.params,
                req.body
            )

            if (result.statusCode == 409)
                return Response_Helper.errorResponse(
                    res,
                    result.statusCode,
                    result.message
                )

            logger.info(
                `User_Controller_resetPassword -> Info :  ${JSON.stringify(
                    result.message
                )}`
            )

            return Response_Helper.successResponse(
                res,
                result.statusCode,
                result.message,
                result.data
            )
        } catch (err) {
            logger.error(
                `User_Controller_resetPassword -> Error : ${err.message}`
            )
            return Response_Helper.errorResponse(
                res,
                500,
                'Oops something went wrong!'
            )
        }
    }

    /**
     * @description - log out users controller
     * @param {object} req - the object request
     * @param {object} res - the object response
     * @returns - returns a success response
     */
    static async logOut(req, res) {
        try {
            const result = await User_Service.logOut(req.headers)

            if (result.statusCode == 409)
                return Response_Helper.errorResponse(
                    res,
                    result.statusCode,
                    result.message
                )

            logger.info(
                `User_Controller_registerUser -> Info : ${JSON.stringify(
                    result.message
                )}`
            )

            return Response_Helper.successResponse(
                res,
                result.statusCode,
                result.message,
                result.data
            )
        } catch (err) {
            logger.error(`User_Controller_logOut -> Error : ${err.message}`)
            return Response_Helper.errorResponse(
                res,
                500,
                'Oops something went wrong!'
            )
        }
    }
}
