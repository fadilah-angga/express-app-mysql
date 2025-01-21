const jwt = require('jsonwebtoken')
require('dotenv').config()

module.exports = {
    auth: (req, res, next) => {
        jwt.verify(req.token, process.env.SECRET_KEY, (err, decode) => {
            if (err) {
                return res.status(401).send("Authentication failed")
            }
            req.user = decode
            next()
        })
    }
}