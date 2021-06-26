import express from 'express'
import { signin, signup } from '../controllers/user.js'

const router = express.Router()

router.post('/signin', signin) // sending data to Backend
router.post('/signup', signup)

export default router