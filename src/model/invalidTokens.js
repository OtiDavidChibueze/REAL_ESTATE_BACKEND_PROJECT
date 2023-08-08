// Invalid Token Schema
import mongoose from 'mongoose';

const schema = mongoose.Schema({
    invalidToken: {
        type: String,
        unique: true,
        required: true
    }
}, { timestamps: true })

const InvalidTokenModel = mongoose.model('InvalidToken', schema);

export default InvalidTokenModel;