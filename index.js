const express = require('express')
const cors = require('cors')
const db = require('./db/db')
const bearerToken = require('express-bearer-token')
const PORT = 3300
const app = express()
const { karyawanRouter, uploadRouter } = require('./router')

app.use(cors())
app.use(express.json())
app.use(bearerToken())

db.connect((err) => {
    if (err) { 
        return console.error(`error : ${err}`)
    }
    console.log(`connection to database successfully`) 
})


app.use('/api', karyawanRouter)
app.use('/album', uploadRouter)

app.listen(PORT, () => console.log('listening on port', PORT))