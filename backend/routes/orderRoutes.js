import express from 'express';
import { createOrder, getAllOrders } from '../controllers/orderController.js';
import { protect,adminOnly } from '../middleware/authMiddleware.js';


const router = express.Router();

router.post('/', protect, createOrder);
router.get('/admin', protect, adminOnly, getAllOrders);

export default router;