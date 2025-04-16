// server/controllers/orderController.js
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';

export const createOrder = async (req, res) => {
  try {
    const {
      deliveryAddress,
      deliveryInstructions,
      deliveryOption,
      scheduledTime,
      paymentMethod,
    } = req.body;

    const cart = await Cart.findOne({ user: req.user._id }).populate('items.menuItem');
    if (!cart || !cart.items.length) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Map cart items to ensure totalPrice is set
    const orderItems = cart.items.map(item => ({
      menuItem: item.menuItem._id,
      quantity: item.quantity,
      customizations: item.customizations,
      totalPrice: item.totalPrice || item.menuItem.price * item.quantity, // Calculate if missing
    }));

    const deliveryFees = {
      Priority: 129.00,
      Standard: 39.00,
      Schedule: 39.00,
    };
    const deliveryFee = deliveryFees[deliveryOption] || 39.00;
    const subtotal = orderItems.reduce((sum, item) => sum + item.totalPrice, 0);
    const taxesAndFees = subtotal * 0.23; // 23% tax (adjust as needed)
    const total = subtotal + deliveryFee + taxesAndFees;

    const order = new Order({
      user: req.user._id,
      items: orderItems, // Use the mapped items with totalPrice
      deliveryAddress,
      deliveryInstructions,
      deliveryOption,
      scheduledTime: deliveryOption === 'Schedule' ? scheduledTime : null,
      deliveryFee,
      taxesAndFees,
      subtotal,
      total,
      paymentMethod: paymentMethod || 'Cash on Delivery',
    });

    await order.save();
    await order.populate('items.menuItem');

    // Clear the cart
    cart.items = [];
    await cart.save();

    res.status(201).json(order);
  } catch (error) {
    console.error('Create Order Error:', error.stack);
    res.status(500).json({ message: 'Error creating order', error: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email') // Populate user details (name, email)
      .populate('items.menuItem', 'name price'); // Populate menu item details (name, price)

    res.json(orders);
  } catch (error) {
    console.error('Get All Orders Error:', error.stack);
    res.status(500).json({ message: 'Server error fetching orders', error: error.message });
  }
};

// Existing order controller functions (for reference, assuming they exist)
// Example: Create an order (for users)
