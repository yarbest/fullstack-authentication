import { Types } from 'mongoose'

import UserModel, { User } from '../models/UserModel'

/**
  * data transfer object
  * No Business Logic
  * ensures that only the necessary information is exposed.
 */
export class UserDTO {
  id: Types.ObjectId
  email: User['email']
  isEmailActivated: User['isEmailActivated']

  constructor(user: InstanceType<typeof UserModel>) {
    this.id = user._id
    this.email = user.email
    this.isEmailActivated = user.isEmailActivated
  }
}
