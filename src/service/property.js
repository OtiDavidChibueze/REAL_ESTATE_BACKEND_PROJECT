// Property Service
import logger from "../config/logger.js";
import PropertyModel from "../model/property.js";
import Helper_Function from "../util/helperFunction.js";

class Property_Service {

    /**
     * @description - this endpoint is used to create a propertyForm
     * @param {object} data - the object data
     * @returns - returns a json response
     */
    static async createPropertyForm(data, req) {
        try {
            // getting the details from the data
            const {
                user,
                title,
                description,
                pricePerYear,
                location,
                bedroomsCount,
                bathroomCount,
                address,
                cityName,
                zipcode,
                images,
                amenitiesList,
                availability
            } = data;

            // getting the  logged In user _Id
            const { _id } = req.user

            if (req.user.role === 'agent' || req.user.role === 'admin' || req.user.role === 'owner') {
                const newProperty = await new PropertyModel({
                    user: _id,
                    title,
                    description,
                    pricePerYear,
                    location,
                    bedroomsCount,
                    bathroomCount,
                    address,
                    cityName,
                    zipcode,
                    images,
                    amenitiesList,
                    availability
                }).save();

                return {
                    statusCode: 200,
                    message: 'created a new property',
                    data: { newProperty }
                }
            } else {
                return {
                    statusCode: 403,
                    message: 'sorry you are not authorized to create this property.'
                }
            }
        } catch (error) {
            logger.error(`Property_Service_CreateProperty -> Error : ${error.message}`)
        }
    }

    static async updatePropertyById(data, req) {
        try {
            const {
                title,
                description,
                pricePerYear,
                location,
                bedroomsCount,
                bathroomCount,
                address,
                cityName,
                zipcode,
                images,
                amenitiesList,
                availability
            } = data;

            const { id } = req.params;
            const { _id } = req.user;

            Helper_Function.mongooseIdValidation(id);
            Helper_Function.mongooseIdValidation(_id);

            if (req.user.role === 'admin' || req.user.role === 'agent' || req.user.role === 'owner') {

                const property = await PropertyModel.findById(id);

                if (!property) {
                    return {
                        statusCode: 404,
                        message: 'resource does not exist!'
                    }
                } else {
                    const updateProperty = await PropertyModel.findByIdAndUpdate(id, data, { new: true });
                    return {
                        statusCode: 200,
                        message: 'updated successfully',
                        data: { updated: updateProperty }
                    }
                };
            } else {
                return {
                    statusCode: 403,
                    message: 'sorry you are not authorized for updating the property'
                }
            }
        } catch (error) {
            logger.error(`Property_Service_updatePropertyById -> Error : ${error.message}`)
        }
    }

    static async deletePropertyById(data, req) {
        try {
            const { id } = data;

            Helper_Function.mongooseIdValidation(id);

            if (req.user.role === 'admin' || req.user.role === 'agent' || req.user.role === 'owner') {

                const property = await PropertyModel.findById(id);

                if (!property) return {
                    statusCode: 404,
                    message: 'resource does not exist!'
                };

                await PropertyModel.findByIdAndDelete(id);


                return {
                    statusCode: 200,
                    message: 'deleted successfully',
                    data: { deleted: property.id }
                }
            } else {
                return {
                    statusCode: 403,
                    message: 'sorry you are not authorized for deleting the property'
                }
            }
        } catch (error) {
            logger.error(`Property_Service_updatePropertyById -> Error : ${error.message}`)
        }
    }


}



export default Property_Service