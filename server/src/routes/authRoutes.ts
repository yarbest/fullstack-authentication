import express from 'express'
import { body } from 'express-validator'

import AuthController from '../controllers/AuthController'
import authMiddleware from '../middlewares/authMiddleware'

const app = express()

app.post('/register', [
  body('email').isEmail(),
  body('password').isLength({ min: 3, max: 20 }),
], AuthController.register)
app.post('/login', [
  body('email').notEmpty(),
  body('password').notEmpty(),
], AuthController.login)

app.post('/logout', AuthController.logout) // removes refresh token from DB, and from cookie
app.get('/activate/:link', AuthController.activate)
app.get('/refresh', AuthController.refresh)
app.get('/users', authMiddleware, AuthController.getUsers)

export default app
