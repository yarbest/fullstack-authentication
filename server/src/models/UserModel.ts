import { Schema, model } from 'mongoose'

export interface User {
  email: string
  password: string
  isEmailActivated: boolean
  activationLink?: string
}

export const userShema = new Schema<User>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isEmailActivated: { type: Boolean, default: false },
  activationLink: { type: String },
})

export default model('User', userShema)
