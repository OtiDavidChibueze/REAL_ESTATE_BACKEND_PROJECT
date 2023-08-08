// Property Controller
import Property_Service from "../service/property.js";
import Response_Helper from "../util/responseHelper.js";
import logger from "../config/logger.js";

class Property_Controller {
    static async createPropertyForm(req, res) {
        try {

            const data = req.body

            const result = await Property_Service.createPropertyForm(data, req);

            if (result.statusCode == 409) return Response_Helper.errorResponse(res, result.statusCode, result.message);

            logger.info(`Property_Controller_createPropertyForm -> Info : created a new property : ${JSON.stringify(result.data)}`);

            return Response_Helper.successResponse(res, result.statusCode, result.message, result.data);

        } catch (error) {
            logger.error(`Property_Controller_createPropertyForm -> Error: ${error.message}`);
            return Response_Helper.errorResponse(res, 500, 'Oops something went wrong');

        }
    }

    static async updatePropertyById(req, res) {
        try {

            const data = req.body

            const result = await Property_Service.updatePropertyById(data, req);

            if (result.statusCode == 409) return Response_Helper.errorResponse(res, result.statusCode, result.message);

            logger.info(`Property_Controller_updatePropertyById -> Info : updated successfully : ${JSON.stringify(result.data)}`);

            return Response_Helper.successResponse(res, result.statusCode, result.message, result.data);

        } catch (error) {
            logger.error(`Property_Controller_updatePropertyById -> Error: ${error.message}`);
            return Response_Helper.errorResponse(res, 500, 'Oops something went wrong');
        }
    }

    static async deletePropertyById(req, res) {
        try {

            const data = req.params

            const result = await Property_Service.deletePropertyById(data, req);

            if (result.statusCode == 409) return Response_Helper.errorResponse(res, result.statusCode, result.message);

            logger.info(`Property_Controller_deletePropertyById -> Info : deleted successfully : ${JSON.stringify(result.data)}`);

            return Response_Helper.successResponse(res, result.statusCode, result.message, result.data);

        } catch (error) {
            logger.error(`Property_Controller_deletePropertyById -> Error: ${error.message}`);
            return Response_Helper.errorResponse(res, 500, 'Oops something went wrong');
        }
    }
}

export default Property_Controller