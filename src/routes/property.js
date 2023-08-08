// Property Routes
import express from 'express';
import Property_Controller from '../controller/property.js';
const routes = express.Router();
import Authorization from '../middleware/authorization.js'


// post
routes.post('/create/form', Authorization, Property_Controller.createPropertyForm)

// put
routes.put('/update/:id', Authorization, Property_Controller.updatePropertyById);

// delete
routes.delete("/delete/:id", Authorization, Property_Controller.deletePropertyById);

export default routes
