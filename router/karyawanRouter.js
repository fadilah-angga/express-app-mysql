const express = require('express')
const router = express.Router()
const { karyawanController } = require('../controller')

router.get('/karyawan', karyawanController.getKaryawan)
router.post('/add-karyawan', karyawanController.addKaryawan)
router.patch('/edit-karyawan/:id', karyawanController.editKaryawan)
router.delete('/delete-karyawan/:id', karyawanController.deleteKaryawan)

module.exports = router