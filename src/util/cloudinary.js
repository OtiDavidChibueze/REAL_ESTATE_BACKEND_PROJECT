// Cloudinary Config
const cloudinary = require('cloudinary').v2
const {
    Cloud_Name,
    Cloud_Api,
    Cloud_Secret,
} = require('../config/keys/secretKeys.js')

// Configure the cloudinary object
cloudinary.config({
    cloud_name: Cloud_Name,
    api_key: Cloud_Api,
    api_secret: Cloud_Secret,
})

module.exports = { cloudinary }
