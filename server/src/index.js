import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import { rateLimit } from 'express-rate-limit'

import aiRoutes from './routes/ai.js'
import placesRoutes from './routes/places.js'
import alertsRoutes from './routes/alerts.js'
import adminRoutes from './routes/admin.js'
import { errorHandler } from './middleware/errorHandler.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(helmet())
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }))
app.use(express.json({ limit: '1mb' }))

// Generous overall limit, with a tighter one on the AI route specifically
// (see routes/ai.js) since that's the most expensive endpoint to abuse.
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 300 }))

app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'overflow-ai-api' }))

app.use('/api/ai', aiRoutes)
app.use('/api/places', placesRoutes)
app.use('/api/alerts', alertsRoutes)
app.use('/api/admin', adminRoutes)

app.use((req, res) => res.status(404).json({ message: 'Not found' }))
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Overflow AI API listening on port ${PORT}`)
})
