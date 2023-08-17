// Property Controller
const Property_Service = require('../service/property.js')
const Response_Helper = require('../util/responseHelper.js')
const logger = require('../config/logger.js')

module.exports = class Property_Controller {
    /**
     *
     * @param {*} req
     * @param {*} res
     * @returns
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
     *
     * @param {*} req
     * @param {*} res
     * @returns
     */
    static async updatePropertyById(req, res) {
        try {
            const result = await Property_Service.updatePropertyById(
                data,
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
     *
     * @param {*} req
     * @param {*} res
     * @returns
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
     *
     * @param {*} req
     * @param {*} res
     * @returns
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
     *
     * @param {*} req
     * @param {*} res
     * @returns
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
     *
     * @param {*} req
     * @param {*} res
     * @returns
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
}
