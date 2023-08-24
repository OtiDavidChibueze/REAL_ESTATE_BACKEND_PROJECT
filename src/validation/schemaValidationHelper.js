// Schema Validation Helper
const logger = require('../config/logger')
const Response_Helper = require('../util/responseHelper')

module.exports = class SchemaValidationHelper {
    static validateInput(schema, object) {
        try {
            const { error, value } = schema.validate(object)
            return { error, value }
        } catch (err) {
            logger.error(
                `SchemaValidationHelper_validateInput -> Error: ${err.message}`
            )
        }
    }

    static validate(schema) {
        try {
            return (req, res, next) => {
                const { error } = SchemaValidationHelper.validateInput(schema, {
                    ...req.body,
                    ...req.query,
                })
                if (!error) {
                    return next()
                }
                return Response_Helper.errorResponse(
                    res,
                    422,
                    error.details[0].message
                )
            }
        } catch (error) {
            logger.error(
                `SchemaValidationHelper_validateSchema -> Error: ${err.message}`
            )
        }
    }
}
