const express = require('express')
const router = express.Router()

router.get('/', (_, res) => res.send(process.uptime().toString()))

module.exports = router
