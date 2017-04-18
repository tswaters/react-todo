
import {Router} from 'express'
import todo from './todo'
import auth from './auth'
import locale from './locale'

const router = new Router()

router.use('/auth', auth)
router.use('/todo', todo)
router.use('/locale', locale)

export default router
