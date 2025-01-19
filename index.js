const express = require('express')
const cors = require('cors')
const mysql = require('mysql')
const PORT = 3300
const app = express()

app.use(cors())
app.use(express.json())

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'db_kantor',
    port: 3306,
    multipleStatements: true
})

db.connect((err) => {
    if (err) {
        return console.error(`error : ${err}`)
    }
    console.log(`connection to database successfully`) 
})

app.get('/', (req, res) => {
    res.status(200).send('Welcome to home page')
})

app.get('/karyawan', (req, res) => {
    let sqlScript = 'SELECT * FROM karyawan'
    if (req.query.name) {
        sqlScript = `SELECT * FROM karyawan WHERE name = ${db.escape(req.query.name)}`
    }
    db.query(sqlScript, (err, results) => {
        if (err) console.error(`error : ${err.message}`)
        res.status(200).send(results)
    })
})

app.post('/karyawan', (req, res) => {
    let { name, email, no_hp } = req.body
    let insertQuery = `INSERT INTO karyawan VALUES (null, ${db.escape(name)}, ${db.escape(email)}, ${db.escape(no_hp)})`

    db.query(insertQuery, (err, results) => {
        if (err) res.status(500).send(err)
        
        db.query(`SELECT * FROM karyawan WHERE name = ${db.escape(name)};`, (err2, results2) => {
            if (err2) res.status(500).send(err2)
            res.status(200).send({ message: "Berhasil menambahkan data baru", data: results2 })
        })
    })
})

app.delete('/karyawan', (req, res) => {
    let id = req.query.id
    let deleteQuery = `DELETE FROM karyawan WHERE id = ${id}`
    let responseMessage = `{
            "status_code" : 200,
            "message" : "berhasil menghapus data"
        }`

    db.query(deleteQuery, (err, results) => {
        if (err) console.error(`error : ${err.message}`)
        res.status(200).send(JSON.parse(responseMessage))
    })
})

app.listen(PORT, () => console.log('listening on port', PORT))