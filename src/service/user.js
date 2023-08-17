// User Service
const User_Model = require('../model/user.js')
const Helper_Function = require('../util/helperFunction.js')
const Token = require('../util/token.js')
const InvalidTokenModel = require('../model/invalidTokens.js')
const logger = require('../config/logger.js')
const { cloudinary } = require('../util/cloudinary.js')
const sharp = require('sharp')
const PropertyModel = require('../model/property.js')

module.exports = class User_Service {
    static async registerUser(data) {
        try {
            // getting the details = require the data
            const { username, email, password } = data

            // checking if the already exists
            const userExists = await User_Model.findOne({ email: email })
            // if the user already exists
            if (userExists)
                return {
                    statusCode: 406,
                    message: 'email already exists  , user already registered',
                }

            // hash the user password
            const hashPassword = Helper_Function.hashPassword(password)

            // create a new user and save the changes
            const newUser = await new User_Model({
                username: username,
                email: email,
                password: hashPassword,
            }).save()

            // return a success message
            return {
                statusCode: 201,
                message: 'User created successfully',
                data: { user: newUser },
            }
        } catch (err) {
            logger.error(`User_Service_registerUser -> Error : ${err.message}`)
        }
    }

    static async signIn(data) {
        try {
            // getting the details = require the data;
            const { email, password } = data

            // checking if the user exists
            const user = await User_Model.findOne({ email: email })

            // if the user doesn't exists or the password is incorrect
            if (!user)
                return {
                    statusCode: 404,
                    message: 'incorrect email',
                }

            // checking if the password is the same
            const oldPassword = Helper_Function.comparePassword(
                password,
                user.password
            )
            // if the password is incorrect
            if (!oldPassword)
                return {
                    statusCode: 404,
                    message: 'incorrect password',
                }

            // if the password and email are correct..  generate a login in token for the user
            const generateToken = Token.generateToken(user)

            // checking if the invalid ...
            const invalidToken = await InvalidTokenModel.findOne({
                generateToken,
            })
            // if yes ....
            if (invalidToken)
                return {
                    statusCode: 403,
                    message: 'invalid token , pls login',
                }

            // send a success response after logging in
            return {
                statusCode: 200,
                message: 'logged in',
                data: {
                    userId: user.id,
                    role: user.role,
                    accessToken: generateToken,
                },
            }
        } catch (err) {
            logger.error(`User_Service_signIn -> Error : ${err.message}`)
        }
    }

    static async updateYourProfile(data, currentUser) {
        try {
            // getting the details = require the data
            const { username, email } = data

            // getting the logged in user _id
            const { _id } = currentUser

            const user = await User_Model.findById(_id)

            if (user.id === currentUser._id) {
                // looking for the current user and update his profile
                const updatedProfile = await User_Model.findByIdAndUpdate(
                    _id,
                    data,
                    { new: true }
                )

                // sending back the updated user to the client side
                return {
                    statusCode: 200,
                    message: 'successfully Updated your Profile ',
                    data: { updated: updatedProfile },
                }
            } else {
                return {
                    statusCode: 403,
                    message: 'Unauthorized to perform this action',
                }
            }
        } catch (err) {
            logger.error(
                `User_Service_updateYourProfile -> Error : ${err.message}`
            )
        }
    }

    static async deleteYourAccount(currentUser) {
        try {
            // getting the logged in user _id
            const { _id } = currentUser

            // looking for the current user and update his profile
            const user = await User_Model.findById(_id)

            if (user.id === currentUser._id) {
                const getImageCloudinaryId = user.profile_picture.map(
                    (image) => image.cloudinary_id
                )

                const deleteImage = getImageCloudinaryId.map(
                    async (cloudinaryId) =>
                        await cloudinary.uploader.destroy(cloudinaryId)
                )

                await Promise.all(deleteImage)

                await User_Model.findByIdAndDelete(_id)

                // sending back the updated   ;user to the client side
                return {
                    statusCode: 200,
                    message: 'successfully deleted your account ',
                }
            } else {
                return {
                    statusCode: 401,
                    message: 'Unauthorized to delete this account',
                }
            }
        } catch (err) {
            logger.error(
                `User_Service_deleteYourAccount -> Error : ${err.message}`
            )
        }
    }

    static async getAllAdmins() {
        const admins = await User_Model.find({ role: 'admin' })

        const counts = admins.length

        if (!admins)
            return {
                statusCode: 200,
                message: { admins: [], counts: 0 },
            }

        return {
            statusCode: 200,
            message: 'fetched all admins',
            data: { admins, counts },
        }
    }

    static async search_for_users_with_username_or_role(req) {
        try {
            const options = {
                page: req.query.page ? parseInt(req.query.page) : 1,
                limit: req.query.page ? parseInt(req.query.limit) : 20,
                sort: { createdAt: -1 },
            }

            const username = req.query.username
            const role = req.query.role

            const query = {}

            if (username) {
                query.username = { $regex: username, $options: 'i' }
            } else if (role) {
                query.role = { $regex: role }
            } else {
                query
            }

            const result = await User_Model.paginate(query, options)

            const baseUrl = req.baseUrl
            const hasNextPage = result.hasNextPage
                ? `${baseUrl}?page=${result.nextPage}`
                : null
            const hasPrevPage = result.hasPrevPage
                ? `${baseUrl}?page=${result.prevPage}`
                : null

            return {
                statusCode: 200,
                message: 'fetched successfully',
                data: { user: result, hasNextPage, hasPrevPage },
            }
        } catch (err) {
            logger.error(
                `User_Service_search_for_users_with_username_or_role -> Error : ${err.message}`
            )
        }
    }

    static async uploadYourProfilePicture(currentUser, file) {
        try {
            const { _id } = currentUser

            Helper_Function.mongooseIdValidation(id)
            Helper_Function.mongooseIdValidation(_id)

            const fetchUser = await User_Model.findById(_id)
            if (!fetchUser)
                return {
                    statusCode: 404,
                    message: 'resource not found',
                }

            if (fetchUser.profile_picture.length > 0)
                return {
                    statusCode: 406,
                    message: 'you already uploaded a picture',
                }

            const resizedBuffer = await sharp(file.path)
                .resize(580, 1000)
                .toFormat('jpg')
                .jpeg({ quality: 90 })
                .toBuffer()

            const uploadOptions = {
                resource: 'auto',
                folder: 'realEstate/images/users',
                format: 'jpg',
                public_id: `${fetchUser.username}-${Date.now()}`,
            }

            const profile_picture = []

            await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    uploadOptions,
                    (error, result) => {
                        if (error) {
                            console.log('Error', error)
                            reject(error)
                        } else {
                            profile_picture.push({
                                url: result.secure_url,
                                cloudinary_id: result.public_id,
                            })
                            resolve()
                        }
                    }
                )
                uploadStream.end(resizedBuffer)
            })

            fetchUser.profile_picture = profile_picture
            await fetchUser.save()

            return {
                statusCode: 200,
                message: 'profile picture uploaded',
                data: fetchUser,
            }
        } catch (error) {
            logger.error(
                `User_Service_uploadYourProfilePicture -> Error : ${error.message}`
            )
        }
    }

    static async updateYourProfilePicture(currentUser, file) {
        try {
            console.log('file', file)

            // getting the logged in user _id
            const { _id } = currentUser

            const user = await User_Model.findById(_id)
            if (!user)
                return {
                    statusCode: 401,
                    message: 'Unauthorized Access',
                }

            const maxImage = 1

            const selectedImageToUpload = file.length

            if (selectedImageToUpload > maxImage)
                return {
                    statusCode: 406,
                    message: `you can't select more than ${maxImage} image`,
                }

            const getImageCloudinaryId = user.profile_picture.map(
                (image) => image.cloudinary_id
            )

            const deleteAllImagesCloudinaryId = getImageCloudinaryId.map(
                async (cloudinaryId) =>
                    await cloudinary.uploader.destroy(cloudinaryId)
            )

            await Promise.all(deleteAllImagesCloudinaryId)

            const profile_picture = []

            const resizedBuffer = await sharp(file.path)
                .resize(580, 1000)
                .toFormat('jpg')
                .jpeg({ quality: 90 })
                .toBuffer()

            const uploadOptions = {
                resource: 'auto',
                folder: 'realEstate/images/users',
                format: 'jpg',
                public_id: `${user.username}-${Date.now()}`,
            }

            await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    uploadOptions,
                    (error, result) => {
                        if (error) {
                            console.log('Error', error)
                            reject(error)
                        } else {
                            profile_picture.push({
                                url: result.secure_url,
                                cloudinary_id: result.public_id,
                            })
                            resolve()
                        }
                    }
                )
                uploadStream.end(resizedBuffer)
            })

            user.profile_picture = profile_picture

            await user.save()

            // sending back the updated user to the client side
            return {
                statusCode: 200,
                message: 'successfully Updated your Profile ',
                data: { updated: user },
            }
        } catch (err) {
            logger.error(
                `User_Service_updateYourProfile -> Error : ${err.message}`
            )
        }
    }

    static async addToFavorites(currentUser, propertyId) {
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

            const user = await User_Model.findById({ _id })
            if (!user)
                return {
                    statusCode: 401,
                    message: 'Unauthorized Access No such user exists',
                }

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
                    message: 'Added Successfully',
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

            const user = await User_Model.findById({ _id })
            if (!user)
                return {
                    statusCode: 401,
                    message: 'Unauthorized Access No such user exists',
                }

            const alreadyAddedToFavorite = user.favorites.some(
                (fav) => fav.property.toString() === property.id.toString()
            )

            if (alreadyAddedToFavorite) {
                user.favorites.pull({ property: property.id })
                await user.save()
                return {
                    statusCode: 200,
                    message: 'successfully removed',
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
                `Failed To Add Property To Favorite -> Error: ${error.message} `
            )
        }
    }
}
