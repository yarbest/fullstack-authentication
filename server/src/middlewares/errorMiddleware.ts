import { NextFunction, Request, Response } from 'express'

import ApiError from '../exceptions/ApiError'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorMiddleware = <T>(err: ApiError<T>, req: Request, res: Response, next: NextFunction) => {
  console.log(err)
  if (err instanceof ApiError) {
    return res.status(err.status).json({ message: err.message, errors: err.errors })
  }

  res.status(500).json({ message: (err as Error).message })
}

export default errorMiddleware
