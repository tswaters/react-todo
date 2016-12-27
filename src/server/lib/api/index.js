
import {Router} from 'express'
import todo from './todo'
import auth from './auth'

const router = new Router()

router.use('/auth', auth)
router.use('/todo', todo)

export default router
