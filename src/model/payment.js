// Payment Model
const mongoose = require('mongoose') // Erase if already required

var paymentSchema = new mongoose.Schema({
    selectCurrency: {
        type: String,
        enum: ['USD', 'NGN', 'CAD', 'EUR'],
        default: 'USD',
    },
    amount: {
        type: Number,
    },
    status: {
        type: String,
        enum: ['success', 'failed', 'pending', 'canceled'],
        default: 'pending',
    },
    tx_ref: {
        type: String,
    },
    customer: {
        userRefId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        phonenumber: {
            type: String,
        },
        property: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Property',
        },
        email: {
            type: String,
        },
        username: {
            type: String,
        },
    },
    customization: {
        title: String,
        logo: String,
    },
    redirect_url: {
        type: String,
    },
})

//Export the model
module.exports = mongoose.model('Payment', paymentSchema)
