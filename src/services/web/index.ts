import * as express from 'express'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import { PORT } from '@config/keys'
import log from '@globals/log'
import app from '@globals/express'
import chalk from 'chalk'

// Middlewares
app.use(express.static('logs'))
app.use(bodyParser.json())
app.use(morgan((tokens, req, res) => {
  const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false })
  
  return chalk.gray([
    timestamp,
    '[WEB]  INFO   ',
    '<' + tokens.method(req, res) + '>',
    tokens.url(req, res),
    tokens.status(req, res), '-',
    tokens['response-time'](req, res) + 'ms'
  ].join(' '))
}))

// Routes
import './routes'

app.listen(PORT, () => log.info(`Started on port ${PORT}`, { private: true, service: 'web' }))
