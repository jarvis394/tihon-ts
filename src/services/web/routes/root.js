const express = require('express')
const router = express.Router()

router.get('/', (_, res) => res.redirect('https://dedtihon.cf/'))

module.exports = router
