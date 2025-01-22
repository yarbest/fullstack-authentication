import { NextFunction, Request, Response } from 'express'

import ApiError from '../exceptions/ApiError'
import TokenService from '../services/TokenService'

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.method === 'OPTIONS') next()

  try {
    const accessToken = req.headers.authorization?.split(' ')[1]
    if (!accessToken) {
      throw ApiError.UnauthenticatedError()
    }

    TokenService.verifyAccessToken(accessToken)
    next()
  }
  catch (e) {
    next(e)
  }
}

export default authMiddleware
