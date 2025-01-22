const express = require('express')
const router = express.Router()
const { auth } = require('../helper/authToken')
const { karyawanController } = require('../controller')

router.post('/login', karyawanController.login)

router.get('/karyawan', auth, karyawanController.getKaryawan)
router.post('/add-karyawan', auth, karyawanController.addKaryawan)
router.patch('/edit-karyawan/:id', auth, karyawanController.editKaryawan)
router.patch('/verify-karyawan', auth, karyawanController.verification)
router.delete('/delete-karyawan/:id', auth, karyawanController.deleteKaryawan)

module.exports = router