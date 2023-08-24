// Payment Schema Validation
const joi = require('joi')

module.exports = joi.object({
    selectCurrency: joi
        .string()
        .valid('USD', 'NGN', 'CAD', 'EUR')
        .default('USD')
        .required(),
    amount: joi.number().min(0).required().default(0),
    status: joi
        .string()
        .valid('success', 'failed', 'pending', 'canceled')
        .default('pending')
        .required(),
    tx_ref: joi
        .string()
        .required()
        .regex(/^[a-ZA-Z0-9_-]+$/),
    customer: joi.object({
        userRefId: joi
            .string()
            .regex(/^[a-fA-F0-9]{24}$/)
            .required(),
        phonenumber: joi
            .string()
            .regex(/^0[0-9]{10}$/)
            .required(),
        property: joi
            .string()
            .regex(/^[a-fA-F0-9]{24}$/)
            .required(),
        email: joi.string().email().required(),
        username: joi
            .string()
            .min(2)
            .max(20)
            .required()
            .regex(/^[a-ZA-Z0-9_-]{3,20}$/)
            .alphanum(),
        customization: joi.object({
            title: joi.string().required(),
            logo: joi.string().required(),
        }),
        redirect_url: joi
            .string()
            .required()
            .regex(/^[a-ZA-Z0-9_-]+$/),
    }),
})
