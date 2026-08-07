import { Router } from 'express'
import { getNearbyPlaces } from '../controllers/placesController.js'
import { requireAuth } from '../middleware/authMiddleware.js'

const router = Router()

router.get('/nearby', requireAuth, getNearbyPlaces)

export default router
