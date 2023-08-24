// Property Controller
const Property_Service = require('../service/property.js')
const Response_Helper = require('../util/responseHelper.js')
const logger = require('../config/logger.js')

module.exports = class Property_Controller {
    /**
     * @description - Property Controllers
     */

    /**
     * @description - create property controller
     * @param {object} req - the object request
     * @param {object} res - the object response
     * @returns - returns a success response
     */
    static async createPropertyForm(req, res) {
        try {
            const result = await Property_Service.createPropertyForm(
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
                `Property_Controller_createPropertyForm -> Info : created a new property : ${JSON.stringify(
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
                `Property_Controller_createPropertyForm -> Error: ${error}`
            )
            return Response_Helper.errorResponse(
                res,
                500,
                'Oops something went wrong'
            )
        }
    }

    /**
     * @description - update property by id controller
     * @param {object} req - the object request
     * @param {object} res - the object response
     * @returns - returns a success response
     */
    static async updatePropertyById(req, res) {
        try {
            const result = await Property_Service.updatePropertyById(
                req.body,
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
                `Property_Controller_updatePropertyById -> Info : updated successfully : ${JSON.stringify(
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
                `Property_Controller_updatePropertyById -> Error: ${error.message}`
            )
            return Response_Helper.errorResponse(
                res,
                500,
                'Oops something went wrong'
            )
        }
    }

    /**
     * @description - delete property by id controller
     * @param {object} req - the object request
     * @param {object} res - the object response
     * @returns - returns a success response
     */
    static async deletePropertyById(req, res) {
        try {
            const result = await Property_Service.deletePropertyById(
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
                `Property_Controller_deletePropertyById -> Info : deleted successfully : ${JSON.stringify(
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
                `Property_Controller_deletePropertyById -> Error: ${error.message}`
            )
            return Response_Helper.errorResponse(
                res,
                500,
                'Oops something went wrong'
            )
        }
    }

    /**
     * @description - add property to favorites list controller
     * @param {object} req - the object request
     * @param {object} res - the object response
     * @returns - returns a success response
     */
    static async addPropertyToFavorites(req, res) {
        try {
            const result = await Property_Service.addPropertyToFavorites(
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
                `User_Controller_addToFavorites -> Info : property add to favorites : ${JSON.stringify(
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
                `User_Controller_addPropertyToFavorites -> Error : ${err.message}`
            )
            return Response_Helper.errorResponse(
                res,
                500,
                'Oops something went wrong!'
            )
        }
    }

    /**
     * @description - remove property from favorites list controller
     * @param {object} req - the object request
     * @param {object} res - the object response
     * @returns - returns a success response
     */
    static async removeFromFavorites(req, res) {
        try {
            const result = await Property_Service.removeFromFavorites(
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
                `User_Controller_removeFromFavorites -> Info : property removed from favorites : ${JSON.stringify(
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
                `User_Controller_removeFromFavorites -> Error : ${err.message}`
            )
            return Response_Helper.errorResponse(
                res,
                500,
                'Oops something went wrong!'
            )
        }
    }

    /**
     * @description - upload images to property by id controller
     * @param {object} req - the object request
     * @param {object} res - the object response
     * @returns - returns a success response
     */
    static async uploadImagesToAPropertyById(req, res) {
        try {
            const result = await Property_Service.uploadImagesToAPropertyById(
                req.params,
                req.user,
                req.files
            )

            if (result.statusCode == 409)
                return Response_Helper.errorResponse(
                    res,
                    result.statusCode,
                    result.message
                )

            logger.info(
                `Property_Controller_uploadImages -> Info : successfully uploaded : ${JSON.stringify(
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
                `Property_Controller_uploadImagesToAPropertyById -> Error: ${error.message}`
            )
            return Response_Helper.errorResponse(
                res,
                500,
                'Oops something went wrong'
            )
        }
    }

    /**
     * @description - update images to a property by id controller
     * @param {object} req - the object request
     * @param {object} res - the object response
     * @returns - returns a success response
     */
    static async updateImagesToAPropertyById(req, res) {
        try {
            const result = await Property_Service.updateImagesToAPropertyById(
                req.params,
                req.user,
                req.files
            )

            if (result.statusCode == 409)
                return Response_Helper.errorResponse(
                    res,
                    result.statusCode,
                    result.message
                )

            logger.info(
                `Property_Controller_updateImages -> Info : successfully updated : ${JSON.stringify(
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
                `Property_Controller_updateImagesToAPropertyById -> Error: ${error.message}`
            )
            return Response_Helper.errorResponse(
                res,
                500,
                'Oops something went wrong'
            )
        }
    }

    /**
     * @description - delete images to a property by id controller
     * @param {object} req - the object request
     * @param {object} res - the object response
     * @returns - returns a success response
     */
    static async deleteAllImagesToAPropertyById(req, res) {
        try {
            const result =
                await Property_Service.deleteAllImagesToAPropertyById(
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
                `Property_Controller_deleteAllImagesToAPropertyById -> Info : successfully deleted : ${JSON.stringify(
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
                `Property_Controller_deleteAllImagesToAPropertyById -> Error: ${error.message}`
            )
            return Response_Helper.errorResponse(
                res,
                500,
                'Oops something went wrong'
            )
        }
    }

    /**
     * @description - add a review to a property controller
     * @param {object} req - the object request
     * @param {object} res - the object response
     * @returns - returns a success response
     */
    static async addAReviewToAProperty(req, res) {
        try {
            const result = await Property_Service.addAReviewToAProperty(
                req.params,
                req.user,
                req.body
            )

            if (result.statusCode == 409)
                return Response_Helper.errorResponse(
                    res,
                    result.statusCode,
                    result.message
                )

            logger.info(
                `Property_Controller_addAReviewAProperty -> Info : review successfully added : ${JSON.stringify(
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
                `Property_Controller_addAReviewAProperty -> Error: ${error.message}`
            )
            return Response_Helper.errorResponse(
                res,
                500,
                'Oops something went wrong'
            )
        }
    }

    /**
     * @description - update review to a property controller
     * @param {object} req - the object request
     * @param {object} res - the object response
     * @returns - returns a success response
     */
    static async updateReviewToAProperty(req, res) {
        try {
            const result = await Property_Service.updateReviewToAProperty(
                req.params,
                req.user,
                req.body
            )

            if (result.statusCode == 409)
                return Response_Helper.errorResponse(
                    res,
                    result.statusCode,
                    result.message
                )

            logger.info(
                `Property_Controller_updateReviewToAProperty -> Info : review successfully updated : ${JSON.stringify(
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
                `Property_Controller_updateReviewToAProperty -> Error: ${error.message}`
            )
            return Response_Helper.errorResponse(
                res,
                500,
                'Oops something went wrong'
            )
        }
    }

    /**
     * @description - delete review to a property controller
     * @param {object} req - the object request
     * @param {object} res - the object response
     * @returns - returns a success response
     */
    static async deleteReviewToAProperty(req, res) {
        try {
            const result = await Property_Service.deleteReviewToAProperty(
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
                `Property_Controller_deleteReviewToAProperty -> Info :  ${JSON.stringify(
                    result.message
                )}`
            )

            return Response_Helper.successResponse(
                res,
                result.statusCode,
                result.message
            )
        } catch (error) {
            logger.error(
                `Property_Controller_deleteReviewToAProperty -> Error: ${error.message}`
            )
            return Response_Helper.errorResponse(
                res,
                500,
                'Oops something went wrong'
            )
        }
    }
}
