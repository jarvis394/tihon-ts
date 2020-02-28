import * as express from 'express'
import bodyParser from 'body-parser'
// import morgan from 'morgan'
import { PORT, MODE } from '@config/keys'
import log from '@globals/log'
import app from '@globals/express'
import chalk from 'chalk'
import fs from 'fs'
import https from 'https'
import path from 'path'

// Middlewares
app.use(express.static('logs'))
app.use(bodyParser.json())
/*app.use(morgan((tokens, req, res) => {
  const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false })
  
  log.info([
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res), '-',
    tokens['response-time'](req, res) + 'ms'
  ].join(' '), { service: 'web' })
}))*/

// Routes
import './routes'

try {
  if (MODE === 'DEVELOPMENT') {
    app.listen(PORT)
  } else if (MODE === 'PRODUCTION') {
    const httpsOptions = {
      key: fs.readFileSync(path.resolve('src/services/web/key.pem')),
      cert: fs.readFileSync(path.resolve('src/services/web/cert.pem'))
    }
    https.createServer(httpsOptions, app).listen(PORT)
  }
  
  log.info(`Started on port ${PORT}`, { private: true, service: 'web' })
} catch (e) {
  log.error('On trying to start the web application:\n' + e)
}
