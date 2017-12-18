
import uuid from 'uuid'
import {Router} from 'express'

import authorization from 'server/middleware/authorization'
import authentication from 'server/middleware/authentication'

import TodoModel from 'server/models/todo'

const router = new Router()

router.use(authentication())
router.use(authorization('public'))

router.get('/', async (req, res, next) => {
  req.app.locals.logger.info('requsted /todo')
  try {
    const results = await TodoModel.list({userId: res.locals.user.id})
    res.json(results)
  } catch (err) {
    next(err)
  }
})

router.post('/', async (req, res, next) => {
  req.app.locals.logger.info('creating /todo', req.body)
  try {
    const result = await TodoModel.create({
      id: uuid.v4(),
      text: req.body.text,
      userId: res.locals.user.id
    })
    res.json(result)
  } catch (err) {
    next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  req.app.locals.logger.info('fetching /todo', req.params)
  try {
    const result = await TodoModel.fetch({
      userId: res.locals.user.id,
      id: req.params.id
    })
    res.json(result)
  } catch (err) {
    next(err)
  }
})

router.put('/:id', async (req, res, next) => {
  req.app.locals.logger.info('putting /todo', req.params, req.body)
  try {
    const result = await TodoModel.update({
      userId: res.locals.user.id,
      id: req.params.id,
      text: req.body.text
    })
    res.json(result)
  } catch (err) {
    next(err)
  }
})

router.delete('/:id', async (req, res, next) => {
  req.app.locals.logger.info('deleting /todo', req.params)
  try {
    const result = await TodoModel.remove({
      userId: res.locals.user.id,
      id: req.params.id
    })
    res.json(result)
  } catch (err) {
    next(err)
  }
})

export default router
