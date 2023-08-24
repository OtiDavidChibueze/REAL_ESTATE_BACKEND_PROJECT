// Property Service
const sharp = require('sharp')
const logger = require('../config/logger.js')
const PropertyModel = require('../model/property.js')
const { cloudinary } = require('../util/cloudinary.js')
const Helper_Function = require('../util/helperFunction.js')
const UserModel = require('../model/user.js')
const ReviewModel = require('../model/reviews.js')

module.exports = class Property_Service {
    /**
     * @description - Property endpoints
     */

    /**
     * @description - this endpoint allows only admins to create a new property
     * @param {*} data - the property credentials
     * @param {*} currentUser - the logged in user
     * @returns - returns a json object
     */
    static async createPropertyForm(data, currentUser) {
        try {
            const {
                admin,
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

            const { _id } = currentUser

            Helper_Function.mongooseIdValidation(_id)

            if (currentUser.role === 'admin') {
                const newProperty = await new PropertyModel({
                    admin: _id,
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
     * @description - this endpoint allows users to add properties to their favorites
     * @param {string} currentUser - the logged in user
     * @param {string} id - the property id
     * @returns - returns a json object
     */
    static async addPropertyToFavorites(currentUser, propertyId) {
        try {
            const { id } = propertyId
            const { _id } = currentUser

            Helper_Function.mongooseIdValidation(id)
            Helper_Function.mongooseIdValidation(_id)

            const property = await PropertyModel.findById(id)
            if (!property)
                return {
                    statusCode: 404,
                    message: 'Property with the provided id not found',
                }

            const user = await UserModel.findById({ _id })

            const alreadyAddedToFavorite = user.favorites.some(
                (fav) => fav.property.toString() === property.id.toString()
            )

            if (alreadyAddedToFavorite) {
                return {
                    statusCode: 406,
                    message: 'property already exists in favorites',
                }
            } else {
                user.favorites.push({ property: property.id })
                await user.save()

                return {
                    statusCode: 200,
                    message: 'property successfully added to favorites',
                    data: {
                        favorites: user.favorites,
                    },
                }
            }
        } catch (error) {
            logger.error(
                `Failed To Add Property To Favorite -> Error: ${error.message} `
            )
        }
    }

    /**
     * @description - this endpoint allows users to remove properties from their favorites
     * @param {string} currentUser - the logged in user
     * @param {string} id - the property id
     * @returns - returns a json object
     */
    static async removeFromFavorites(currentUser, propertyId) {
        try {
            const { id } = propertyId
            const { _id } = currentUser

            Helper_Function.mongooseIdValidation(id)
            Helper_Function.mongooseIdValidation(_id)

            const property = await PropertyModel.findById(id)
            if (!property)
                return {
                    statusCode: 404,
                    message: 'Property with the provided id not found',
                }

            const user = await UserModel.findById({ _id })

            const alreadyAddedToFavorite = user.favorites.some(
                (fav) => fav.property.toString() === property.id.toString()
            )

            if (alreadyAddedToFavorite) {
                user.favorites.pull({ property: property.id })
                await user.save()
                return {
                    statusCode: 200,
                    message: 'successfully removed from favorites',
                    data: {
                        favorites: user.favorites,
                    },
                }
            } else {
                return {
                    statusCode: 406,
                    message: 'property does exists in your favorites',
                }
            }
        } catch (error) {
            logger.error(
                `User_Service_removeFromProperty -> Error: ${error.message} `
            )
        }
    }

    /**
     * @description - this endpoint allows admins update a property by its id
     * @param {object} data - the object data
     * @param {id} propertyId - the property to update
     * @param {string} currentUser - the logged in user
     * @returns - returns a json object
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

            if (currentUser.role === 'admin') {
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
     * @description - this endpoint is allows admins delete property by its id
     * @param {id} propertyId - the property to update
     * @param {string} currentUser - the logged in user
     * @returns - returns a json object
     */
    static async deletePropertyById(propertyId, currentUser) {
        try {
            const { id } = propertyId

            Helper_Function.mongooseIdValidation(id)

            if (currentUser.role === 'admin') {
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
                    message:
                        'you successfully deleted this property successfully',
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
                `Property_Service_deletePropertyById -> Error : ${error.message}`
            )
        }
    }

    /**
     * @description - this endpoint allows admins upload images to a property by its id
     * @param {object} files - the files/images to upload
     * @param {id} propertyId - the property to update
     * @param {string} currentUser - the logged in user
     * @returns - returns a json object
     */
    static async uploadImagesToAPropertyById(propertyId, currentUser, files) {
        const { id } = propertyId
        const { _id } = currentUser

        Helper_Function.mongooseIdValidation(id)
        Helper_Function.mongooseIdValidation(_id)

        try {
            const property = await PropertyModel.findById(id)

            const loggedInUser = await UserModel.findById(_id)

            if (!property) {
                return {
                    statusCode: 404,
                    message: 'property with the provided id does not exist!',
                }
            }

            if (!files)
                return {
                    statusCode: 404,
                    message: 'no files selected',
                }

            if (loggedInUser.role === 'admin') {
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
                        successfully_uploaded: property.images,
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

    /**
     * @description - this endpoint allows admins update images to a property by its id
     * @param {object} files - the files/images to upload
     * @param {id} propertyId - the property to update
     * @param {string} currentUser - the logged in user
     * @returns - returns a json object
     */
    static async updateImagesToAPropertyById(propertyId, currentUser, files) {
        try {
            const { id } = propertyId

            const { _id } = currentUser

            Helper_Function.mongooseIdValidation(id)

            if (!files)
                return {
                    statusCode: 404,
                    message: 'no files selected',
                }

            const property = await PropertyModel.findById(id)

            if (!property) {
                return {
                    statusCode: 404,
                    message: 'resource with the provided id not found',
                }
            }

            const loggedInUser = await UserModel.findById(_id)

            if (loggedInUser.role === 'admin') {
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
                    message: 'successfully updated images',
                    data: { updated: property.images },
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

    /**
     * @description - this endpoint allows admins delete images to a property by its id
     * @param {object} files - the files/images to upload
     * @param {id} propertyId - the property to update
     * @param {string} currentUser - the logged in user
     * @returns - returns a json object
     */
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

            if (currentUser.role === 'admin') {
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

    /**
     * @description - this endpoint allows users add reviews to a property by its id
     * @param {object} data - the object data
     * @param {id} propertyId - the property to update
     * @param {string} currentUser - the logged in user
     * @returns - returns a json object
     */
    static async addAReviewToAProperty(propertyId, currentUser, data) {
        try {
            const { user, rating, comment } = data

            const { id } = propertyId

            const { _id } = currentUser

            Helper_Function.mongooseIdValidation(id)
            Helper_Function.mongooseIdValidation(_id)

            const property = await PropertyModel.findById(id)
            if (!property)
                return {
                    statusCode: 501,
                    message: 'property with the provided id not found',
                }
            const loggedInUser = await UserModel.findById(_id)

            const addReview = await new ReviewModel({
                user: loggedInUser.id,
                rating,
                comment,
            }).save()

            property.reviews.push(addReview.id)

            await property.save()

            return {
                statusCode: 200,
                message: 'review added successfully',
                data: { added: addReview._doc },
            }
        } catch (error) {
            logger.error(
                `Property_Service_addAReviewAProperty -> Error: ${error.message}`
            )
        }
    }

    /**
     * @description - this endpoint allows users update reviews to a property using the review id and also gives admins the access to update users reviews
     * @param {object} data - the object data
     * @param {id} reviewId - the review to update
     * @param {string} currentUser - the logged in user
     * @returns - returns a json object
     */
    static async updateReviewToAProperty(reviewId, currentUser, data) {
        try {
            const { rating, comment } = data

            const { id } = reviewId

            const { _id } = currentUser

            Helper_Function.mongooseIdValidation(id)
            Helper_Function.mongooseIdValidation(_id)

            const review = await ReviewModel.findById(id)

            if (!review)
                return {
                    statusCode: 501,
                    message: 'Review with the provided id not found',
                }

            const loggedInUser = await UserModel.findById(_id)

            if (
                review.user.equals(loggedInUser._id) ||
                currentUser.role === 'agent'
            ) {
                review.rating = rating
                review.comment = comment

                await review.save()

                return {
                    statusCode: 200,
                    message: 'Review updated successfully',
                    data: { updated: review },
                }
            } else {
                return {
                    statusCode: 403,
                    message: "You're only allowed to update only your review",
                }
            }
        } catch (error) {
            logger.error(
                `Property_Service_updateReviewToAProperty -> Error: ${error.message}`
            )
        }
    }

    /**
     * @description - this endpoint allows users delete reviews to a property using the review id and also gives admins the access to delete users reviews
     * @param {object} data - the object data
     * @param {id} reviewId - the review to update
     * @param {string} currentUser - the logged in user
     * @returns - returns a json object
     */
    static async deleteReviewToAProperty(params, currentUser) {
        try {
            const { propertyId, reviewId } = params

            const { _id } = currentUser

            Helper_Function.mongooseIdValidation(propertyId)
            Helper_Function.mongooseIdValidation(reviewId)

            Helper_Function.mongooseIdValidation(_id)

            const review = await ReviewModel.findById(reviewId)

            if (!review)
                return {
                    statusCode: 404,
                    message: 'Review with the provided id not found',
                }

            const property = await PropertyModel.findById(propertyId)
            if (!property)
                return {
                    statusCode: 501,
                    message: 'property with the provided id not found',
                }

            if (review.user.equals(_id) || currentUser.role === 'agent') {
                await ReviewModel.findByIdAndDelete(reviewId)

                property.reviews.pull(reviewId)

                await property.save()

                return {
                    statusCode: 200,
                    message: 'Review deleted successfully',
                }
            } else {
                return {
                    statusCode: 403,
                    message: "You're only allowed to delete your review",
                }
            }
        } catch (error) {
            logger.error(
                `Property_Service_updateReviewToAProperty -> Error: ${error.message}`
            )
        }
    }
}
