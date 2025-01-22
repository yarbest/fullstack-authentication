import { RequestHandler, Response } from 'express'
import { validationResult } from 'express-validator'

import ApiError from '../exceptions/ApiError'
import { User } from '../models/UserModel'
import AuthService from '../services/AuthService'

const REFRESH_TOKEN_COOKIE_NAME = 'refreshToken'

class AuthController {
  register: RequestHandler<object, object, Pick<User, 'email' | 'password'>> = async (req, res, next) => {
    try {
      const { email, password } = req.body
      const validationErrors = validationResult(req)
      if (!validationErrors.isEmpty()) {
        throw ApiError.BadRequest('Validation error', validationErrors.array())
      }

      const { accessToken, refreshToken, user } = await AuthService.register(email, password)
      this._sendRefreshTokenCookie(res, refreshToken)
      res.status(201).json({ accessToken, refreshToken, user })
    }
    catch (e) {
      next(e)
    }
  }

  login: RequestHandler<object, object, Pick<User, 'email' | 'password'>> = async (req, res, next) => {
    try {
      const { email, password } = req.body
      const validationErrors = validationResult(req)
      if (!validationErrors.isEmpty()) {
        throw ApiError.BadRequest('Validation error', validationErrors.array())
      }

      const { accessToken, refreshToken, user } = await AuthService.login(email, password)
      this._sendRefreshTokenCookie(res, refreshToken)
      res.json({ accessToken, refreshToken, user })
    }
    catch (e) {
      next(e)
    }
  }

  logout: RequestHandler = async (req, res, next) => {
    try {
      const refreshToken = (req.cookies as Record<string, string>)[REFRESH_TOKEN_COOKIE_NAME]
      await AuthService.logout(refreshToken)
      res.clearCookie(REFRESH_TOKEN_COOKIE_NAME)
      res.json({ message: 'User logged out' })
    }
    catch (e) {
      next(e)
    }
  }

  activate: RequestHandler<{ link: string }> = async (req, res, next) => {
    try {
      const activationLink = req.params.link
      await AuthService.activate(activationLink)
      // when user clicks on activation link, they go to 'http://localhost:5000/api/activate/:link
      // which is GET request on BE, then this request is handled by this controller's method
      // and after successful activation, user is redirected to FE
      // BE - 'http://localhost:5000/api', FE - 'http://localhost:5173'
      res.redirect(process.env.CLIENT_URL ?? '')
    }
    catch (e) {
      next(e)
    }
  }

  refresh: RequestHandler = async (req, res, next) => {
    try {
      const refreshToken = (req.cookies as Record<string, string>)[REFRESH_TOKEN_COOKIE_NAME]
      const { accessToken, refreshToken: newRefreshToken, user } = await AuthService.refresh(refreshToken)
      res.cookie(REFRESH_TOKEN_COOKIE_NAME, newRefreshToken)
      res.json({ accessToken, refreshToken: newRefreshToken, user })
    }
    catch (e) {
      next(e)
    }
  }

  getUsers: RequestHandler = async (req, res, next) => {
    try {
      const users = await AuthService.getUsers()
      res.json(users)
    }
    catch (e) {
      next(e)
    }
  }

  private _sendRefreshTokenCookie(res: Response, refreshToken: string) {
    // secure: true - send cookie only for https
    res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 })
  }
}

export default new AuthController()
