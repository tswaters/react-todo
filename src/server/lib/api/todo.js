
import {Router} from 'express'

import {authentication, authorization} from 'server/lib/middleware'
import {TodoModel} from 'server/lib/models'

const router = new Router()

router.use(authentication())
router.use(authorization('public'))

router.use((req, res, next) => {
  res.locals.todoModel = new TodoModel(res.locals.user.id)
  next()
})

router.get('/', (req, res, next) => {
  res.locals.todoModel.list()
    .then(result => res.json(result))
    .catch(next)
})

router.post('/', (req, res, next) => {
  res.locals.todoModel.create(req.body)
    .then(result => res.json(result))
    .catch(next)
})

router.get('/:id', (req, res, next) => {
  res.locals.todoModel.fetch(req.params.id)
    .then(result => res.json(result))
    .catch(next)
})

router.put('/:id', (req, res, next) => {
  res.locals.todoModel.update(req.params.id, req.body)
    .then(result => res.json(result))
    .catch(next)
})

router.delete('/:id', (req, res, next) => {
  res.locals.todoModel.remove(req.params.id)
    .then(result => res.json(result))
    .catch(next)
})

export default router
