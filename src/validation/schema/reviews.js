// Review Schema Validation
const joi = require('joi')

module.exports = joi.object({
    user: joi
        .string()
        .regex(/^[a-fA-F0-9]{24}$/)
        .required()
        .regex(/^[a-ZA-Z0-9_-]{3,20}$/)
        .alphanum(),
    rating: joi.number().min(0).max(5).default(0).optional(),
    comment: joi.string().min(0).max(200).optional(),
})
