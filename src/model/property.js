// Property Model
const mongoose = require('mongoose')
const ReviewModel = require('./reviews')

const PropertySchema = new mongoose.Schema(
    {
        user: {
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
                enum: ['$', '€', '#'], //TODO : add more currency symbols
                default: '#',
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
        bathroomCount: {
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
        amenitiesList: [
            {
                type: String,
            },
        ],

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
    },
    { timestamps: true }
)

module.exports = mongoose.model('Property', PropertySchema)
