const { default: app } = require('../../../globals/express')

// Middlewares
const root = require('./root')
const api = require('./api')
const db = require('./db')

app.use('*', (_, res, next) => {
  res.set('Access-Control-Allow-Origin', '*')
  next()
})

app.use('/', root)
app.use('/api', api)
app.use('/db', db)
