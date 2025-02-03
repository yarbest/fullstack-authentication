import jwt from 'jsonwebtoken'
import { Types } from 'mongoose'

import { UserDTO } from '../dtos/UserDTO'
import ApiError from '../exceptions/ApiError'
import RefreshTokenModel from '../models/RefreshTokenModel'

class TokenService {
  generateTokens(jwtUserPayload: InstanceType<typeof UserDTO>) {
    const accessToken = jwt.sign(jwtUserPayload, process.env.JWT_ACCESS_SECRET ?? '', { expiresIn: '30m' })
    const refreshToken = jwt.sign(jwtUserPayload, process.env.JWT_REFRESH_SECRET ?? '', { expiresIn: '30d' })
    return { accessToken, refreshToken }
  }

  verifyAccessToken(accessToken: string) {
    try {
      // verify throws its own error (e.g. - jwt expired), but interceptor on FE wants to catch 401
      // so we throw our own error
      return jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET ?? '') as UserDTO
    }
    catch {
      throw ApiError.UnauthenticatedError()
    }
  }

  verifyRefreshToken(refreshToken: string) {
    try {
      return jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET ?? '') as UserDTO
    }
    catch {
      throw ApiError.UnauthenticatedError()
    }
  }

  findRefreshToken(refreshToken: string) {
    return RefreshTokenModel.findOne({ token: refreshToken })
  }

  async storeRefreshToken(userId: Types.ObjectId, refreshToken: string) {
    // for 1 user there is only 1 refresh token,
    // so if user logs-in in another device, the previous refresh token becomes invalid,
    // because it is replaced with new one in BD
    // and when access token expires, user will have to login again
    const existingToken = await RefreshTokenModel.findOne({ userId })
    if (existingToken) {
      existingToken.token = refreshToken
      await existingToken.save()
      return
    }

    const createdRefreshToken = await RefreshTokenModel.create({ userId, token: refreshToken })
    return createdRefreshToken
  }

  async removeRefreshToken(refreshToken: string) {
    await RefreshTokenModel.deleteOne({ token: refreshToken })
  }
}

export default new TokenService()
