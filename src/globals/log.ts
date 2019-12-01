import { createLogger, format, transports } from 'winston'
import { COLORS, LEVELS } from '../config/logger'
import chalk from 'chalk'

const { combine, timestamp, splat, json, errors, simple, printf } = format

const ignorePrivate = format(info => {
  if (info.private) return false
  return info
})

const consoleFormat = printf(info => {
  const timestamp = new Date(info.timestamp).toLocaleTimeString('en-US', { hour12: false })
  const level: string = COLORS[info.level](`${info.level.toUpperCase()}`)
  const alignmentLevel = ' '.repeat(7 - info.level.length)
  const service = info.service || 'vk'
  const alignmentService = ' '.repeat(3 - service.length)
  let m = `${chalk.bold(chalk.gray(timestamp))}  [${service.toUpperCase()}]${alignmentService} ${info.level === 'error' ? chalk.bold(level) : level} ${alignmentLevel}`

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
