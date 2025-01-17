import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'

const app = express()
const PORT = 5000

const start = async () => {
  try {
    app.listen(PORT, () => {
      console.log('Server is running on port', PORT)
    })
  }
  catch (err) {

  }
}

void start()
