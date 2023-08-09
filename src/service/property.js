// Property Service
import logger from "../config/logger.js";
import PropertyModel from "../model/property.js";
import cloudinary from "../util/cloudinary.js";
import Helper_Function from "../util/helperFunction.js";

class Property_Service {

    /**
     * @description - this endpoint is used to create a propertyForm
     * @param {object} data - the object data
     * @returns - returns a json response
     */
    static async createPropertyForm(data, currentUser) {
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

            const { _id } = currentUser

            Helper_Function.mongooseIdValidation(_id);

            if (currentUser.role === 'agent' || currentUser.role === 'admin' || currentUser.role === 'owner') {

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
            logger.error(`Property_Service_CreateProperty -> Error : ${error}`)
        }
    }

    static async updatePropertyById(data, propertyId, currentUser) {
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

            const { id } = propertyId;
            const { _id } = currentUser;

            Helper_Function.mongooseIdValidation(id);
            Helper_Function.mongooseIdValidation(_id);

            if (currentUser.role === 'admin' || currentUser.role === 'agent' || currentUser.role === 'owner') {

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

    static async deletePropertyById(propertyId, currentUser) {
        try {
            const { id } = propertyId;

            Helper_Function.mongooseIdValidation(id);

            if (currentUser.role === 'admin' || currentUser.role === 'agent' || currentUser.role === 'owner') {

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

    static async uploadImagesToAPropertyById(propertyId, currentUser, files) {

        const { id } = propertyId;

        const { _id } = currentUser;

        Helper_Function.mongooseIdValidation(id);
        Helper_Function.mongooseIdValidation(_id);

        try {

            const property = await PropertyModel.findById(id);
            if (!property)
                return {
                    statusCode: 404,
                    message: 'resource does not exist!'

                };

            const uploadedImgs = [];

            for (const file of files) {
                const uploads = await cloudinary.uploader.upload(file.path);
                uploadedImgs.push(uploads.secure_url);
            }

            const imageObject = {};

            uploadedImgs.forEach((url, index) => {
                imageObject[`url${index + 1}`] = url;
            });

            property.images = imageObject;

            await property.save();

            return {
                statusCode: 201,
                message: 'successfully uploaded',
                data: { successfully_uploaded: property }
            }
        } catch (error) {
            console.log('error', error)
        }
    }
}



export default Property_Service