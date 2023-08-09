// Property Routes
import express from 'express';
import Property_Controller from '../controller/property.js';
const routes = express.Router();
import Authorization from '../middleware/authorization.js'
import upload from '../util/multer.js';

// post
routes.post('/create/form', Authorization, Property_Controller.createPropertyForm)
routes.post('/:id/upload/images', Authorization, upload.array('images', 10), Property_Controller.uploadImagesToAPropertyById)


// put
routes.put('/update/:id', Authorization, Property_Controller.updatePropertyById);

// delete
routes.delete("/delete/:id", Authorization, Property_Controller.deletePropertyById);

export default routes
