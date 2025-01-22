import { Schema, Types, model } from 'mongoose'

export interface RefreshToken {
  userId: Types.ObjectId
  token: string
}

const refreshTokenSchema = new Schema<RefreshToken>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  token: { type: String, required: true },
})

export default model('RefreshToken', refreshTokenSchema)
