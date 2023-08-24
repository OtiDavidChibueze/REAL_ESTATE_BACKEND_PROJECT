// Helper Function File
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const crypto = require('crypto')

module.exports = class Helper_Function {
    static mongooseIdValidation(id) {
        const validId = mongoose.isValidObjectId(id)
        if (!validId) {
            throw new Error('Invalid ID')
        }
    }

    static comparePassword(oldPassword, userPassword) {
        return bcrypt.compareSync(oldPassword, userPassword)
    }

    static hashPassword(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync())
    }

    static async generatePasswordResetToken(user) {
        const resetToken = crypto.randomBytes(30).toString('hex')
        user.passwordResetToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex')
        user.passwordResetTokenExpiresAt = Date.now() + 10 * 60 * 1000
        await user.save()
        return resetToken
    }
}
