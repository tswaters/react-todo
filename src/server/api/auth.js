
import {Router} from 'express'
import authentication from 'server/middleware/authentication'
import UserModel from 'server/models/user'

const router = new Router()

router.post('/password', authentication(true), async (req, res, next) => {
  req.app.locals.logger.info('/password requested', req.body)
  try {
    const result = await UserModel.changePassword(res.locals.user, req.body)
    res.json({userName: result.userName})
  } catch (err) {
    next(err)
  }
})

router.post('/profile', authentication(true), async (req, res, next) => {
  req.app.locals.logger.info('/update with', req.body)
  try {
    const {id} = res.locals.user
    const {userName} = req.body
    await UserModel.update({userName}, {where: {id}})
    res.json({id, userName})
  } catch (err) {
    next(err)
  }
})

router.get('/profile', authentication(true), (req, res) => {
  req.app.locals.logger.info('/profile requested')
  res.json({userName: res.locals.user.userName})
})

router.post('/register', authentication(false), async (req, res, next) => {
  req.app.locals.logger.info('/register requested', req.body)
  try {
    const token = await UserModel.register(req.body)
    req.session.token = token
    res.json({
      token,
      userName: req.body.userName
    })
  } catch (err) {
    next(err)
  }
})

router.post('/login', authentication(false), async (req, res, next) => {
  req.app.locals.logger.info('/login requested', req.body)
  try {
    const user = await UserModel.login(req.body)
    req.session.token = user.token
    res.json({
      token: user.token,
      userName: user.userName
    })
  } catch (err) {
    next(err)
  }
})

router.post('/logout', authentication(false), async (req, res, next) => {
  req.app.locals.logger.info('/logout requested', req.session.token)
  try {
    await UserModel.logout(req.session.token)
    req.session.destroy()
    res.clearCookie('connect.sid')
    res.json({})
  } catch (err) {
    next(err)
  }
})

export default router
