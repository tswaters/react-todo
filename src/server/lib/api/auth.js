
import {Router} from 'express'
import {UserModel} from 'server/lib/models'
import authentication from 'server/lib/middleware/authentication'

const router = new Router()

router.use((req, res, next) => {
  res.locals.userModel = new UserModel()
  next()
})

router.post('/password', authentication(true), (req, res, next) => {
  res.locals.userModel.changePassword(res.locals.user, req.body)
    .then(({userName}) => res.json({userName}))
    .catch(err => next(err))
})

router.post('/profile', authentication(true), (req, res, next) => {
  res.locals.userModel.update(res.locals.user.id, req.body)
    .then(({userName}) => res.json({userName}))
    .catch(err => next(err))
})

router.get('/profile', authentication(true), (req, res) => {
  res.json({
    userName: res.locals.user.userName
  })
})

router.post('/register', (req, res, next) => {
  res.locals.userModel.register(req.body)
    .then(tokenId => {
      req.session.token = tokenId
      res.json({
        token: tokenId,
        userName: req.body.userName
      })
    })
    .catch(next)
})

router.post('/login', (req, res, next) => {
  res.locals.userModel.login(req.body)
    .then(user => {
      req.session.token = user.token
      res.json({
        token: user.token,
        userName: user.userName
      })
    })
    .catch(next)
})

router.post('/logout', (req, res, next) => {
  res.locals.userModel.logout(req.session.token)
    .then(() => {
      req.session.destroy()
      res.clearCookie('connect.sid')
      res.json({})
    })
    .catch(next)
})

export default router
