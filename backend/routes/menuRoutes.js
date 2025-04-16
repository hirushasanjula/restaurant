// server/routes/menuRoutes.js
import express from 'express';
import { 
  getMenuItems, 
  getMenuItem, 
  createMenuItem, 
  updateMenuItem, 
  deleteMenuItem 
} from '../controllers/menuController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { validateMenuItem } from '../middleware/validationMiddleware.js';

const router = express.Router();

router.get('/', getMenuItems); // Public
router.get('/:id', getMenuItem); // Public
router.post('/', protect, adminOnly, validateMenuItem, createMenuItem); // Admin only
router.put('/:id', protect, adminOnly, validateMenuItem, updateMenuItem); // Admin only
router.delete('/:id', protect, adminOnly, deleteMenuItem); // Admin only

export default router;