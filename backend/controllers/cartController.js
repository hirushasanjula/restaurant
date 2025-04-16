import Cart from '../models/Cart.js';
import MenuItem from '../models/Menu.js';

// Get user's cart
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.menuItem');
    if (!cart) {
      return res.status(200).json({ user: req.user._id, items: [] });
    }
    res.json(cart);
  } catch (error) {
    console.error('Get Cart Error:', error.stack);
    res.status(500).json({ message: 'Server error fetching cart', error: error.message });
  }
};

// Add item to cart
export const addToCart = async (req, res) => {
  try {
    const { menuItemId, quantity = 1, customizations = [] } = req.body;

    // Validate menu item exists
    const menuItem = await MenuItem.findById(menuItemId);
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      item =>
        item.menuItem.toString() === menuItemId &&
        JSON.stringify(item.customizations.sort()) === JSON.stringify(customizations.sort())
    );

    if (existingItemIndex > -1) {
      // Update existing item
      cart.items[existingItemIndex].quantity += quantity;
      cart.items[existingItemIndex].totalPrice =
        menuItem.price * cart.items[existingItemIndex].quantity; // Calculate totalPrice
    } else {
      // Add new item with totalPrice
      cart.items.push({
        menuItem: menuItemId,
        quantity,
        customizations,
        totalPrice: menuItem.price * quantity, // Set totalPrice
      });
    }

    await cart.save();
    await cart.populate('items.menuItem');
    res.status(201).json(cart);
  } catch (error) {
    console.error('Add to Cart Error:', error.stack);
    res.status(400).json({ message: 'Error adding to cart', error: error.message });
  }
};

// Update cart item (quantity or customizations)
export const updateCartItem = async (req, res) => {
  try {
    const { itemId, quantity, customizations } = req.body;

    const cart = await Cart.findOne({ user: req.user._id }).populate('items.menuItem');
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    if (quantity !== undefined) cart.items[itemIndex].quantity = quantity;
    if (customizations !== undefined) cart.items[itemIndex].customizations = customizations;

    // Recalculate totalPrice
    cart.items[itemIndex].totalPrice =
      cart.items[itemIndex].menuItem.price * cart.items[itemIndex].quantity;

    if (cart.items[itemIndex].quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    }

    await cart.save();
    await cart.populate('items.menuItem');
    res.json(cart);
  } catch (error) {
    console.error('Update Cart Error:', error.stack);
    res.status(400).json({ message: 'Error updating cart', error: error.message });
  }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(item => item._id.toString() !== itemId);
    await cart.save();
    await cart.populate('items.menuItem');
    res.json(cart);
  } catch (error) {
    console.error('Remove from Cart Error:', error.stack);
    res.status(500).json({ message: 'Error removing from cart', error: error.message });
  }
};

// Clear cart
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(200).json({ message: 'Cart already empty' });
    }
    cart.items = [];
    await cart.save();
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    console.error('Clear Cart Error:', error.stack);
    res.status(500).json({ message: 'Error clearing cart', error: error.message });
  }
};