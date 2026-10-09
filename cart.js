const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Get user's cart
router.get('/:userId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.params.userId })
      .populate('items.product');
    
    if (!cart) {
      return res.json({ items: [], total: 0 });
    }
    
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add item to cart
router.post('/add', async (req, res) => {
  try {
    const { userId, productId, quantity = 1, size, color } = req.body;
    
    let cart = await Cart.findOne({ user: userId });
    
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }
    
    const existingItem = cart.items.find(
      item => item.product.toString() === productId && 
              item.size === size && 
              item.color === color
    );
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity, size, color });
    }
    
    // Calculate total
    await cart.populate('items.product');
    cart.total = cart.items.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity);
    }, 0);
    
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update cart item quantity
router.put('/update', async (req, res) => {
  try {
    const { userId, itemId, quantity } = req.body;
    
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    item.quantity = quantity;
    
    if (quantity <= 0) {
      cart.items.pull(itemId);
    }
    
    // Recalculate total
    await cart.populate('items.product');
    cart.total = cart.items.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity);
    }, 0);
    
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Remove item from cart
router.delete('/remove', async (req, res) => {
  try {
    const { userId, itemId } = req.body;
    
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    cart.items.pull(itemId);
    
    // Recalculate total
    await cart.populate('items.product');
    cart.total = cart.items.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity);
    }, 0);
    
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Clear cart
router.delete('/clear/:userId', async (req, res) => {
  try {
    await Cart.findOneAndDelete({ user: req.params.userId });
    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
