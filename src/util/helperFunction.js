// Helper Function File
import mongoose from "mongoose"
import bcrypt, { compareSync, hashSync } from 'bcrypt';
import crypto from 'crypto';

export default class Helper_Function {

    static mongooseIdValidation(id) {
        const validId = mongoose.isValidObjectId(id);
        if (!validId) {
            throw new Error("Invalid ID");
        }
    }

    static comparePassword(password, userPassword) {
        return compareSync(password, userPassword);
    }

    static hashPassword(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync());
    }

    static async generatePasswordResetToken(user) {
        const resetToken = crypto.randomBytes(30).toString('hex');
        user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.passwordResetTokenExpiresAt = new Date.now() + 10 * 60
        await user.save();
        return resetToken
    }

}