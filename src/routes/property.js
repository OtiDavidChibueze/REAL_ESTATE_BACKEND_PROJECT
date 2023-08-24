// Property Routes
const express = require('express')
const Property_Controller = require('../controller/property.js')
const routes = express.Router()
const Authorization = require('../middleware/authorization.js')
const { upload } = require('../util/multer.js')
const SchemaValidationHelper = require('../validation/schemaValidationHelper.js')
const {
    validateUpdateInput,
    validateInput,
} = require('../validation/schema/property.js')

// post
routes.post(
    '/create/form',
    Authorization,
    Property_Controller.createPropertyForm
)
routes.post(
    '/:id/add/to/favorites',
    Authorization,
    Property_Controller.addPropertyToFavorites
)
routes.post(
    '/:id/remove/from/favorites',
    Authorization,
    Property_Controller.removeFromFavorites
)
routes.post(
    '/:id/upload/images',
    Authorization,
    upload.array('images', 10),
    Property_Controller.uploadImagesToAPropertyById
)
routes.post(
    '/:id/add/review',
    Authorization,
    SchemaValidationHelper.validate(validateUpdateInput),
    Property_Controller.addAReviewToAProperty
)

// put
routes.put(
    '/update/:id',
    Authorization,
    SchemaValidationHelper.validate(validateInput),
    Property_Controller.updatePropertyById
)
routes.put(
    '/:id/update/review',
    Authorization,
    SchemaValidationHelper.validate(validateUpdateInput),
    Property_Controller.updateReviewToAProperty
)
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
routes.delete(
    '/:propertyId/delete/review/:reviewId',
    Authorization,
    Property_Controller.deleteReviewToAProperty
)

module.exports = routes
