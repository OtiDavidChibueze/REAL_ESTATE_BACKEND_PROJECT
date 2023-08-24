// Invalid Token Schema Validation
const joi = require('joi')

module.exports = joi.object({
    invalidToken: joi
        .string()
        .required()
        .regex(/^[a-ZA-Z0-9_-]+$/),
})
