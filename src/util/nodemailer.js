// Nodemailer
const nodemailer = require('nodemailer')
const { Mail, Mail_Password } = require('../config/keys/secretKeys')

module.exports = class Nodemailer {
    /**
     * @description - THIS IS USED TO SEND MAILS
     * @param {object} data - THE DATA OBJECT
     * @param {object} req - THE REQUEST OBJECT
     * @param {object} res - THE RESPONSE OBJECT
     * @memberof HelperFunction
     */
    static async sendEmail(data, req, res) {
        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: Mail,
                pass: Mail_Password,
            },
        })

        //* send mail with defined transport object
        let info = await transporter.sendMail({
            from: Mail,
            to: data.to, //* list of receivers
            subject: data.subject, //* Subject line
            text: data.text, //* plain text body
            html: data.html, //* html body
        })

        console.log('Message sent: %s', info.messageId)
        //* Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        //* Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))
        //* Preview URL: https://ether
    }
}
