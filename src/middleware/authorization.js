// Authorization File
import logger from '../config/logger.js'
import Response_Helper from '../util/responseHelper.js'
import { SECRET } from '../config/keys/secretKeys.js'
import InvalidTokenModel from '../model/invalidTokens.js';
import jwt from 'jsonwebtoken'

const Authorization = async (req, res, next) => {

    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) return Response_Helper.errorResponse(res, 403, 'No authorization header found');

        const token = authHeader.split(' ')[1];

        const invalidToken = await InvalidTokenModel.findOne({ token: token });

        if (invalidToken) return Response_Helper.errorResponse(res, 403, 'invalid token pls login')

        if (token) {
            jwt.verify(token, SECRET, { algorithms: ['HS256'] }, async (err, decodedToken) => {
                if (err) {
                    logger.info(`Authorization -> Error : ${err}`);
                    if (err.name === TokenExpiredError) {
                        return Response_Helper.errorResponse(res, 403, 'session expired pls login')
                    } else {
                        logger.error(`${err.message}`);
                        return Response_Helper.errorResponse(res, 400, 'invalid token')
                    }
                } else {
                    console.log({ decodedToken });

                    req.user = {
                        _id: decodedToken.userId,
                        role: decodedToken.role
                    }

                    next();
                }
            })
        } else {
            return Response_Helper.errorResponse(res, 401, 'Unauthorized Access, please login');
        }
    } catch (err) {
        logger.error(`Authorization -> Error : ${err.message}`);
        return Response_Helper.errorResponse(res, 500, 'internal error')
    }
}



export default Authorization