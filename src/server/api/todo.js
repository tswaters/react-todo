
import uuid from 'uuid'
import {Router} from 'express'

import authorization from 'server/middleware/authorization'
import authentication from 'server/middleware/authentication'

import TodoModel from 'server/models/todo'

const router = new Router()

router.use(authentication())
router.use(authorization('public'))

router.get('/', (req, res, next) => {
  req.app.locals.logger.info('requsted /todo')
  TodoModel.list({userId: res.locals.user.id})
    .then(results => res.json(results))
    .catch(next)
})

router.post('/', (req, res, next) => {
  req.app.locals.logger.info('creating /todo', req.body)
  TodoModel.create({
    id: uuid.v4(),
    text: req.body.text,
    userId: res.locals.user.id
  })
    .then(result => res.json(result))
    .catch(next)
})

router.get('/:id', (req, res, next) => {
  req.app.locals.logger.info('fetching /todo', req.params)
  TodoModel.fetch({
    userId: res.locals.user.id,
    id: req.params.id
  })
    .then(result => res.json(result))
    .catch(next)
})

router.put('/:id', (req, res, next) => {
  req.app.locals.logger.info('putting /todo', req.params, req.body)
  TodoModel.update({
    userId: res.locals.user.id,
    id: req.params.id,
    text: req.body.text
  })
    .then(result => res.json(result))
    .catch(next)
})

router.delete('/:id', (req, res, next) => {
  req.app.locals.logger.info('deleting /todo', req.params)
  TodoModel.remove({
    userId: res.locals.user.id,
    id: req.params.id
  })
    .then(result => res.json(result))
    .catch(next)
})

export default router
