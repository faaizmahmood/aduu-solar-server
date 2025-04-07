const express = require('express')
const router = express.Router()

const companyRegister = require('./company')
const signIn = require('./signin')
const signUp = require('./signup')

// Combine auth routes
router.use('/company', companyRegister)
router.use('/signin', signIn)
router.use('/signup', signUp)

module.exports = router