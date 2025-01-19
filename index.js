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

app.listen(PORT, () => console.log('listening on port', PORT))