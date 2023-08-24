// Payment Controller
const Payment_Service = require('../service/payment')
const logger = require('../config/logger')
const Response_Helper = require('../util/responseHelper')

module.exports = class Payment_Controller {
    static async initializePayment(req, res) {
        try {
            const result = await Payment_Service.initializePayment(
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
                `Payment_Controller_initializePayment -> Info : transfer queued successfully : ${JSON.stringify(
                    result.data
                )}`
            )

            return Response_Helper.successResponse(
                res,
                result.statusCode,
                result.message,
                result.data,
                result.link
            )
        } catch (err) {
            logger.error(
                `Property_Service_Payment_Service -> Error: ${err.message}`
            )
            return Response_Helper.errorResponse(
                res,
                500,
                'An error occurred during payment initiation'
            )
        }
    }

    static async verifyTransactionByRef_id(req, res) {
        try {
            const result = await Payment_Service.verifyTransactionByRef_id(
                req.params
            )

            if (result.statusCode == 409)
                return Response_Helper.errorResponse(
                    res,
                    result.statusCode,
                    result.message
                )

            logger.info(
                `Payment_Controller_verifyTransactionByRef_id -> Info : 'payment verification successful , payment confirmed',: ${JSON.stringify(
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
                `Property_Service_verifyTransactionByRef_id -> Error: ${err.message}`
            )
            return Response_Helper.errorResponse(
                res,
                500,
                'An error occurred during payment verification'
            )
        }
    }

    static async handleWebhookNotification(req, res) {
        try {
            const result = await Payment_Service.handleWebhookNotification(
                req.body,
                req.headers
            )

            if (result.statusCode == 409)
                return Response_Helper.errorResponse(
                    res,
                    result.statusCode,
                    result.message
                )

            logger.info(
                `Payment_Controller_handleWebhookNotification -> Info : 'payment verification successful , payment confirmed',: ${JSON.stringify(
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
                `Property_Service_handleWebhookNotification -> Error: ${err.message}`
            )
            return Response_Helper.errorResponse(
                res,
                500,
                'webhook processing error'
            )
        }
    }
}
