const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');
const router = express.Router();

// Get user's cart
router.get('/', auth, async (req, res) => {
  const user = await User.findById(req.user._id).populate('cart.item');
  res.json(user.cart);
});

// Add/Update item qty in cart
router.post('/add', auth, async (req, res) => {
  const { itemId, qty = 1 } = req.body;
  if (!itemId) return res.status(400).json({ message: 'Missing itemId' });
  const user = await User.findById(req.user._id);
  const existing = user.cart.find(ci => ci.item.toString() === itemId);
  if (existing) {
    existing.qty = Math.max(1, Number(qty));
  } else {
    user.cart.push({ item: itemId, qty: Number(qty) });
  }
  await user.save();
  await user.populate('cart.item');
  res.json(user.cart);
});

// Remove item
router.post('/remove', auth, async (req, res) => {
  const { itemId } = req.body;
  if (!itemId) return res.status(400).json({ message: 'Missing itemId' });
  const user = await User.findById(req.user._id);
  user.cart = user.cart.filter(ci => ci.item.toString() !== itemId);
  await user.save();
  await user.populate('cart.item');
  res.json(user.cart);
});

// Merge guest cart into user cart on login
router.post('/merge', auth, async (req, res) => {
  const { guestCart } = req.body;
  if (!Array.isArray(guestCart)) return res.status(400).json({ message: 'guestCart required' });
  const user = await User.findById(req.user._id);
  for (const g of guestCart) {
    const existing = user.cart.find(ci => ci.item.toString() === g.itemId);
    if (existing) existing.qty = Math.max(existing.qty, g.qty);
    else user.cart.push({ item: g.itemId, qty: g.qty });
  }
  await user.save();
  await user.populate('cart.item');
  res.json(user.cart);
});

module.exports = router;
