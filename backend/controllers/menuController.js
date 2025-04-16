import MenuItem from '../models/Menu.js';
import { v2 as cloudinary } from 'cloudinary';

export const getMenuItems = async (req, res) => {
  try {
    const { category, available } = req.query;
    const query = {};
    if (category) query.category = category;
    if (available) query.available = available === 'true';

    const menuItems = await MenuItem.find(query);
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    if (!menuItem) return res.status(404).json({ message: 'Menu item not found' });
    res.json(menuItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createMenuItem = async (req, res) => {
  try {
    const { name, description, price, category, subcategory, available } = req.body;
    let imageUrl = '';

    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: 'restaurant_menu' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(req.file.buffer);
      });
      imageUrl = result.secure_url;
    }

    const menuItem = new MenuItem({
      name,
      description,
      price: Number(price),
      category,
      subcategory,
      image: imageUrl,
      available: available === 'true' || available === true,
    });

    const newMenuItem = await menuItem.save();
    res.status(201).json(newMenuItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateMenuItem = async (req, res) => {
  try {
    const { name, description, price, category, subcategory, available } = req.body;
    
    // Prepare update object - only include fields that are in your schema
    const updateData = {
      name,
      description,
      price: Number(price),
      category,
      subcategory,
      available: available === 'true' || available === true
    };
    
    // Handle image update if a new image is provided
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: 'restaurant_menu' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(req.file.buffer);
      });
      updateData.image = result.secure_url;
    } 
    // Don't include currentImage in updateData as it's not in your schema
    // We'll just not update the image field if no new file is provided
    
    const menuItem = await MenuItem.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      { new: true, runValidators: true }
    );
    
    if (!menuItem) return res.status(404).json({ message: 'Menu item not found' });
    res.json(menuItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    
    // Optional: Delete image from Cloudinary if it exists
    if (menuItem.image && menuItem.image.includes('cloudinary')) {
      // Extract public_id from the Cloudinary URL
      const publicId = menuItem.image.split('/').pop().split('.')[0];
      try {
        await cloudinary.uploader.destroy(`restaurant_menu/${publicId}`);
      } catch (cloudinaryError) {
        // Continue with deletion even if Cloudinary delete fails
        console.error('Failed to delete image from Cloudinary:', cloudinaryError);
      }
    }
    
    // Delete the menu item from database using findByIdAndDelete
    await MenuItem.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};