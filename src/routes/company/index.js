const express = require('express')
const router = express.Router()

const getCompanyDetails = require('./getCompanyDetails')

// Mount sub-routes
router.use('/company-details', getCompanyDetails)

module.exports = router
