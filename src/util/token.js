// Token Config
import jwt from "jsonwebtoken";
import { SECRET } from "../config/keys/secretKeys.js";
import logger from "../config/logger.js";

export default class Token {

    /**
     * @description - this is used to generateToken
     */
    static generateToken(user) {
        const payload = {
            userId: user.id,
            role: user.role
        }

        const options = {
            expiresIn: '1d'
        }

        try {
            const token = jwt.sign(payload, SECRET, options)
            return token
        } catch (error) {
            logger.error(error)
        }
    }

}