import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express, { NextFunction, Request, Response } from 'express'
import mongoose from 'mongoose'
dotenv.config()

import ApiError from './exceptions/ApiError'
import errorMiddleware from './middlewares/errorMiddleware'
import authRoutes from './routes/authRoutes'

const app = express()
app.use(express.json())
app.use(cookieParser()) // add adds property request.cookies
app.use(cors({
  credentials: true, // allow cookies from the client
  origin: process.env.CLIENT_URL, // allow requests from this client
}))
app.use('/api', authRoutes)
app.use(<T>(err: ApiError<T>, req: Request, res: Response, next: NextFunction) => {
  errorMiddleware(err, req, res, next) // middleware for error handling should be the last middleware
})

const PORT = process.env.PORT ?? 8080

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL ?? '')
    app.listen(PORT, () => {
      console.log('Server is running on port', PORT)
    })
  }
  catch (e) {
    console.log(e)
  }
}

void start()
