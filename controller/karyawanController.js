const db = require('../db/db')
const Crypto = require('crypto')
const { createToken } = require('../helper/createToken')
const transporter = require('../helper/nodeMailer')
require('dotenv').config()

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
        let { name, email, password, no_hp } = req.body
        password = Crypto.createHmac('sha256', 'hash123').update(password).digest('hex')
        let insertQuery = `INSERT INTO karyawan (name, email, password, no_hp) VALUES (${db.escape(name)}, ${db.escape(email)}, ${db.escape(password)}, ${db.escape(no_hp)})`
        db.query(insertQuery, (err, result) => {
            if (err) {
                return res.status(500).send(err)
            }
            
            db.query(`SELECT * FROM karyawan WHERE name = '${name}'`, (err2, result2) => {
                if (err2) {
                    return res.status(500).send(err)
                }

                // bahan data untuk membuat token
                let { id, name, email, no_hp, status } = result2[0]
                // membuat token
                let token = createToken({ id, name, email, no_hp, status })

                let mail = {
                    from: `Admin <${process.env.EMAIL}>`,
                    to: `${email}`,
                    subject: `Account Verification`,
                    html: `<a href='http://localhost:3000/authentication/${token}'>Click here for verify your account</a>`,
                }

                transporter.sendMail(mail, (errMail, resMail) => {
                    if (errMail) {
                        return res.status(500).send({message: 'Gagal Register!', success: false, err: errMail});
                    }
                    res.status(200).send({message: 'Berhasil Register!, silahkan cek email', success: true, token: token})
                })
            })
        })
    },
    verification: (req, res) => {
        let updateQuery = `UPDATE karyawan SET status='Verified' WHERE id='${req.user.id}'`

        db.query(updateQuery, (err, results) => {
            if (err) {
                res.status(500).send(err)
            }
            res.status(200).send({message: 'Berhasil verifikasi akun!', success: true})
        })
    },
    login: (req, res) => {
        req.body.password = Crypto.createHmac('sha256', 'hash123').update(req.body.password).digest('hex')

        let scriptQuery = `SELECT * FROM karyawan WHERE email='${req.body.email}' AND password='${req.body.password}'`
        db.query(scriptQuery, (err, results) => {
            if (err) {
                res.status(500).send(err)
            }

            if (results[0]) {
                let { id, name, email, password, no_hp, status } = results[0]
                let token = createToken({id, name, email, password, no_hp, status})
                if (status != 'Verified') {
                    res.status(200).send({message: 'Your account not verified'})
                } else {
                    res.status(200).send({dataLogin: results[0], token, message: 'Login successful'})
                }
            }
        })
    },
    editKaryawan: (req, res) => {
        let dataUpdate = []

        for (let prop in req.body) {
            if (prop === 'password') {
                req.body[prop] = Crypto.createHmac('sha256', 'hash123').update(req.body[prop]).digest('hex')
            }
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