// server/routes/reservationRoutes.js
import express from 'express';
import { 
  getReservations, 
  getReservation, 
  createReservation, 
  updateReservation 
} from '../controllers/reservationController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateReservation } from '../middleware/validationMiddleware.js';

const router = express.Router();

router.get('/', protect, getReservations); // Staff or Admin
router.get('/:id', protect, getReservation); // Authenticated users
router.post('/', validateReservation, createReservation); // Public (no auth required)
router.put('/:id', protect, validateReservation, updateReservation); // Staff or Admin

export default router;