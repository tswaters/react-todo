
import pino from 'pino'

const {LOG_LEVEL: level = 'info'} = process.env

const logger = pino({
  level,
  prettyPrint: process.env.NODE_ENV === 'development'
})

logger.level = level

export default logger
