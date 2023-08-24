// Property Schema Validation
const joi = require('joi')

const validateInput = joi.object({
    admin: joi
        .string()
        .regex(/^[a-zA-Z0-9_-]{3,20}$/)
        .alphanum(),
    title: joi.string().required(),
    description: joi.string(),
    pricePerYear: joi.object({
        selectCurrency: joi
            .string()
            .valid('USD', 'CAD', 'EUR', 'NGN')
            .default('USD')
            .required(),
        amount: joi.number().required().min(0).default(0),
    }),
    bedroomsCount: joi.number().min(1).required(),
    bathroomsCount: joi.number().min(1).required(),
    address: joi.string().required(),
    cityName: joi
        .string()
        .required()
        .regex(/^[a-z-A-Z0-9_]+$/),
    zipcode: joi.string().required(),
    location: joi.string().regex(/^[a-zA-Z0-9_-]{3,20}$/),
    images: joi.array().items(
        joi.object({
            url: joi.string(),
            cloudinary_id: joi.string(),
        })
    ),
    amenitiesList: joi.array().items(joi.string()),
    reviews: joi.array().items(joi.object().regex(/^[a-fA-F0-9]{24}$/)),
    availability: joi.boolean().default('false'),
    paymentMethod: joi.string().regex(/^[a-fA-F0-9]{24}$/),
})

const validateUpdateInput = joi.object({
    user: joi.string().regex(/^[a-fA-F0-9]{24}$/),
    rating: joi.number().required().min(0).max(5).default(0),
    comment: joi.string().required(),
})

module.exports = {
    validateInput,
    validateUpdateInput,
}
