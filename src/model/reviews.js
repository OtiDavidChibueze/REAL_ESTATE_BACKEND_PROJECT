// Review Schema
const mongoose = require('mongoose')

// Declare the Schema of the Mongo model
var reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    rating: {
        type: Number,
    },
    comment: {
        type: String,
    },
})

//Export the model
module.exports = mongoose.model('Review', reviewSchema)
