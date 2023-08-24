// User Model
const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

// Create a Mongoose schema for the users
const userSchema = new mongoose.Schema(
    {
        profile_picture: [
            {
                url: {
                    type: String,
                },
                cloudinary_id: {
                    type: String,
                },
            },
        ],
        username: {
            type: String,
        },
        email: {
            type: String,
            unique: true,
        },
        password: {
            type: String,
        },
        phonenumber: {
            type: String,
            unique: true,
        },
        role: {
            type: String,
            enum: ['admin', 'agent', 'buyer', 'owner'],
            default: 'buyer',
        },
        favorites: [
            {
                property: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Property',
                },
            },
        ],

        passwordResetToken: String,

        passwordResetTokenExpiresAt: Date,

        passwordChangedAt: Date,
    },
    { timestamps: true }
)

// plugin paginate
userSchema.plugin(mongoosePaginate)

// Create a model based on the schema and Export the model to be used in other parts of the application
module.exports = mongoose.model('User', userSchema)
