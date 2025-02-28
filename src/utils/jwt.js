const jwt = require('jsonwebtoken')

// .env
require('dotenv').config()

const secreteKEY = process.env.SECRETEJWTKEY


const setUser = (user) => {
    return jwt.sign(user, secreteKEY)
}

const verifyUser = (user) => {
    return jwt.verify(user, secreteKEY)
}


module.exports = { setUser, verifyUser }