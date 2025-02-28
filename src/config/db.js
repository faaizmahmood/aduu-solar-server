const mongoose = require('mongoose')

require('dotenv').config()

mongoURL = process.env.MONGO_URL

mongoose.connect(mongoURL)

const db = mongoose.connection

db.on('connected', () => {
    console.log('DB Connected...')
})

db.on('error', () => {
    console.log("DB error")
})


module.exports = db