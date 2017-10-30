
import {Router} from 'express'
import authentication from 'server/middleware/authentication'
import UserModel from 'server/models/user'

const router = new Router()

router.post('/password', authentication(true), (req, res, next) => {
  UserModel.changePassword(res.locals.user, req.body)
    .then(({userName}) => res.json({userName}))
    .catch(err => next(err))
})

router.post('/profile', authentication(true), (req, res, next) => {
  const {id} = res.locals.user
  const {userName} = req.body
  UserModel.update({userName}, {where: {id}})
    .then(() => res.json({id, userName}))
    .catch(err => next(err))
})

router.get('/profile', authentication(true), (req, res) => {
  res.json({
    userName: res.locals.user.userName
  })
})

router.post('/register', (req, res, next) => {
  UserModel.register(req.body)
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
  UserModel.login(req.body)
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
  UserModel.logout(req.session.token)
    .then(() => {
      req.session.destroy()
      res.clearCookie('connect.sid')
      res.json({})
    })
    .catch(next)
})

export default router
