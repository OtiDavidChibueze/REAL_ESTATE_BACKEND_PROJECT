// Cloudinary Config
import cloudinary from 'cloudinary';
import { Cloud_Name, Cloud_Api, Cloud_Secret } from '../config/keys/secretKeys.js';

cloudinary.v2.config({
    cloud_name: Cloud_Name,
    api_key: Cloud_Api,
    api_secret: Cloud_Secret
});


export default cloudinary;