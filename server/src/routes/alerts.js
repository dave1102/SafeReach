import { Router } from 'express'
import { listAlerts, createAlert } from '../controllers/alertsController.js'
import { requireAuth } from '../middleware/authMiddleware.js'

const router = Router()

router.get('/', listAlerts) // public feed, no auth required
router.post('/', requireAuth, createAlert)

export default router
