import { createLogger, format, transports } from 'winston'
const { combine, timestamp, splat, json } = format

const commandLogger = createLogger({
  level: 'info',
  levels: { random: 0, anon: 1 },
  exitOnError: false,
  format: combine(timestamp(), splat(), json()),
  transports: [
    new transports.File({
      filename: 'logs/commands.log',
      level: 'anon',
    }),
  ],
})

export default commandLogger
