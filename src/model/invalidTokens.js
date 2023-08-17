// Invalid Token Schema
const mongoose = require('mongoose')

const schema = mongoose.Schema(
    {
        invalidToken: {
            type: String,
            unique: true,
            required: true,
        },
    },
    { timestamps: true }
)

module.exports = mongoose.model('InvalidToken', schema)
