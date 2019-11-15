import { createLogger, format, transports } from 'winston'

const { combine, timestamp, splat, json, errors, simple, printf } = format
const { COLORS, LEVELS } = require('../config/logger')

const ignorePrivate = format(info => {
  if (info.private) return false
  return info
})

const consoleFormat = printf(info => {
  let m = `[${COLORS[info.level](`${info.level}`)}]  `

  if (info.stack) m += info.stack
  else m += info.message

  return m
})

const log = createLogger({
  level: 'info',
  levels: LEVELS,
  exitOnError: false,
  format: combine(timestamp(), errors({ stack: true }), splat(), json()),
  transports: [
    new transports.File({
      filename: 'logs/error.log',
      format: ignorePrivate(),
      level: 'error',
      handleExceptions: true,
    }),
    new transports.File({
      filename: 'logs/main.log',
      format: ignorePrivate(),
      level: 'command',
      handleExceptions: true,
    }),
    new transports.Console({
      level: 'command',
      format: combine(simple(), consoleFormat),
      handleExceptions: true,
    }),
  ],
})

export default log
