import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { setupRoutes } from './routes/index'
import { errorHandler } from './middleware/error'
import { requestLogger } from './middleware/logging'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3003

app.use(cors())
app.use(express.json())
app.use(requestLogger)

setupRoutes(app)
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
}) 