const express = require('express')
const { uploadController } = require('../controller')
const { auth } = require('../helper/authToken')
const router = express.Router()

router.post('/upload', auth, uploadController.uploadFile)

module.exports = router