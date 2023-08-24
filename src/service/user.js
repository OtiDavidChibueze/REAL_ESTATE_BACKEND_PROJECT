// User Service
const User_Model = require('../model/user.js')
const Helper_Function = require('../util/helperFunction.js')
const Token = require('../util/token.js')
const InvalidTokenModel = require('../model/invalidTokens.js')
const logger = require('../config/logger.js')
const { cloudinary } = require('../util/cloudinary.js')
const sharp = require('sharp')
const PropertyModel = require('../model/property.js')
const Nodemailer = require('../util/nodemailer.js')
const crypto = require('crypto')
module.exports = class User_Service {
    /**
     * @description - User Endpoints
     */

    /**
     * @description - this endpoint allows users to view their profile
     * @param {string} currentUser - getting the logged in user
     * @returns - returns a json object
     */
    static async getProfile(currentUser) {
        try {
            const { _id } = currentUser

            Helper_Function.mongooseIdValidation(_id)

            const user = await User_Model.find(_id).select('-password')

            if (currentUser._id === user.id) {
                return {
                    statusCode: 200,
                    message: 'fetched your profile',
                    data: { user },
                }
            } else {
                return {
                    statusCode: 401,
                    message: 'unauthorized to perform this action',
                }
            }
        } catch (error) {
            logger.error(`User_Service_getProfile -> Error: ${error.message}`)
        }
    }

    /**
     * @description - this endpoint allows a user to get other users by their id
     * @param {string} userId - the user id passed in the params
     * @returns - returns a json object
     */
    static async getAUserById(userId) {
        try {
            const { id } = userId

            Helper_Function.mongooseIdValidation(id)

            const user = await User_Model.findById(id)
                .populate({
                    path: 'favorites.property',
                    select: 'pricePerYear title',
                })
                .select(
                    '-password -createdAt -updatedAt -profile_picture.cloudinary_id -profile_picture._id -__v'
                )
                .sort({ createdAt: -1 })

            if (user) {
                return {
                    statusCode: 200,
                    message: 'Successfully fetched a single user',
                    data: { user },
                }
            } else {
                return {
                    statusCode: 404,
                    message: 'user with the provided id not found',
                }
            }
        } catch (err) {
            logger.error(`User_Service_getAUserById -> Error : ${err.message}`)
        }
    }

    /**
     * @description - this endpoint is used for registering a new user
     * @param {object} data - the new users credentials
     * @returns - returns a json object
     */
    static async registerUser(data) {
        try {
            const { username, email, password, phonenumber } = data

            const phonenumberExists = await User_Model.findOne({
                phonenumber: phonenumber,
            })
            if (phonenumberExists)
                return {
                    statusCode: 406,
                    message:
                        'phone number already taken please input a different one',
                }

            const userExists = await User_Model.findOne({ email: email })
            if (userExists)
                return {
                    statusCode: 406,
                    message: 'email already exists  , user already registered',
                }

            const hashPassword = Helper_Function.hashPassword(password)

            const newUser = await new User_Model({
                username: username,
                email: email,
                password: hashPassword,
                phonenumber,
            }).save()

            newUser.password = undefined

            const { createdAt, updatedAt, __v, ...others } = newUser._doc

            return {
                statusCode: 201,
                message: 'User created successfully',
                data: { newUser: others },
            }
        } catch (err) {
            logger.error(`User_Service_registerUser -> Error : ${err.message}`)
        }
    }

    /**
     * @description - this endpoint allows users to login using their email and password
     * @param {object} data - the new users credentials
     * @returns - returns a json object
     */
    static async signIn(data) {
        try {
            const { email, password } = data

            const user = await User_Model.findOne({ email: email })
            if (!user)
                return {
                    statusCode: 404,
                    message: 'incorrect email',
                }

            const oldPassword = Helper_Function.comparePassword(
                password,
                user.password
            )
            if (!oldPassword)
                return {
                    statusCode: 404,
                    message: 'incorrect password',
                }

            const generateToken = Token.generateToken(user)

            const invalidToken = await InvalidTokenModel.findOne({
                invalidToken: generateToken,
            })
            if (invalidToken)
                return {
                    statusCode: 403,
                    message: 'invalid token , pls login',
                }

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

    /**
     * @description - this endpoint allows users to update their profile
     * @param {object} data - the object data
     * @param {string} currentUser - the logged in user
     * @returns - returns a json object
     */
    static async updateYourProfile(data, currentUser) {
        try {
            const { username, phonenumber, email } = data

            const { _id } = currentUser

            Helper_Function.mongooseIdValidation(_id)

            const user = await User_Model.findById(_id)

            if (user.id === currentUser._id) {
                user.username = username || user.username
                user.phonenumber = phonenumber || user.phonenumber
                user.email = email || user.email

                if (phonenumber !== user.phonenumber) {
                    const phonenumberExists = await User_Model.findOne({
                        phonenumber: phonenumber,
                    })
                    if (phonenumberExists)
                        return {
                            statusCode: 406,
                            message:
                                'phone number already taken please input a different one',
                        }
                }

                await user.save()

                const {
                    password,
                    createdAt,
                    updatedAt,
                    profile_picture,
                    favorites,
                    role,
                    ...others
                } = user._doc

                return {
                    statusCode: 200,
                    message: 'successfully Updated your Profile ',
                    data: { updated: others },
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

    /**
     * @description - this endpoint allows users to delete their accounts
     * @param {string} currentUser - the logged in user
     * @returns - returns a json object
     */
    static async deleteYourAccount(currentUser) {
        try {
            const { _id } = currentUser

            Helper_Function.mongooseIdValidation(_id)

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

                return {
                    statusCode: 200,
                    message: 'you successfully deleted your account ',
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

    /**
     * @description - this endpoint allows admins to get all admins
     * @param {string} currentUser - the logged in user
     * @returns - returns a json object
     */
    static async getAllAdmins(currentUser) {
        try {
            const { _id } = currentUser

            const user = await User_Model.findById(_id)

            if (user.role === 'admin') {
                const admins = await User_Model.find({ role: 'admin' }).select(
                    '-password -createdAt -updatedAt -__v -favorites'
                )

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
            } else {
                return {
                    statusCode: 403,
                    message: 'Unauthorized to perform the action',
                }
            }
        } catch (error) {
            logger.error(`User_Service_getAllAdmins -> Error : ${err.message}`)
        }
    }

    /**
     * @description - this endpoint allows admins/agents to get all agents
     * @param {string} currentUser - the logged in user
     * @returns - returns a json object
     */
    static async getAllAgents(currentUser) {
        try {
            const { _id } = currentUser

            const user = await User_Model.findById(_id)

            if (user.role === 'admin' || user.role === 'agent') {
                const agents = await User_Model.find({ role: 'agent' }).select(
                    '-password -createdAt -updatedAt -__v -favorites'
                )

                const counts = agents.length

                if (!agents)
                    return {
                        statusCode: 200,
                        message: { agents: [], counts: 0 },
                    }

                return {
                    statusCode: 200,
                    message: 'fetched all agents',
                    data: { agents, counts },
                }
            } else {
                return {
                    statusCode: 403,
                    message: 'Unauthorized to perform the action',
                }
            }
        } catch (error) {
            logger.error(`User_Service_getAllAgents -> Error : ${err.message}`)
        }
    }

    /**
     * @description - this endpoint allows admins to delete a user by id
     * @param {string} userId - the user id to be deleted
     * @param {string} currentUser - the logged in user
     * @returns - returns a json object
     */
    static async deleteAUserById(userId, currentUser) {
        try {
            const { id } = userId

            const { _id } = currentUser

            Helper_Function.mongooseIdValidation(id)
            Helper_Function.mongooseIdValidation(_id)

            const user = await User_Model.findById(id)
            if (!user)
                return {
                    statusCode: 404,
                    message: 'user with the provided id not found',
                }

            if (currentUser.role === 'admin') {
                const getImageCloudinaryId = user.profile_picture.map(
                    (image) => image.cloudinary_id
                )

                const deleteImage = getImageCloudinaryId.map(
                    async (cloudinaryId) =>
                        await cloudinary.uploader.destroy(cloudinaryId)
                )

                await Promise.all(deleteImage)

                await User_Model.findByIdAndDelete(_id)

                return {
                    statusCode: 200,
                    message: 'successfully deleted this user account ',
                }
            } else {
                return {
                    statusCode: 401,
                    message: 'Unauthorized to delete this account',
                }
            }
        } catch (err) {
            logger.error(
                `User_Service_deleteAUserAccountById -> Error : ${err.message}`
            )
        }
    }

    /**
     * @description - this endpoint allows users to get all users or search for users by username or role using query
     * @param {object} req - the request object
     * @returns - returns a json object
     */
    static async search_for_users_with_username_or_role(req) {
        try {
            const options = {
                page: req.query.page ? parseInt(req.query.page) : 1,
                limit: req.query.page ? parseInt(req.query.limit) : 20,
                sort: { createdAt: -1 },
                populate: {
                    path: 'favorites.property',
                    select: 'pricePerYear title',
                },
                select: '-password -createdAt -updatedAt -profile_picture.cloudinary_id -profile_picture._id -__v -favorites -email -phonenumber',
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
            result.hasNextPage ? `${baseUrl}?page=${result.nextPage}` : null
            result.hasPrevPage ? `${baseUrl}?page=${result.prevPage}` : null

            const { totalDocs, limit, totalPages, pagingCounter, ...others } =
                result

            const usersCount = await User_Model.countDocuments()

            if (usersCount <= 0)
                return {
                    statusCode: 404,
                    message: { counts: [0] },
                }

            return {
                statusCode: 200,
                message: 'fetched successfully',
                data: { user: others, usersCount },
            }
        } catch (err) {
            logger.error(
                `User_Service_search_for_users_with_username_or_role -> Error : ${err.message}`
            )
        }
    }

    /**
     * @description - this endpoint allows users upload their profile picture
     * @param {string} currentUser - the logged in user
     * @param {object} file - the file/image to upload
     * @returns - returns a json object
     */
    static async uploadYourProfilePicture(currentUser, file) {
        try {
            const { _id } = currentUser

            Helper_Function.mongooseIdValidation(_id)

            const user = await User_Model.findById(_id)

            if (!file)
                return {
                    statusCode: 404,
                    message: 'no file selected',
                }

            if (user.profile_picture.length > 0)
                return {
                    statusCode: 406,
                    message: 'you already uploaded a picture',
                }

            const imageMax = 1
            const selectedImageToUpload = file.length

            if (selectedImageToUpload > maxImage)
                return {
                    statusCode: 406,
                    message: `you can't select more than ${maxImage} image`,
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
                public_id: `${user.username}-${Date.now()}`,
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

            user.profile_picture = profile_picture
            await user.save()

            return {
                statusCode: 200,
                message: 'profile picture uploaded',
                data: user.profile_picture,
            }
        } catch (error) {
            logger.error(
                `User_Service_uploadYourProfilePicture -> Error : ${error.message}`
            )
        }
    }

    /**
     * @description - this endpoint allows users update their profile picture
     * @param {string} currentUser - the logged in user
     * @param {object} file - the file/image to upload
     * @returns - returns a json object
     */
    static async updateYourProfilePicture(currentUser, file) {
        try {
            const { _id } = currentUser

            const user = await User_Model.findById(_id)

            if (!file)
                return {
                    statusCode: 404,
                    message: 'no file selected',
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

            return {
                statusCode: 200,
                message: 'successfully Updated your Profile ',
                data: { updated: user.profile_picture },
            }
        } catch (err) {
            logger.error(
                `User_Service_updateYourProfile -> Error : ${err.message}`
            )
        }
    }

    /**
     * @description - this endpoint allows admins to update a user by id
     * @param {object} userData - the users credentials
     * @param {string} currentUser - the currentUser
     * @param {string} userId - the user id to update
     * @returns - returns a json object
     */
    static async updateUserById(userData, currentUser, userId) {
        try {
            const { username, phonenumber, role } = userData

            const { id } = userId

            const { _id } = currentUser

            Helper_Function.mongooseIdValidation(id)
            Helper_Function.mongooseIdValidation(_id)

            const user = await User_Model.findById(id)
            if (!user)
                return {
                    statusCode: 404,
                    message: 'user with the provided id not found',
                }

            const loggedInUser = await User_Model.findById(_id)

            if (loggedInUser.role === 'admin') {
                user.username = username || user.username
                user.phonenumber = phonenumber || user.phonenumber
                user.role = userData.role || user.role

                await user.save()

                const {
                    password,
                    createdAt,
                    updatedAt,
                    profile_picture,
                    favorites,
                    role,
                    ...others
                } = user._doc

                return {
                    statusCode: 200,
                    message: 'updated user successfully',
                    data: { updated: others },
                }
            } else {
                return {
                    statusCode: 403,
                    message: "You don't have permission to perform this action",
                }
            }
        } catch (err) {
            logger.error(
                `User_Service_updateUserById -> Error: ${err.message} `
            )
        }
    }

    /**
     * @description - this endpoint allows users change password
     * @param {object} data - the object data
     * @param {string} id - the current User
     * @returns - returns a json object
     */
    static async changePassword(data, currentUser) {
        try {
            let { oldPassword, newPassword } = data

            const { _id } = currentUser

            Helper_Function.mongooseIdValidation(_id)

            const user = await User_Model.findById(_id)

            const comparePassword = Helper_Function.comparePassword(
                oldPassword,
                user.password
            )

            if (comparePassword) {
                const hashPassword = Helper_Function.hashPassword(newPassword)

                user.password = hashPassword

                await user.save()

                return {
                    statusCode: 200,
                    message: 'password updated successfully',
                }
            } else {
                return {
                    statusCode: 400,
                    message: 'incorrect oldPassword',
                }
            }
        } catch (error) {
            logger.error(
                `User_Service_changePassword -> Error: ${error.message} `
            )
        }
    }

    /**
     * @description - this endpoint allows users request for a forget password link
     * @param {string} userEmail - the user email who forgot his or her password
     * @returns - returns a json object
     */
    static async forgottenPassword(userEmail) {
        try {
            const { email } = userEmail

            const user = await User_Model.findOne({ email: email })

            if (!user)
                return {
                    statusCode: 404,
                    message: 'no user registered with this email',
                }

            const resetToken = await Helper_Function.generatePasswordResetToken(
                user
            )

            const resetUrl = `please click the link to reset your password , link valid for 10min. <a href=http://localhost:7070/api/v1/user/reset/${resetToken}/password>click here</a>`

            const data = {
                to: `${email}`,
                subject: 'reset your password',
                html: `<h1>Hi there You requested to reset your password</h1><p>${resetUrl}</p>`,
            }

            await Nodemailer.sendEmail(data)

            return {
                statusCode: 200,
                message: 'a reset link has been sent to your provided email',
            }
        } catch (err) {
            logger.error(
                `User_Service_forgottenPassword -> Error: ${err.message} `
            )
        }
    }

    /**
     * @description - this endpoint allows users reset their password after receiving a forget password link
     * @param {string} resetToken - the resetToken generated from the forgotten password link
     * @param {object} data - the object data
     * @returns - returns a json object
     */
    static async resetPassword(resetToken, data) {
        try {
            const { newPassword, comfirmPassword } = data

            const { id } = resetToken

            const hashResetToken = crypto
                .createHash('sha256')
                .update(id)
                .digest('hex')

            const userWithToken = await User_Model.findOne({
                passwordResetToken: hashResetToken,
                passwordResetTokenExpiresAt: { $gt: Date.now() },
            })

            if (userWithToken) {
                if (newPassword === comfirmPassword) {
                    const hashPassword =
                        Helper_Function.hashPassword(newPassword)

                    userWithToken.password = hashPassword
                    userWithToken.passwordResetToken = null
                    userWithToken.passwordResetTokenExpiresAt = null
                    userWithToken.passwordChangedAt = Date.now()

                    await userWithToken.save()

                    return {
                        statusCode: 200,
                        message:
                            "your account's password  successfully changed, please login",
                    }
                } else {
                    return {
                        statusCode: 406,
                        message: 'passwords do not match',
                    }
                }
            } else {
                return {
                    statusCode: 417,
                    message: 'invalid token or expired link',
                }
            }
        } catch (err) {
            logger.error(`User_Service_resetPassword -> Error: ${err.message} `)
        }
    }

    /**
     * @description - this endpoint allows users log out from the application
     * @param {string} headers - the  headers authorization
     * @returns - returns a json object
     */
    static async logOut(headers) {
        try {
            const authHeader = headers.authorization

            const token = authHeader.split(' ')[1]
            console.log('token', token)

            const findToken = await InvalidTokenModel.findOne({ token: token })
            console.log('findToken', findToken)

            if (!findToken) {
                await new InvalidTokenModel({ invalidToken: token }).save()

                return {
                    statusCode: 401,
                    message: ' you logged out successfully',
                }
            } else {
                return {
                    statusCode: 401,
                    message: 'Unauthorized Access , token expired;',
                }
            }
        } catch (error) {
            logger.error(`User_Service_logOut -> Error: ${error.message} `)
        }
    }
}
