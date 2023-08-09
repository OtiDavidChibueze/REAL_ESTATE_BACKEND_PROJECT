// User Model
import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

// Create a Mongoose schema for the users
const userSchema = new mongoose.Schema({
    profile_picture: [{
        url: {
            type: String,
        },
        cloudinary_id: {
            type: String
        }
    }],
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
    role: {
        type: String,
        enum: ['admin', 'agent', 'buyer', 'owner'],
        default: 'buyer'
    },

    passwordResetToken: String,

    passwordResetTokenExpiresAt: Date,

    passwordChangedAt: Date

}, { timestamps: true });

// plugin paginate
userSchema.plugin(mongoosePaginate)

// Create a model based on the schema
const User_Model = mongoose.model('User', userSchema);

// Export the model to be used in other parts of the application
export default User_Model;
