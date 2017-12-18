
import {Router} from 'express'
import BadRequest from 'server/errors/badRequest'
import authentication from 'server/middleware/authentication'
import * as localeData from 'i18n/en'

const router = new Router()

router.use(authentication(false))

router.post('/', (req, res) => {
  const {messages} = req.body

  if (!Array.isArray(messages)) {
    throw new BadRequest('messages must be provided')
  }

  res.json({
    messages: messages.reduce((memo, item) => {
      memo[item] = localeData[item]
      return memo
    }, {})
  })
})

export default router
