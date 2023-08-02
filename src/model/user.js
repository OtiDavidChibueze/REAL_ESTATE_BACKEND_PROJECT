// Users Model
import mongoose from 'mongoose';

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    first_name: String,

    other_name: String,

    email: String,

    mobile: String,

    password: String,

    admin: {
        type: Boolean,
        default: false
    },

    agent: {
        type: Boolean,
        default: false
    },

    passwordResetToken: String,

    passwordResetTokenExpiresAt: Date,

    passwordChangedAt: Date

}, { timestamps: true });

//Export the model
const User_Model = mongoose.model('User', userSchema);

export default User_Model;