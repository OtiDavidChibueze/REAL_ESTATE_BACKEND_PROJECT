// Token Config
const jwt = require('jsonwebtoken')
const { SECRET } = require('../config/keys/secretKeys.js')
const logger = require('../config/logger.js')

module.exports = class Token {
    /**
     * @description - this is used to generateToken
     */
    static generateToken(user) {
        const payload = {
            userId: user.id,
            role: user.role,
        }

        const options = {
            expiresIn: '1d',
        }

        try {
            const token = jwt.sign(payload, SECRET, options)
            return token
        } catch (error) {
            logger.error(error)
        }
    }
}
