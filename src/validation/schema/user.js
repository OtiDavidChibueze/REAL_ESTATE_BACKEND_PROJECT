// User Schema Validation Input
const joi = require('joi')

const userInputs = joi.object({
    profile_picture: joi
        .array()
        .items(joi.object({ url: joi.string(), cloudinary_id: joi.string() })),
    username: joi
        .string()
        .required()
        .regex(/^[a-zA-Z0-9_-]{3,20}$/)
        .alphanum(),
    email: joi.string().email().required(),
    password: joi
        .string()
        .min(6)
        .regex(/^[a-zA-Z0-9]{6,20}$/)
        .required(),
    phonenumber: joi
        .string()
        .max(11)
        .regex(/^0[0-9]{10}$/)
        .required(),
    role: joi
        .string()
        .valid('admin', 'agent', 'buyer', 'owner')
        .default('buyer'),
    favorites: joi.array().items(
        joi.object({
            property: joi.string().regex(/^[a-fA-F0-9]{24}$/),
        })
    ),
    passwordResetToken: joi.string().allow(null),
    passwordResetExpiresAtToken: joi.date().allow(null),
    passwordChangedAt: joi.date().allow(null),
})

const validateInput = joi.object({
    newPassword: joi
        .string()
        .min(6)
        .regex(/^[a-zA-Z0-9]{6,20}$/)
        .required(),
    oldPassword: joi.string().required(),
})

const validateResetInput = joi.object({
    newPassword: joi
        .string()
        .min(6)
        .regex(/^[a-zA-Z0-9]{6,20}$/)
        .required(),
    comfirmPassword: joi
        .string()
        .min(6)
        .regex(/^[a-zA-Z0-9]{6,20}$/)
        .required(),
})

const validateUpdateInput = joi.object({
    username: joi
        .string()
        .optional()
        .regex(/^[a-zA-Z0-9_-]{3,20}$/)
        .alphanum()
        .optional(),
    phonenumber: joi
        .string()
        .regex(/^0[0-9]{10}$/)
        .optional(),
    role: joi
        .string()
        .valid('admin', 'agent', 'buyer', 'owner')
        .default('buyer')
        .optional(),
})

const validateYourInput = joi.object({
    username: joi
        .string()
        .required()
        .regex(/^[a-zA-Z0-9_-]{3,20}$/)
        .alphanum()
        .optional(),
    phonenumber: joi
        .string()
        .regex(/^0[0-9]{10}$/)
        .optional(),
    email: joi.string().email().required().optional(),
})

module.exports = {
    validateResetInput,
    userInputs,
    validateInput,
    validateUpdateInput,
    validateYourInput,
}
