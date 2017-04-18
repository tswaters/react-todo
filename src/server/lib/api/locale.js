
import {Router} from 'express'
import * as localeData from 'i18n/en'

const router = new Router()

router.post('/', (req, res) => {
  const {messages} = req.body
  const ret = messages.reduce((memo, item) => {
    memo[item] = localeData[item]
    return memo
  }, {})
  res.json({messages: ret})
})

export default router
