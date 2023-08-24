// Payment Service
const axios = require('axios')
const {
    Flutter_Wave_Secret_key,
    BaseUrl,
} = require('../config/keys/secretKeys')
const logger = require('../config/logger')
const Helper_Function = require('../util/helperFunction')
const PropertyModel = require('../model/property')
const UserModel = require('../model/user')
const PaymentModel = require('../model/payment')

module.exports = class Payment_Service {
    static async initializePayment(data, propertyId, currentUser) {
        try {
            const { selectCurrency } = data

            const { id } = propertyId

            const { _id } = currentUser

            Helper_Function.mongooseIdValidation(id)

            Helper_Function.mongooseIdValidation(_id)

            const Flutter_Wave_Payment_Url =
                'https://api.flutterwave.com/v3/payments'

            const property = await PropertyModel.findById(id)
            if (!property)
                return {
                    statusCode: 404,
                    message: 'Property with the provided id not found',
                }

            if (property.paymentMethod)
                return {
                    statusCode: 406,
                    message: 'This property has already been paid for',
                }

            const user = await UserModel.findById(_id)

            const requestHeader = {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${Flutter_Wave_Secret_key}`,
            }

            const paymentData = {
                tx_ref: `${user.id}-${Date.now()}`,
                property: property.id,
                selectCurrency,
                amount: property.pricePerYear.amount,
                customer: {
                    userRefId: user.id,
                    email: user.email,
                    phonenumber: user.phonenumber,
                    username: user.username,
                    property: property.id,
                },
                customization: {
                    title: 'Real-Estate',
                    logo: 'https://www.soroptimistindianrock.org/wp-content/uploads/2021/01/PAYMENT-SUCCESS.png',
                },
                redirect_url: BaseUrl,
            }

            const response = await axios.post(
                Flutter_Wave_Payment_Url,
                paymentData,
                { headers: requestHeader }
            )

            if (response.data.status === 'success') {
                const savePayment = await new PaymentModel(paymentData).save()

                await property.updateOne({
                    $push: { paymentMethod: savePayment.id },
                    $set: { availability: false },
                })

                const paymentLink = response.data.data.link

                //NB: the client would be redirected to the link
                return {
                    statusCode: 200,
                    message: 'payment initiated successfully',
                    data: { payment_link: paymentLink },
                }
            } else {
                return {
                    statusCode: 500,
                    message: 'payment initiation failed',
                }
            }
        } catch (error) {
            logger.error(
                `Property_Service_Payment_Service -> Error: ${error.message}`
            )
        }
    }

    static async handleWebhookNotification(webhookData) {
        try {


            const requestHeader = {
                'content-type': 'application/json',
                Authorization: `Bearer ${Flutter_Wave_Secret_key}`,
            }

            const isValidResponse = await axios.get(
                `https://api.flutterwave.com/v3/transactions/${webhookData.data.tx_ref}/verify`,
                {
                    headers: requestHeader,
                }
            )

            if (isValidResponse.data.data.status === 'success') {
                const txRef = webhookData.data.tx_ref

                const payment = await PaymentModel.findOne({ tx_ref: txRef })

                if (payment) {
                    payment.status = webhookData.data.status

                    await payment.save()

                    return {
                        statusCode: 200,
                        message: 'Webhook received and processed successfully',
                    }
                }
            } else {
                return {
                    statusCode: 400,
                    message: 'Invalid webhook signature or event',
                }
            }
        } catch (err) {
            logger.error(
                `Payment_Service_handleWebhookNotification -> Error: ${err.message}`
            )
        }
    }
}
