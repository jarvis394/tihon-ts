import * as express from 'express'
import bodyParser from 'body-parser'
import { PORT } from '@config/keys'
import log from '@globals/log'
import app from '@globals/express'

// Middlewares
app.use(express.static('logs'))
app.use(bodyParser.json())

// Routes
import './routes'

app.listen(PORT, () => log.info(`[WEB] Started on port ${PORT}`, { private: true }))
