// Property Model
import mongoose from 'mongoose';

const PropertySchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
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
            enum: ['$', '€'], //TODO : add more currency symbols
            default: '#'
        },
        amount: {
            type: Number,
            default: 0,
            min: 0,
        }
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
        type: String
    },
    zipcode: {
        type: String
    },
    location: {
        type: String
    },
    images: [{
        url1: {
            type: String,
            trim: true
        },
        url2: {
            type: String,
            trim: true
        },
        url3: {
            type: String,
            trim: true
        },
    }],
    amenitiesList: [{
        type: String,
    }],

    availability: {
        type: Boolean,
        default: false
    },

}, { timestamps: true })

const PropertyModel = mongoose.model('Property', PropertySchema);

export default PropertyModel;
