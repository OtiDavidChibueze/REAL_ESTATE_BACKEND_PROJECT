// Property Service
const sharp = require('sharp')
const logger = require('../config/logger.js')
const PropertyModel = require('../model/property.js')
const { cloudinary } = require('../util/cloudinary.js')
const Helper_Function = require('../util/helperFunction.js')

module.exports = class Property_Service {
    /**
     *
     * @param {*} data
     * @param {*} currentUser
     * @returns
     */
    static async createPropertyForm(data, currentUser) {
        try {
            // getting the details = require the data
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
                availability,
            } = data

            // getting the  logged In user _Id

            const { _id } = currentUser

            Helper_Function.mongooseIdValidation(_id)

            if (
                currentUser.role === 'agent' ||
                currentUser.role === 'admin' ||
                currentUser.role === 'owner'
            ) {
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
                    availability,
                }).save()

                return {
                    statusCode: 200,
                    message: 'created a new property',
                    data: { newProperty },
                }
            } else {
                return {
                    statusCode: 403,
                    message:
                        'sorry you are not authorized to create this property.',
                }
            }
        } catch (error) {
            logger.error(`Property_Service_CreateProperty -> Error : ${error}`)
        }
    }

    /**
     *
     * @param {*} data
     * @param {*} propertyId
     * @param {*} currentUser
     * @returns
     */
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
                availability,
            } = data

            const { id } = propertyId
            const { _id } = currentUser

            Helper_Function.mongooseIdValidation(id)
            Helper_Function.mongooseIdValidation(_id)

            if (
                currentUser.role === 'admin' ||
                currentUser.role === 'agent' ||
                currentUser.role === 'owner'
            ) {
                const property = await PropertyModel.findById(id)

                if (!property) {
                    return {
                        statusCode: 404,
                        message: 'resource does not exist!',
                    }
                } else {
                    const updateProperty =
                        await PropertyModel.findByIdAndUpdate(id, data, {
                            new: true,
                        })
                    return {
                        statusCode: 200,
                        message: 'updated successfully',
                        data: { updated: updateProperty },
                    }
                }
            } else {
                return {
                    statusCode: 403,
                    message:
                        'sorry you are not authorized for updating the property',
                }
            }
        } catch (error) {
            logger.error(
                `Property_Service_updatePropertyById -> Error : ${error.message}`
            )
        }
    }

    /**
     *
     * @param {*} propertyId
     * @param {*} currentUser
     * @returns
     */
    static async deletePropertyById(propertyId, currentUser) {
        try {
            const { id } = propertyId

            Helper_Function.mongooseIdValidation(id)

            if (
                currentUser.role === 'admin' ||
                currentUser.role === 'agent' ||
                currentUser.role === 'owner'
            ) {
                const property = await PropertyModel.findById(id)

                if (!property)
                    return {
                        statusCode: 404,
                        message: 'resource does not exist!',
                    }

                const imageCloudinaryIds = property.images.map(
                    (image) => image.cloudinary_id
                )

                const deleteAllImagesCloudinaryId = imageCloudinaryIds.map(
                    async (cloudinaryId) =>
                        await cloudinary.uploader.destroy(cloudinaryId)
                )

                await Promise.all(deleteAllImagesCloudinaryId)

                await PropertyModel.findByIdAndDelete(id)

                return {
                    statusCode: 200,
                    message: 'property deleted successfully',
                    data: { deleted: property.id },
                }
            } else {
                return {
                    statusCode: 403,
                    message:
                        'sorry you are not authorized for deleting the property',
                }
            }
        } catch (error) {
            logger.error(
                `Property_Service_updatePropertyById -> Error : ${error.message}`
            )
        }
    }

    /**
     *
     * @param {*} propertyId
     * @param {*} currentUser
     * @param {*} files
     * @returns
     */
    static async uploadImagesToAPropertyById(propertyId, currentUser, files) {
        const { id } = propertyId
        const { _id } = currentUser

        Helper_Function.mongooseIdValidation(id)
        Helper_Function.mongooseIdValidation(_id)

        try {
            const property = await PropertyModel.findById(id)

            if (!property) {
                return {
                    statusCode: 404,
                    message: 'Resource does not exist!',
                }
            }

            if (
                currentUser.role === 'admin' ||
                currentUser.role === 'agent' ||
                currentUser.role === 'owner'
            ) {
                const imageMax = 10
                const imageSelectedToUpload = files.length
                const imageAlreadyUpload = property.images.length

                const imageRemainingToUpload = imageMax - imageAlreadyUpload

                if (imageAlreadyUpload === imageMax)
                    return {
                        statusCode: 406,
                        message: `max image reached ${imageMax}`,
                    }

                if (imageSelectedToUpload > imageRemainingToUpload)
                    return {
                        statusCode: 406,
                        message: `you can only ${imageRemainingToUpload} image left!, you've already uploaded ${imageAlreadyUpload}`,
                    }

                if (imageRemainingToUpload <= 0)
                    return {
                        statusCode: 406,
                        message: `max image upload reached ${imageMax}`,
                    }

                const imageToUpload = Math.min(
                    imageSelectedToUpload,
                    imageRemainingToUpload
                )

                const images = []

                try {
                    for (let i = 0; i < imageToUpload; i++) {
                        const file = files[i]

                        const resizedBuffer = await sharp(file.path)
                            .resize(540, 1080)
                            .toFormat('jpg')
                            .jpeg({ quality: 90 })
                            .toBuffer()

                        const uploadOptions = {
                            resource_type: 'auto',
                            folder: 'realEstate/images/property',
                            format: 'jpg',
                            public_id: `${_id}-${Date.now()}`,
                        }

                        await new Promise((resolve, reject) => {
                            const uploadStream =
                                cloudinary.uploader.upload_stream(
                                    uploadOptions,
                                    (error, result) => {
                                        if (error) {
                                            logger.error(
                                                `Error uploading image -> ${error}`
                                            )
                                            reject(error)
                                        } else {
                                            images.push({
                                                url: result.secure_url,
                                                cloudinary_id: result.public_id,
                                            })
                                            resolve()
                                        }
                                    }
                                )
                            uploadStream.end(resizedBuffer)
                        })
                    }
                } catch (error) {
                    logger.error(`Error processing image -> ${error}`)
                }

                property.images = property.images.concat(images)
                await property.save()

                return {
                    statusCode: 201,
                    message: 'images uploaded successfully',
                    data: {
                        successfully_uploaded: property,
                        imageUploaded: property.images.length,
                    },
                }
            } else {
                return {
                    statusCode: 403,
                    message: 'Unauthorized to perform this action',
                }
            }
        } catch (error) {
            logger.error(
                `Property_Service_uploadImagesToAPropertyById -> Error: ${error.message}`
            )
        }
    }

    static async updateImagesToAPropertyById(propertyId, currentUser, files) {
        try {
            const { id } = propertyId

            Helper_Function.mongooseIdValidation(id)

            const property = await PropertyModel.findById(id)

            if (!property) {
                return {
                    statusCode: 404,
                    message: 'resource with the provided id not found',
                }
            }

            if (
                currentUser.role === 'admin' ||
                currentUser.role === 'agent' ||
                currentUser.role === 'owner'
            ) {
                const imageMax = 10

                const imageSelectedToUpload = files.length

                if (imageSelectedToUpload > imageMax) {
                    return {
                        statusCode: 406,
                        message: ` max image to upload is ${imageMax}`,
                    }
                }

                const getImages = property.images.map(
                    (image) => image.cloudinary_id
                )

                const deleteCloudinaryIds = getImages.map(
                    async (cloudinaryId) => {
                        await cloudinary.uploader.destroy(cloudinaryId)
                    }
                )

                await Promise.all(deleteCloudinaryIds)

                const images = []

                for (const file of files) {
                    const resizedBuffer = await sharp(file.path)
                        .resize(540, 1080)
                        .toFormat('jpg')
                        .jpeg({ quality: 90 })
                        .toBuffer()

                    const uploadOptions = {
                        resource_type: 'auto',
                        folder: 'realEstate/images/property',
                        format: 'jpg',
                        public_id: `${_id}-${Date.now()}`,
                    }

                    await new Promise((resolve, reject) => {
                        const uploadStream = cloudinary.uploader.upload_stream(
                            uploadOptions,
                            (error, result) => {
                                if (error) {
                                    logger.info(
                                        `Error uploading image -> ${error}`
                                    )
                                    reject(error)
                                } else {
                                    images.push({
                                        url: result.secure_url,
                                        cloudinary_id: result.public_id,
                                    })
                                    resolve()
                                }
                            }
                        )
                        uploadStream.end(resizedBuffer)
                    })
                }

                property.images = images

                await property.save()

                return {
                    statusCode: 201,
                    message: 'successfully updated',
                    data: { updated: property },
                }
            } else {
                return {
                    statusCode: 403,
                    message: 'You are unauthorized to perform this action.',
                }
            }
        } catch (error) {
            logger.error(
                `Property_Service_updateImagesToAPropertyById -> Error: ${error.message}`
            )
        }
    }

    static async deleteAllImagesToAPropertyById(propertyId, currentUser) {
        try {
            const { id } = propertyId
            const { _id } = currentUser

            Helper_Function.mongooseIdValidation(id)
            Helper_Function.mongooseIdValidation(_id)

            const property = await PropertyModel.findById(id)
            if (!property)
                return {
                    statusCode: 404,
                    message: 'No such a property found with the provided id',
                }

            if (
                currentUser.role === 'admin' ||
                currentUser.role === 'agent' ||
                currentUser.role === 'owner'
            ) {
                const getAllImagesCloudinaryId = property.images.map(
                    (image) => image.cloudinary_id
                )

                const deleteAllImagesCloudinaryId =
                    getAllImagesCloudinaryId.map(
                        async (cloudinaryId) =>
                            await cloudinary.uploader.destroy(cloudinaryId)
                    )

                await Promise.all(deleteAllImagesCloudinaryId)

                await property.save()

                return {
                    statusCode: 200,
                    message: 'deleted all photos in this property',
                }
            } else {
                return {
                    statusCode: 403,
                    message: 'Unauthorized to perform this action',
                }
            }
        } catch {
            logger.error(
                `Property_Service_deleteAllImagesToAPropertyById -> Error: ${error.message}`
            )
        }
    }
}
