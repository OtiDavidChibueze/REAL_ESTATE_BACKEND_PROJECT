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

    static comparePassword(password, userPassword) {
        return bcrypt.compareSync(password, userPassword)
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
        user.passwordResetTokenExpiresAt = new Date.now() + 10 * 60
        await user.save()
        return resetToken
    }
}
