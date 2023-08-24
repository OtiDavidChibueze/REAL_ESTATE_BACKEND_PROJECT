// Property Model
const mongoose = require('mongoose')

const PropertySchema = new mongoose.Schema(
    {
        admin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        title: {
            type: String,
        },
        description: {
            type: String,
            default: '',
        },
        pricePerYear: {
            selectCurrency: {
                type: String,
                enum: ['USD', 'NGN', 'CAD', 'EUR'],
                default: 'USD',
            },
            amount: {
                type: Number,
                default: 0,
                min: 0,
            },
        },
        bedroomsCount: {
            type: Number,
            min: 1,
        },
        bathroomsCount: {
            type: Number,
            min: 1,
        },
        address: {
            type: String,
        },
        cityName: {
            type: String,
        },
        zipcode: {
            type: String,
        },
        location: {
            type: String,
        },
        images: [
            {
                url: {
                    type: String,
                },
                cloudinary_id: {
                    type: String,
                },
            },
        ],
        amenitiesList: [],

        reviews: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Review',
            },
        ],
        availability: {
            type: Boolean,
            default: false,
        },
        paymentMethod: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Payment',
        },
    },
    { timestamps: true }
)
module.exports = mongoose.model('Property', PropertySchema)
