import { compareSync, hash } from 'bcrypt'
import { v4 } from 'uuid'

import MailService from './MailService'
import TokenService from './TokenService'

import { UserDTO } from '../dtos/UserDTO'
import ApiError from '../exceptions/ApiError'
import UserModel, { User } from '../models/UserModel'

class AuthService {
  async register(email: User['email'], password: User['password']) {
    await this._checkExistingUser(email)
    const createdUser = await this._createUser(email, password)
    const { tokens, user } = await this._handleTokens(createdUser)
    return { ...tokens, user }
  }

  async activate(activationLink: string) {
    const userWithActivationLink = await UserModel.findOne({ activationLink })
    if (!userWithActivationLink) {
      throw ApiError.BadRequest('Invalid activation link')
    }
    userWithActivationLink.isEmailActivated = true
    await userWithActivationLink.save()
  }

  async login(email: User['email'], password: User['password']) {
    const existingUser = await UserModel.findOne({ email })
    if (!existingUser) {
      throw ApiError.NotFound('User not found')
    }

    const isMatchingPassword = compareSync(password, existingUser.password)
    if (!isMatchingPassword) {
      throw ApiError.BadRequest('Invalid password')
    }

    const { tokens, user } = await this._handleTokens(existingUser)
    return { ...tokens, user }
  }

  async logout(refreshToken: string) {
    await TokenService.removeRefreshToken(refreshToken)
  }

  async refresh(refreshToken: string) {
    TokenService.verifyRefreshToken(refreshToken)
    const refreshTokenInDB = await TokenService.findRefreshToken(refreshToken)
    if (!refreshTokenInDB) {
      throw ApiError.UnauthenticatedError()
    }

    // we could take user data from refresh token, but it's better to take it from DB
    // bacause refresh token will live 30 days, and user data could be changed/deleted
    const existingUser = await UserModel.findById(refreshTokenInDB.userId)
    if (!existingUser) {
      throw ApiError.NotFound('User not found')
    }

    const { tokens, user } = await this._handleTokens(existingUser)
    return { ...tokens, user }
  }

  async getUsers() {
    const usersFromDB = await UserModel.find()
    const usersDTO = usersFromDB.map(user => new UserDTO(user))
    return usersDTO
  }

  private async _checkExistingUser(email: User['email']) {
    const existingUser = await UserModel.findOne({ email })
    if (existingUser) {
      throw ApiError.BadRequest(`User with this email ${email} already exists`)
    }
  }

  private async _createUser(email: User['email'], password: User['password']) {
    const hashedPassword = await hash(password, 7)
    const activationLink = v4()
    const createdUser = await UserModel.create({
      email,
      password: hashedPassword,
      activationLink,
    })

    await MailService.sendActivationMail(email, `${process.env.API_URL}/activate/${activationLink}`)
    return createdUser
  }

  private async _handleTokens(user: InstanceType<typeof UserModel>) {
    const userDto = new UserDTO(user)
    const tokens = TokenService.generateTokens({ ...userDto })
    await TokenService.storeRefreshToken(userDto.id, tokens.refreshToken)
    return { tokens, user: userDto }
  }
}

export default new AuthService()
