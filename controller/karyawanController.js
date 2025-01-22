const db = require('../db/db')

module.exports = {
    getKaryawan: (req, res) => {
        let query = `SELECT * FROM karyawan`

        if (req.query.name) {
            query = `SELECT * FROM karyawan WHERE name = ${db.escape(req.query.name)}`
        }
        db.query(query, (err, result) => {
            if (err) { 
                res.status(500).send(err)
            }

            res.status(200).send({message: 'Berhasil mendapatkan data karyawan ', data: result})
        })
    },
    addKaryawan: (req, res) => {
        let { name, email, no_hp } = req.body
        let insertQuery = `INSERT INTO karyawan (name, email, no_hp) VALUES (${db.escape(name)}, ${db.escape(email)}, ${db.escape(no_hp)})`
        db.query(insertQuery, (err, result) => {
            if (err) {
                res.status(500).send(err)
            }
            
            db.query(`SELECT * FROM karyawan WHERE name = '${name}'`, (err2, result2) => {
                if (err2) {
                    res.status(500).send(err)
                }

                res.status(200).send({message: 'Berhasil menambahkan data karyawan', data: result2})
            })
        })
    },
    editKaryawan: (req, res) => {
        let dataUpdate = []

        for (let prop in req.body) {
            dataUpdate.push(`${prop} = ${db.escape(req.body[prop])}`)
        }

        let updateQuery = `UPDATE karyawan SET ${dataUpdate} WHERE id = ${db.escape(req.params.id)}`

        db.query(updateQuery, (err, result) => {
            if (err) {
                res.status(500).send(err)
            }

            db.query(`SELECT * FROM karyawan WHERE id = ${db.escape(req.params.id)}`, (err2, result2) => {
                if (err2) {
                    res.status(500).send(err2)
                }

                res.status(200).send({message: 'Berhasil memperbarui data karyawan', data: result2})
            })
        })
    },
    deleteKaryawan: (req, res) => {
        deleteQuery = `DELETE FROM karyawan WHERE id = ${req.params.id}`

        db.query(deleteQuery, (err, result) => {
            if (err) {
                res.status(500).send(err)
            }

            res.status(200).send({message: 'Berhasil menghapus data karyawan'})
        })
    }
}