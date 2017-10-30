
import Redis from 'ioredis'

const {
  REDIS_HOST = '127.0.0.1',
  REDIS_PORT = '6379',
  REDIS_DB = '0'
} = process.env

export default new Redis({
  port: parseInt(REDIS_PORT, 10),
  host: REDIS_HOST,
  db: parseInt(REDIS_DB, 10)
})
