// server/routes/userRoutes.js
import express from 'express';
import { 
  registerUser, 
  loginUser, 
  getUserProfile 
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateUser } from '../middleware/validationMiddleware.js';

const router = express.Router();

router.post('/register', validateUser, registerUser); // Public
router.post('/login', loginUser); // Public
router.get('/profile', protect, getUserProfile); // Authenticated users

export default router;