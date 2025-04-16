// server/middleware/validationMiddleware.js
import Joi from 'joi';
import jwt from 'jsonwebtoken';


// Menu Item Validation
export const validateMenuItem = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().trim().min(2).max(100).required(),
    description: Joi.string().trim().min(10).max(500).required(),
    price: Joi.number().positive().required(),
    category: Joi.string()
      .valid('appetizer', 'main', 'dessert', 'beverage', 'pizza', 'burger')
      .required(),
    subcategory: Joi.string().trim().optional(),
    image: Joi.any().optional(), // For multer file upload
    available: Joi.boolean().optional(),
  }).unknown(false); // Disallow unknown fields

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  next();
};

// Order Validation (Updated to match your Order model)
export const validateOrder = (req, res, next) => {
  const orderItemSchema = Joi.object({
    menuItem: Joi.string().hex().length(24).required(), // MongoDB ObjectId
    quantity: Joi.number().integer().min(1).required(),
    customizations: Joi.array().items(Joi.string().max(500)).optional(),
    totalPrice: Joi.number().positive().required(),
  });

  const schema = Joi.object({
    deliveryAddress: Joi.string().trim().min(5).max(500).required(),
    deliveryInstructions: Joi.string().trim().max(500).optional(),
    deliveryOption: Joi.string().valid('Priority', 'Standard', 'Schedule').required(),
    scheduledTime: Joi.date()
      .optional()
      .allow(null)
      .when('deliveryOption', { is: 'Schedule', then: Joi.required() }),
    deliveryFee: Joi.number().positive().required(),
    taxesAndFees: Joi.number().positive().required(),
    subtotal: Joi.number().positive().required(),
    total: Joi.number().positive().required(),
    paymentMethod: Joi.string().trim().default('Cash on Delivery').optional(),
    items: Joi.array().items(orderItemSchema).min(1).required(),
  }).unknown(false); // Disallow unknown fields

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

// Reservation Validation (Kept as-is, update if needed based on Reservation model)
export const validateReservation = (req, res, next) => {
  const schema = Joi.object({
    customer: Joi.object({
      name: Joi.string().trim().min(2).max(100).required(),
      email: Joi.string().email().required(),
      phone: Joi.string().pattern(/^\+?[\d\s-]{10,15}$/).required(),
    }).required(),
    date: Joi.date().greater('now').required(),
    partySize: Joi.number().integer().min(1).required(),
    specialRequests: Joi.string().max(500).optional(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

// User Validation (Updated with password strength and role enum)
export const validateUser = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().trim().min(2).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string()
      .min(8) // Increased minimum length for security
      .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')) // Require at least one uppercase, one lowercase, one number, and one special character
      .required()
      .messages({
        'string.pattern.base':
          'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)',
      }),
    role: Joi.string().valid('user', 'admin').optional(), // Match User model enum
  }).unknown(false); // Disallow unknown fields

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

// Protect Middleware (Authenticated Users)
export const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }
      next();
    } catch (error) {
      console.error('Token Verification Error:', error.stack); // Debug log
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Admin-Only Middleware
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized, admin only' });
  }
};