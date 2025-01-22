const express = require('express')
const cors = require('cors')
const db = require('./db/db')
const bearerToken = require('express-bearer-token')
const PORT = 3300
const app = express()

app.use(cors())
app.use(express.json())
app.use(bearerToken())

db.connect((err) => {
    if (err) { 
        return console.error(`error : ${err}`)
    }
    console.log(`connection to database successfully`) 
})

const router = require('./router')

app.use('/api', router.karyawanRouter)

// app.patch('/edit-karyawan/:id', (req, res) => {
//     let dataUpdate = []
//     for (let prop in req.body) {
//         dataUpdate.push(`${prop} = ${db.escape(req.body[prop])}`)
//     }

//     let updateQuery = `UPDATE karyawan SET ${dataUpdate} WHERE id = ${req.params.id}`
//     console.log(updateQuery)
//     db.query(updateQuery, (err, results) => {
//         if (err) res.status(500).send(err)

//         db.query(`SELECT * FROM karyawan WHERE id = ${req.params.id}`, (err2, results2) => {
//             if (err2) res.status(500).send(err2)
//             res.status(200).send({ message: "Berhasil mengubah data", data: results2})
//         })
//     })
// })

// app.delete('/delete-karyawan/:id', (req, res) => {
//     let deleteQuery = `DELETE FROM karyawan WHERE id = ${req.params.id}`
//     let responseMessage = `{
//             "status_code" : 200,
//             "message" : "berhasil menghapus data"
//         }`

//     db.query(deleteQuery, (err, results) => {
//         if (err) res.status(500).send(err)
//         res.status(200).send(JSON.parse(responseMessage))
//     })
// })

app.listen(PORT, () => console.log('listening on port', PORT))