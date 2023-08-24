// Payment Route
const express = require('express')
const router = express.Router()
const Payment_Controller = require('../controller/payment.js')
const Authorization = require('../middleware/authorization.js')

//Get
router.get(
    '/:id/verify/transaction',
    Authorization,
    Payment_Controller.verifyTransactionByRef_id
)

//Post
router.post(
    '/:id/property',
    Authorization,
    Payment_Controller.initializePayment
)
router.post(
    '/flutterwave/webhook',
    Authorization,
    Payment_Controller.handleWebhookNotification
)

module.exports = router
