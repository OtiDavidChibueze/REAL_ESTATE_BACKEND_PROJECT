// Response Helper
module.exports = class Response_Helper {
    /**
     * @description - this is used to return an error response
     * @param {object} res - the object response
     * @param {number} statuscode - the statuscode
     * @param {string} message - the message to be sent
     * @param {object} data - the object data
     */
    static successResponse(res, statusCode, message, data) {
        return res.status(statusCode).json({ status: 'success', message, data })
    }

    /**
     * @description - this is used to return an error response
     * @param {object} res - the object response
     * @param {number} statuscode - the statuscode
     * @param {string} message - the message to be sent
     */
    static errorResponse(res, statusCode, message, data) {
        return res.status(statusCode).json({ status: 'success', message })
    }
}
