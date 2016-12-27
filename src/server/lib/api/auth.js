
import {Router} from 'express'
import {UserModel} from 'server/lib/models'

const router = new Router()

router.use((req, res, next) => {
  res.locals.userModel = new UserModel()
  next()
})

router.post('/register', (req, res, next) => {
  res.locals.userModel.register(req.body)
    .then(tokenId => {
      req.session.token = tokenId
      res.json({})
    })
    .catch(next)
})

router.post('/login', (req, res, next) => {
  res.locals.userModel.login(req.body)
    .then(tokenId => {
      req.session.token = tokenId
      res.json({})
    })
    .catch(next)
})

router.post('/logout', (req, res, next) => {
  res.locals.userModel.logout(req.session.token)
    .then(() => {
      req.session.destroy()
      res.json({})
    })
    .catch(next)
})

export default router
