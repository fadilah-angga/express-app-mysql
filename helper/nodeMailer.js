const nodeMailer = require('node-mailer')
require('dotenv').config()

const transporter = nodeMailer.createTrasnport({
    service: 'gmail',
    auth: {
        email: process.env.EMAIL,
        pass: process.env.APP_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
})

module.exports = transporter