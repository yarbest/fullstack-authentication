export default class ApiError<T> extends Error {
  status: number
  errors: T[]

  constructor(status: number, message: string, errors: T[] = []) {
    super(message)
    this.status = status
    this.errors = errors
  }

  static UnauthenticatedError() {
    return new ApiError(401, 'User is not authenticated')
  }

  static BadRequest<T>(message: string, errors: T[] = []) {
    return new ApiError(400, message, errors)
  }

  static NotFound<T>(message: string, errors: T[] = []) {
    return new ApiError(404, message, errors)
  }
}
