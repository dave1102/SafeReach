import { Router } from 'express'
import { rateLimit } from 'express-rate-limit'
import { askAssistant } from '../controllers/aiController.js'
import { requireAuth } from '../middleware/authMiddleware.js'

const router = Router()

// Tighter limit on the AI endpoint specifically — it's the most
// expensive route to call (proxies a paid LLM API).
const aiLimiter = rateLimit({ windowMs: 60 * 1000, max: 15 })

router.post('/assistant', requireAuth, aiLimiter, askAssistant)

export default router
