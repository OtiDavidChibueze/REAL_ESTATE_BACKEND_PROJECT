// Property Routes
const express = require('express')
const Property_Controller = require('../controller/property.js')
const routes = express.Router()
const Authorization = require('../middleware/authorization.js')
const { upload } = require('../util/multer.js')

// post
routes.post(
    '/create/form',
    Authorization,
    Property_Controller.createPropertyForm
)
routes.post(
    '/:id/upload/images',
    Authorization,
    upload.array('images', 10),
    Property_Controller.uploadImagesToAPropertyById
)

// put
routes.put('/update/:id', Authorization, Property_Controller.updatePropertyById)
routes.put(
    '/:id/update/images',
    Authorization,
    upload.array('images', 10),
    Property_Controller.updateImagesToAPropertyById
)

// delete
routes.delete(
    '/delete/:id',
    Authorization,
    Property_Controller.deletePropertyById
)
routes.delete(
    '/:id/delete/images',
    Authorization,
    Property_Controller.deleteAllImagesToAPropertyById
)

module.exports = routes
