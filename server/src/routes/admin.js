import { Router } from 'express'
import { requireAuth, requireAdmin } from '../middleware/authMiddleware.js'
import {
  getAnalytics, listPendingHospitals, approveHospital, rejectHospital
} from '../controllers/adminController.js'

const router = Router()

router.use(requireAuth, requireAdmin)

router.get('/analytics', getAnalytics)
router.get('/hospitals/pending', listPendingHospitals)
router.post('/hospitals/:id/approve', approveHospital)
router.post('/hospitals/:id/reject', rejectHospital)

export default router
