const db = require('../db/db')
const { uploader } = require('../helper/uploader')
const fs = require('fs')

module.exports = ({
    uploadFile: (req, res) => {
        try {
            let path = '/images'
            const upload = uploader(path, 'IMG').fields([{name: 'file'}])

            upload(req, res, (error) => {
                if (error) {
                    console.log(error)
                    res.status(500).send(error)
                }

                const { file } = req.body
                const filePath = file ? path + '/' + file[0].filename : null

                let data = JSON.parse(req.body.data)

                let sqlInsert = `INSERT INTO album SET ?`
                db.query(sqlInsert, data, (err, result) => {
                    if (err) {
                        console.log(err)
                        fs.unlink('/public' + filePath)
                        res.status(500).send(err)
                    }
                    res.status(200).send({ message : 'Berhasil upload file'})
                })
            })
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    }
})