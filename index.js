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

app.listen(PORT, () => console.log('listening on port', PORT))