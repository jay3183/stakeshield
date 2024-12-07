import express from 'express'
import cors from 'cors'
import operatorRoutes from './routes/operators'
import registerOperatorRoutes from './routes/register-operator'
import fraudCheckRoutes from './routes/fraud-check'

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/operators', operatorRoutes)
app.use('/api/register', registerOperatorRoutes)
app.use('/api/fraud-check', fraudCheckRoutes)

const port = process.env.PORT || 3001
app.listen(port, () => console.log(`Server running on port ${port}`)) 