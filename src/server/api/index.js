
import {Router} from 'express'
import todo from 'server/api/todo'
import auth from 'server/api/auth'
import locale from 'server/api/locale'

const router = new Router()

router.use('/auth', auth)
router.use('/todo', todo)
router.use('/locale', locale)

export default router
